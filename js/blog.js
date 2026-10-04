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
    date:  '2026.10.03',
    title: 'Agent系统中如何设计优雅的终止条件？避免死循环有哪些策略？',
    desc:  '"result_summary": "返回 10 条结果，前 3 条相关度高","progress": "已获取基础资料，待整理"# 检测重复模式。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167037892',
    tags:  ['AI-native', 'Agent'],
  },
  {
    date:  '2026.10.03',
    title: 'ReAct推理范式与Reflexion推理范式',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167037571',
    tags:  ['react', 'AI-native'],
  },
  {
    date:  '2026.10.03',
    title: 'Agent Loop智能体循环包含哪些步骤？',
    desc:  '【代码】Agent Loop智能体循环包含哪些步骤？',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167037451',
    tags:  ['AI-native', 'ai'],
  },
  {
    date:  '2026.10.03',
    title: '工具调用返回超大结果时，Agent如何处理？',
    desc:  '【代码】工具调用返回超大结果时，Agent如何处理？',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167036448',
    tags:  ['AI-native', 'ai'],
  },
  {
    date:  '2026.10.03',
    title: '为什么说上下文窗口是Agent工程最核心的约束？',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167036321',
    tags:  ['AI-native', 'ai'],
  },
  {
    date:  '2026.10.03',
    title: 'Agent中工具调用的基本流程',
    desc:  '【代码】Agent中工具调用的基本流程。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167036080',
    tags:  ['AI-native', 'ai'],
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
