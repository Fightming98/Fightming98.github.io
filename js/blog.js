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
    date:  '2026.09.29',
    title: 'RAG中数据清洗与预处理阶段具体如何做？',
    desc:  '本文提出一套多格式文档的智能预处理流程：通过PyPDF2、BeautifulSoup、Pandas统一提取文本；结合去重、降噪与PII检测实现清洗…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166847883',
    tags:  ['AI-native', '算法'],
  },
  {
    date:  '2026.09.29',
    title: 'RAG的完整流程',
    desc:  '本文系统阐述了RAG（检索增强生成）的核心流程：首先理解任务需求，采用合理文档分块策略提升信息粒度；在检索阶段优化召回准确率…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166847580',
    tags:  ['AI-native', '算法'],
  },
  {
    date:  '2026.09.29',
    title: 'RAG中的混合检索',
    desc:  'Elasticsearch（及OpenSearch）原生支持关键词与向量混合检索，具备成熟倒排索引与HNSW向量搜索能力，适合高精度文本与语义融合场景…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166847251',
    tags:  ['AI-native', '算法'],
  },
  {
    date:  '2026.09.29',
    title: 'RAG中的重排序怎么做？',
    desc:  '重排序旨在提升检索结果相关性，弥补双编码器（如BGE-M3）因独立编码导致的交互不足。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166846775',
    tags:  ['AI-native', '人工智能'],
  },
  {
    date:  '2026.09.29',
    title: 'RAG的主要流程',
    desc:  'RAG（检索增强生成）通过结合外部知识库与大模型生成能力，提升回答准确性。其核心流程为：用户提问→检索相关文档→将检索内容与问题一同输入模型生成答案。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166846333',
    tags:  ['AI-native', 'milvus'],
  },
  {
    date:  '2026.09.29',
    title: 'RAG系统中，如何处理PDF文档中的表格？',
    desc:  '本文围绕表格处理难题，提出系统化解决方案：首先分析表格结构复杂、语义模糊导致提取困难的原因；选用OCR与NLP结合的工具提升识别精度…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166845594',
    tags:  ['AI-native', 'pdf'],
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
