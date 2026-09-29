#!/usr/bin/env node
/* ============================================================
   从 CSDN 同步最近文章 → 重写 js/blog.js 里的 POSTS 数组
   ------------------------------------------------------------
   用法：node scripts/sync-blog.js
   GitHub Actions 每天自动跑一次（.github/workflows/sync-blog.yml）。

   为什么必须在「构建时」抓、不能让网页自己抓：
   CSDN 那个接口不返回 Access-Control-Allow-Origin，
   浏览器里 fetch 会被 CORS 拦死（OPTIONS 预检也没有对应头，
   JSONP 也不支持——加了 callback 参数返回的是反爬 HTML 页）。
   所以只能提前抓好写进文件，页面照旧是纯静态的、零网络请求。

   为什么必须带 Referer：
   CSDN 有防盗链。只带浏览器 UA 会被返回 521 反爬页，
   必须同时带 Referer: https://blog.csdn.net/<用户名> 才放行。
   ============================================================ */

const fs = require('fs');
const path = require('path');

const USERNAME = 'm0_59777389';
const COUNT = 6;                    // 页面上展示几篇
const DESC_MAX = 78;                // 描述截断长度（字），太长会把卡片撑高

const BLOG_JS = path.join(__dirname, '..', 'js', 'blog.js');
const START = '/* SYNC:START */';
const END = '/* SYNC:END */';

/* 想把某篇文章的描述换成自己手写的，在这里按文章 id 加一条，
   同步时会优先用它，就不会被 CSDN 的自动摘要覆盖。

   什么时候需要加：CSDN 的摘要是机器从正文里抽的，遇到
   「抽出来是正文碎片」或者「一上来就是『项目地址：GitHub - xxx』」
   这种没法自动挽救的，就在这里手写一句。
   加过的条目会一直生效——改了文章想更新描述，记得回来改这里。   */
const DESC_OVERRIDES = {
  // 摘要开头是「项目地址：GitHub - Teeeeen/legal_rag: ...」，读着像贴错了
  '163925993': '拆解一个面向中国法律领域的轻量本地 RAG 项目（LangChain + Qwen3 + BGE-M3 + ChromaDB），从后端启动讲到可插拔的检索、重排与生成策略。',
  // 摘要被抽成了正文碎片（chunk_id、分隔线），脚本判为乱码后留空，这里补上
  '163827693': 'LangChain 实战 RAG：RAG 基础知识、文档加载器（Document Loaders）与文档切分器（Text Splitters）。',
  // 摘要从「1.— 类方法工厂这不是普通的构造函数调用」开始，半句话，接不上
  '163669750': 'LangChain 记忆机制：短期记忆的持久化（内存 / 外部存储）、记忆治理与 state，以及长期记忆的基础 API 和在 Agent 运行图中的读写时机。',
};


/* 把时间戳 "2026-09-29 14:50:49" 变成页面上显示的 "2026.09.29" */
function fmtDate(postTime) {
  const m = String(postTime).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : String(postTime || '');
}

/* CSDN 的摘要都是从正文里自动抽的，有三个毛病：
     1. 太长（实测 180~256 字），卡片放不下；
     2. 偶尔抽到正文碎片，冒出 chunk_id=36、===== 这种乱码；
     3. 经常从半句话开始。
   这里做两件事：认出乱码就留空（前端不渲染空段落），
   以及截到句子边界，别把词切一半。 */
