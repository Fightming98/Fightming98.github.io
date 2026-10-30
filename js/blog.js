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
    date:  '2026.10.29',
    title: 'ClaudeCode有关Agent Loop知识点大全',
    desc:  'ClaudeCode的AgentLoop标准执行循环包含五大核心阶段：上下文组装、模型推理、工具分发、权限守门与工具执行，基于ReAct模式实现闭环迭代。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/169463118',
    tags:  ['AgentLoop', 'checkpoint快照'],
  },
  {
    date:  '2026.10.28',
    title: 'AI数据服务的下半场核心竞争力',
    desc:  '沐晨科技（MuchenAI）凭借其从数据交付到体系构建的转型，成为大模型复杂任务落地的关键支撑。',
    url:   'https://blog.csdn.net/m0_59777389/article/details/169269327',
    tags:  ['科技', '人工智能'],
  },
  {
    date:  '2026.10.25',
    title: 'Claude Code中有关MCP的知识点大全',
    desc:  'managed-mcp.json 是企业级系统级托管配置，一旦存在即触发“独占逻辑”，仅加载其中定义的MCP服务器，忽略其他所有配置（如.mcp.json…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/169066029',
    tags:  ['ClaudeCode', 'ToolSearch'],
  },
  {
    date:  '2026.10.25',
    title: 'Claude Code Agent SDK知识点大全',
    desc:  'ClaudeCodeAgentSDK支持Streaming与Single两种输入模式…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/169061960',
    tags:  ['SessionStore', 'CLAUDE.md'],
  },
  {
    date:  '2026.10.18',
    title: 'Channels在ClaudeCode中的作用是啥？与传统轮询式活新建会话式集成的区别是啥？',
    desc:  'Anthropic的ClaudeCode Channels（2026年3月推出）是一项革命性机制…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/168251081',
    tags:  ['Channels', 'MCP'],
  },
  {
    date:  '2026.10.17',
    title: 'CLAUDE.md文件与MEMORY.md文件，两套记忆机制啥区别？',
    desc:  'ClaudeCode中的CLAUDE.md与MEMORY.md代表两种截然不同的记忆机制：前者是开发者编写的“项目宪法”，定义规则与标准，固定且共享…',
    url:   'https://blog.csdn.net/m0_59777389/article/details/168249785',
    tags:  ['CLAUDE.md', 'MEMORY.md'],
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
