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
    title: '什么是向量数据建库？在LLM应用开发中它主要解决什么问题？',
    desc:  '向量数据库专用于存储与检索高维向量，核心能力为相似性搜索，通过Embedding模型将文本、图像等非结构化数据转为向量，解决大模型知识时效性…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166840035',
    tags:  ['人工智能', '算法'],
  },
  {
    date:  '2026.09.27',
    title: 'Agent开发岗位必备认知',
    desc:  'Agent开发三阶段学习路线：先掌握CoT、ReAct、RAG等核心理论，再通过RAG问答、工具调用、多轮对话等Demo项目夯实基础…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/166735471',
    tags:  ['langchain', '人工智能'],
  },
  {
    date:  '2026.09.01',
    title: '【AI Agent案例开发项目01解读】',
    desc:  '拆解一个面向中国法律领域的轻量本地 RAG 项目（LangChain + Qwen3 + BGE-M3 + ChromaDB），从后端启动讲到可插拔的检索、重排与生成策略。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/163925993',
    tags:  ['python', 'langchain'],
  },
  {
    date:  '2026.08.19',
    title: 'Langchain08_RAG',
    desc:  'LangChain 实战 RAG：RAG 基础知识、文档加载器（Document Loaders）与文档切分器（Text Splitters）。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/163827693',
    tags:  ['ai', 'langchain'],
  },
  {
    date:  '2026.08.19',
    title: 'Milvus向量数据库入门',
    desc:  '从业务角度，Milvus数据模型层级如下：在传统数据库中，如果你想存储用户信息，你会建一张表叫 user_table；想存储商品…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/163881796',
    tags:  ['数据库', 'milvus'],
  },
  {
    date:  '2026.08.17',
    title: 'Langchain07_上下文与记忆',
    desc:  'LangChain 记忆机制：短期记忆的持久化（内存 / 外部存储）、记忆治理与 state，以及长期记忆的基础 API 和在 Agent 运行图中的读写时机。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/163669750',
    tags:  ['ai', 'langchain'],
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