function cleanDesc(raw) {
  const s = String(raw || '')
    .replace(/\\[nrt]/g, ' ')      // 转义的换行符
    .replace(/\s+/g, ' ')
    // CSDN 正文里常出现「user_table ；」这种中文标点前多一个空格的情况
    .replace(/\s+([，。；：！？、）」』】])/g, '$1')
    .trim();

  if (!s) return '';

  // 抽到正文片段的特征：带 chunk_id、长分隔线、相对路径、[片段N
  if (/chunk_id|={5,}|\[\s*片段|\.\.\//.test(s)) return '';

  if (s.length <= DESC_MAX) return s;

  const head = s.slice(0, DESC_MAX);

  // 能在长度内收在一个完整句子上，就正好停在那儿，不用加省略号
  const sent = Math.max(
    head.lastIndexOf('。'), head.lastIndexOf('！'), head.lastIndexOf('？'),
  );
  if (sent > DESC_MAX * 0.5) return head.slice(0, sent + 1);

  // 收不在句子上，就退到最近的停顿处，去掉尾标点再补省略号。
  // 不然会出现「……转为向量，」这种断在半句、还留着个逗号的怪样子
  const stop = Math.max(
    head.lastIndexOf('，'), head.lastIndexOf('；'), head.lastIndexOf('、'),
  );
  const body = stop > DESC_MAX * 0.5 ? head.slice(0, stop) : head;
  return body.replace(/[，、；：,;:\s]+$/, '') + '…';
}

/* 生成安全的 JS 单引号字符串字面量。
   标题是外部输入，里面可能有引号或反斜杠，直接拼会把文件写坏 */
function jsStr(s) {
  return "'" + String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/[\r\n]+/g, ' ')
    + "'";
}

function buildBlock(posts) {
  const items = posts.map(p => [
    '  {',
    `    date:  ${jsStr(p.date)},`,
    `    title: ${jsStr(p.title)},`,
    `    desc:  ${jsStr(p.desc)},`,
    `    url:   ${jsStr(p.url)},`,
    // 标签也走 jsStr，跟上面几行保持同一种引号风格（JSON.stringify 会给双引号）
    `    tags:  [${p.tags.map(jsStr).join(', ')}],`,
    '  },',
  ].join('\n')).join('\n');

  return `const POSTS = [\n${items}\n];`;
}

async function main() {
  const api = 'https://blog.csdn.net/community/home-api/v1/get-business-list'
            + `?page=1&size=20&businessType=blog&username=${USERNAME}`;

  let json;
  try {
    const res = await fetch(api, {
      headers: {
        // UA 和 Referer 缺一不可，少哪个都是 521
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                    + '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Referer': `https://blog.csdn.net/${USERNAME}`,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    json = await res.json();
  } catch (e) {
    // 关键：拉不到就原样退出，绝不清空已有内容。
    // 要是一失败就写空数组，CSDN 抽风一次线上博客区就白了。
    console.error(`✗ 拉取 CSDN 失败：${e.message}`);
    console.error('  已保留 js/blog.js 的现有内容，未做任何修改。');
    process.exit(1);
  }

  const list = (json && json.data && json.data.list) || [];
  if (!list.length) {
    console.error('✗ 接口返回成功，但文章列表是空的。保留现有内容。');
    process.exit(1);
  }

  // 不信接口给的顺序，自己按发布时间倒序排一遍
  const posts = list
    .slice()
    .sort((a, b) => new Date(b.postTime) - new Date(a.postTime))
    .slice(0, COUNT)
    .map(p => ({
      date: fmtDate(p.postTime),
      title: p.title || '',
      // 手写覆盖优先于自动摘要
      desc: DESC_OVERRIDES[String(p.articleId)] || cleanDesc(p.description),
      url: p.url || `https://blog.csdn.net/${USERNAME}/article/details/${p.articleId}`,
      // CSDN 自动打的标签偶尔跑偏（RAG 那篇被打过「中间件」），只取前两个
      tags: (p.tags || []).slice(0, 2),
    }));

  const src = fs.readFileSync(BLOG_JS, 'utf8');
  const a = src.indexOf(START);
  const b = src.indexOf(END);
  if (a === -1 || b === -1 || b < a) {
    console.error(`✗ js/blog.js 里找不到 ${START} 和 ${END} 标记，无法定位替换范围。`);
    process.exit(1);
  }

  const next = src.slice(0, a + START.length) + '\n' + buildBlock(posts) + '\n' + src.slice(b);

  if (next === src) {
    console.log(`✓ 最近 ${posts.length} 篇与线上一致，文件未改动。`);
    return;
  }

  fs.writeFileSync(BLOG_JS, next, 'utf8');
  console.log(`✓ 已更新 ${posts.length} 篇：`);
  posts.forEach(p => console.log(`    ${p.date}  ${p.title}`));
}

main();
