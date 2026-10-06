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
    date:  '2026.10.05',
    title: 'Agent完整工作过程',
    desc:  '本文概述大模型规划能力的基本思路，聚焦当前主流的ReAct框架，结合思维链（Chain-of-Thought）与环境交互实现动态决策。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167128270',
    tags:  ['ReAct', 'Agent完整工作流程'],
  },
  {
    date:  '2026.10.05',
    title: 'LLM Agent核心架构、常见功能、工作机制？',
    desc:  'LLMAgent是基于大语言模型的智能代理，具备规划、记忆、工具调用与自我反思能力，区别于传统AI的静态响应。其核心架构包含规划、记忆、工具、反思四大模块。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167127853',
    tags:  ['LLM Agent'],
  },
  {
    date:  '2026.10.05',
    title: '大模型应用中，如何实现短期记忆与长期记忆',
    desc:  '本文系统梳理了大模型记忆系统的构建思路，详解记忆的读写流程与LangChain记忆模块实现机制，涵盖临时记忆、向量存储等核心组件。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167127715',
    tags:  ['记忆', 'LangChain'],
  },
  {
    date:  '2026.10.05',
    title: 'ReAct的原理？与CoT的区别是啥？',
    desc:  '本文系统介绍大模型推理的核心知识，对比ReAct与链式推理（CoT）在思维过程上的差异，展示实用Prompt模板设计，总结工程实现中的关键要点，如提示优化…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167127585',
    tags:  ['ReAct', 'CoT'],
  },
  {
    date:  '2026.10.05',
    title: 'Computer Use原理是啥？与传统RPA的区别？',
    desc:  '传统RPA依赖固定脚本与界面元素，稳定性强但灵活性差；ComputerUse基于大模型视觉理解，可自主解读界面、决策操作，适应动态变化。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167127481',
    tags:  ['Computer Use', '传统RPA'],
  },
  {
    date:  '2026.10.05',
    title: 'Manus、OpenClaw这种通用Agent了解过吗？',
    desc:  '本文介绍Manus。另外聚焦大语言模型（LLM）如GPT、Claude等作为智能底座，衍生出代码专用垂直智能体（如Cursor…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167127147',
    tags:  ['Manus', 'OpenClaw'],
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
