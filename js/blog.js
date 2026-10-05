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
    date:  '2026.10.04',
    title: 'Agent的记忆机制有哪些？长期记忆有哪些存储与检索方案？',
    desc:  '本文系统探讨智能体记忆管理的核心挑战与解决方案，涵盖短期记忆的有限容量与管理难题、长期记忆的存取机制及写入策略。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167082343',
    tags:  ['长期记忆', '存储与检索'],
  },
  {
    date:  '2026.10.04',
    title: 'MCP协议与Function Calling的区别？',
    desc:  '本文梳理了Function Calling与MCP的协作机制，阐述其在任务分解、调用与数据传输中的流程。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167082146',
    tags:  ['MCP', 'FunctionCalling'],
  },
  {
    date:  '2026.10.04',
    title: 'Agent协作有哪些常见的编排机制？',
    desc:  '本文系统梳理了智能代理协作的演进路径：从基本思路出发，对比四种典型协作模式，剖析顺序链式进阶玩法与主从委托的核心难点；聚焦AgentTeams兴起背景…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167081936',
    tags:  ['多Agent编排', '顺序链式'],
  },
  {
    date:  '2026.10.04',
    title: '应该从哪些方面考虑，设计Agent的工具权限控制？',
    desc:  '本文提出一种基于分层权限模型的动态安全机制，通过沙箱隔离实现资源访问控制，支持不同场景下的权限差异化配置。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167081723',
    tags:  ['Agent工具权限', '动态权限调整'],
  },
  {
    date:  '2026.10.04',
    title: 'Agent有哪些安全风险？如何保证系统安全性？',
    desc:  '本文系统阐述大模型应用安全的核心实践：涵盖基础安全知识、纵深防御架构落地，重点解析间接Prompt注入的深层防护策略，结合最小权限原则实现精细化权限控制…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167081509',
    tags:  ['Agent安全', 'Prompt注入'],
  },
  {
    date:  '2026.10.04',
    title: '在一个具体场景下，多Agent系统中MCP协议与A2A协议如何协同工作？',
    desc:  '本文系统梳理了Agent架构设计的核心要点：基于“任务分解-资源调度-结果聚合”的基本思路，阐述请求流转的完整链路（触发→解析→路由→执行→反馈）…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/167080522',
    tags:  ['A2A', 'MCP'],
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
