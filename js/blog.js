/* ============================================================
   博客列表
   ------------------------------------------------------------
   你只需要维护下面这个 POSTS 数组，页面上的卡片会自动生成。
   增删文章 = 增删数组里的对象，完全不用碰 HTML。

   每个字段的含义：
     date   发布日期，随便什么格式，原样显示
     title  文章标题
     desc   一句话摘要，1~2 句，太长会显得拥挤
     url    文章链接
     tags   标签数组，不想要就写成 tags: []
   ============================================================ */

const POSTS = [
  // ↓↓↓ 把下面这段的注释符号 // 去掉，改成你自己的文章，就是一篇了 ↓↓↓
  // {
  //   date:  '2026.08.15',
  //   title: '文章标题写在这里',
  //   desc:  '一句话说明这篇文章讲了什么、解决了什么问题。',
  //   url:   'https://blog.csdn.net/your-username/article/details/xxxxx',
  //   tags:  ['标签一', '标签二'],
  // },
];


/* ============================================================
   下面是渲染逻辑，一般不需要改
   ============================================================ */

(function renderBlog() {
  const list = document.getElementById('blog-list');
  if (!list) return;   // 页面上没有博客板块，直接跳过

  // 一篇文章都没有时，显示一句提示而不是空白
  if (POSTS.length === 0) {
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

    return `
      <a class="blog-card reveal" href="${escapeHTML(post.url || '#')}"
         ${post.url ? 'target="_blank" rel="noopener"' : ''}>
        <span class="blog-date">${escapeHTML(post.date || '')}</span>
        <h3>${escapeHTML(post.title || '')}</h3>
        <p>${escapeHTML(post.desc || '')}</p>
        ${tags}
      </a>`;
  }).join('');
})();


/**
 * 把 < > & " 这些字符转义掉。
 * 如果不转义，标题里写个 <script> 就会被当成代码执行。
 * 内容是你自己写的，但这属于「写页面就该有的习惯」。
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
