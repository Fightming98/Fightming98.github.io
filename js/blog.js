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
    date:  '2026.10.08',
    title: '大模型微调技术LoRA、Q-LoRA等',
    desc:  '本文系统介绍大模型微调技术：首先概述基础微调方法，指出其参数量大、成本高的局限；随后详解LoRA（低秩适应）技术，通过引入低秩矩阵分解…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167279277',
    tags:  ['人工智能', 'LoRA'],
  },
  {
    date:  '2026.10.08',
    title: 'AI项目中，如何选择合适的硬件和软件架构？',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167279129',
    tags:  ['人工智能', 'AI应用'],
  },
  {
    date:  '2026.10.08',
    title: '如何使用PyTorch或TensorFlow构建+训练一个DL模型？',
    desc:  '本文对比了TensorFlow与PyTorch实现相同神经网络模型的过程。两者均构建包含一个隐藏层的全连接网络，用于手写数字分类（784维输入…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167278911',
    tags:  ['pytorch', 'tensorflow'],
  },
  {
    date:  '2026.10.08',
    title: '如何处理AI模型的公平性与透明性问题？',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167278800',
    tags:  ['人工智能', 'AI应用'],
  },
  {
    date:  '2026.10.08',
    title: '生产环境下，如何监控和维护AI模型的性能？',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167278707',
    tags:  ['人工智能', 'AI应用'],
  },
  {
    date:  '2026.10.08',
    title: '举例说明一个AI项目从需求分析到部署的完整流程',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167276822',
    tags:  ['人工智能', 'AI应用'],
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
