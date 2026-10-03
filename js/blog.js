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
    date:  '2026.10.02',
    title: '如何优化RAG的检索效果？',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166992350',
    tags:  ['AI-native'],
  },
  {
    date:  '2026.10.02',
    title: 'RAG应用中Prompt模板设计技巧',
    desc:  '【代码】RAG应用中Prompt模板设计技巧。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166992115',
    tags:  ['prompt', 'AI-native'],
  },
  {
    date:  '2026.10.02',
    title: '向量数据库的工作流程详解',
    desc:  '向量数据库通过将数据映射为高维向量，利用索引结构（如HNSW、LSH、PQ）实现高效近似最近邻（ANN）检索。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166991483',
    tags:  ['数据库', 'milvus'],
  },
  {
    date:  '2026.10.02',
    title: '在RAG的索引流程中，文档解析怎么做？',
    desc:  '',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166991377',
    tags:  ['AI-native'],
  },
  {
    date:  '2026.10.02',
    title: 'RAG中为什么要做Embedding？嵌入模型如何选？',
    desc:  '本文介绍文本嵌入（Embedding）基础，使用Sentence-BERT模型将文本转为向量，并通过余弦相似度计算语义相近性。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166990525',
    tags:  ['embedding', 'AI-native'],
  },
  {
    date:  '2026.10.02',
    title: 'RAG中的分块、与分块策略',
    desc:  '本文系统介绍文本分块的核心要点：明确基础知识，合理设定分块大小以平衡信息完整性与处理效率；强调元数据标注的重要性，提升检索准确性…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166990280',
    tags:  ['AI-native'],
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
