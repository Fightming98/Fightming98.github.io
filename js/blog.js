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
    date:  '2026.10.07',
    title: 'AutoGPT这种自主性Agent框架，如何实现自主决策的？',
    desc:  '本文探讨大模型实现自主决策的六大核心要素：基于任务分解的基本思路，通过Prompt工程构建决策逻辑；依赖工具调用机制拓展外部能力…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167219403',
    tags:  ['AutoGPT', '自主性Agent'],
  },
  {
    date:  '2026.10.07',
    title: '几种主流的Agent框架各自的特点？LangChain、LangGraph、LlamaIndex、BabyAGI等',
    desc:  '本文梳理了智能体开发的核心思路，介绍LangChain通过工具链与LLM构建Agent的实现方式，强调其零样本反思（zero-shot-react）能力…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167219205',
    tags:  ['langchain', 'LlamaIndex'],
  },
  {
    date:  '2026.10.07',
    title: 'Agent在多模态任务中如何执行推理？',
    desc:  '本文基于GPT-4 Vision模型，通过Base64编码上传图像，实现图文理解与问答。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167218982',
    tags:  ['Agent', '多模态'],
  },
  {
    date:  '2026.10.07',
    title: 'Agent如何进行动态API调用？Function Calling？插件？',
    desc:  '本文以OpenAI Function Calling为例，介绍其调用流程：通过定义工具函数（如获取天气），模型在对话中判断是否需调用外部API…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167218124',
    tags:  ['工具调用', 'Agent'],
  },
  {
    date:  '2026.10.07',
    title: '让Agent具备长期记忆的两种方法（RAG只是其一）',
    desc:  '本文围绕大模型应用中的关键挑战，提出MemGPT的分层记忆架构，实现高效长上下文管理。通过分层存储与动态检索机制，提升记忆利用率与响应精度。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167217118',
    tags:  ['RAG', '分层记忆'],
  },
  {
    date:  '2026.10.05',
    title: 'Agent完整工作过程',
    desc:  '本文概述大模型规划能力的基本思路，聚焦当前主流的ReAct框架，结合思维链（Chain-of-Thought）与环境交互实现动态决策。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167128270',
    tags:  ['ReAct', 'Agent完整工作流程'],
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
