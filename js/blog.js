/* ============================================================
   博客列表
   ------------------------------------------------------------
   数据不用手写：scripts/sync-blog.js 会从 CSDN 拉最近 6 篇，
   由 GitHub Actions 每天自动跑一次并提交。

   ⚠️ SYNC:START 到 SYNC:END 之间是自动生成区。
      手改这里的内容，下次同步会被原样覆盖。
      想永久改某篇的描述，去 scripts/sync-blog.js 的 DESC_OVERRIDES 里加。
   ============================================================ */

/* SYNC:START */
const POSTS = [
  {
    date:  '2026.10.14',
    title: '提示词工程02',
    desc:  '本文系统阐述了提示词工程的核心技巧：通过任务分解明确需求，运用正负向提示精准控制输出，优化长提示词提升效率，实现提示词链接与领域专用化。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167892356',
    tags:  ['Prompt', '提示词工程'],
  },
  {
    date:  '2026.10.11',
    title: '提示词工程01',
    desc:  '本文系统梳理了高效Prompt设计的核心技巧：包含结构化指令、角色设定、格式控制、约束条件与Few-shot示例，结合CoT思维链…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167588540',
    tags:  ['提示词工程', 'Prompt'],
  },
  {
    date:  '2026.10.11',
    title: 'LlamaIndex如何与LangChain结合？',
    desc:  '本文介绍了基于LlamaIndex与LangChain集成的Agent开发思路，重点阐述工具配置（IndexToolConfig）…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167587812',
    tags:  ['langchain', 'llamaindex'],
  },
  {
    date:  '2026.10.11',
    title: '什么是LangChain Model、LangChain Agent？',
    desc:  '本文系统讲解LangChain核心组件：区分LLM与ChatModel，实战Prompt模板设计，规避输出解析器常见陷阱，解析流式输出原理。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167587639',
    tags:  ['langchain', 'Model'],
  },
  {
    date:  '2026.10.11',
    title: 'LangChain的核心架构',
    desc:  'LangServe将LangChain链快速转为API，通过FastAPI实现，一行代码即可暴露服务。拆包便于模块化与复用，提升可维护性。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167587540',
    tags:  ['langchain', 'LangServer'],
  },
  {
    date:  '2026.10.11',
    title: '什么是LangChain？',
    desc:  'LangChain 1.0核心升级为统一的Runnable接口，实现链式调用与模块化设计。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167587335',
    tags:  ['langchain1.0', 'Runnable接口'],
  },
];
/* SYNC:END */


/* ============================================================
   下面是渲染逻辑，一般不需要改
   ============================================================ */

(function renderBlog() {
  const list = document.getElementById('blog-list');
  if (!list) return;   // 页面上没有博客板块，直接跳过

  // 一篇文章都没有时，显示一句提示而不是空白。
  // 正常情况不会走到这里——同步脚本拉不到数据时会保留旧内容，
  // 只有真的没同步过、或者 CSDN 那边一篇文章都没有，才会空
  if (!POSTS.length) {
    list.innerHTML =
      '<p class="blog-empty">还没有发布文章。在 js/blog.js 的 POSTS 数组里添加即可显示。</p>';
    return;
  }

  // 把每篇文章变成一个卡片
  list.innerHTML = POSTS.map(post => {
    // 标签是可选的，没有就不渲染这一块
    const tags = (post.tags && post.tags.length)
      ? `<div class="tags">${post.tags.map(t =>
          `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>`
      : '';

    // 描述也做成可选的：CSDN 偶尔会把摘要抓成乱码，
    // 同步脚本识别出来后会留空，这时整段 <p> 都不渲染，
    // 免得卡片里多出一个空行
    const desc = post.desc
      ? `<p>${escapeHTML(post.desc)}</p>`
      : '';

    return `
      <a class="blog-card reveal" href="${escapeHTML(post.url || '#')}"
         ${post.url ? 'target="_blank" rel="noopener"' : ''}>
        <span class="blog-date">${escapeHTML(post.date || '')}</span>
        <h3>${escapeHTML(post.title || '')}</h3>
        ${desc}
        ${tags}
      </a>`;
  }).join('');
})();


/**
 * 把 < > & " 这些字符转义掉。
 * 如果不转义，标题里写个 <script> 就会被当成代码执行。
 * 现在标题是脚本从 CSDN 拉来的，属于外部输入，这层转义就更必要了。
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
