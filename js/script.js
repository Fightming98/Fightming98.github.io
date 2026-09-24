/* ============================================================
   页面交互
   ------------------------------------------------------------
   一共四件事：
     1. 页面下滚时，导航栏浮现边框和阴影
     2. 手机端汉堡菜单的展开 / 收起
     3. 元素滚动到视野内时淡入上浮
     4. 导航栏高亮当前所在的板块
   ============================================================ */

(function () {
  'use strict';   // 严格模式：把一些容易写错的写法直接报错，便于排错

  /* ==========================================================
     1. 导航栏滚动状态
     ========================================================== */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');
  const navToggle = document.querySelector('.nav-toggle');

  function onScrollNav() {
    if (!navbar) return;
    // 往下滚超过 10px 就加上 .scrolled，导航栏出现边框和阴影
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }


  /* ==========================================================
     2. 手机端汉堡菜单
     ========================================================== */
  if (navToggle && navLinks) {
    // 点按钮：切换展开状态
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      // 无障碍：让屏幕阅读器知道菜单现在是开还是关
      navToggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
    });

    // 点菜单里的任意链接后自动收起（否则跳转过去了菜单还挡着）
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-label', '打开菜单');
      }
    });

    // 按 Esc 关闭菜单
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });

    // 窗口从手机宽度拉宽到桌面宽度时，把菜单状态清掉，
    // 否则桌面端会残留一个展开的菜单
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  }


  /* ==========================================================
     3. 滚动淡入
     ----------------------------------------------------------
     IntersectionObserver 会在元素进入视口时通知我们，
     比监听 scroll 事件再逐个算位置高效得多。
     ========================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    // 不支持这个 API 的老浏览器，直接全部显示，不做动画
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          io.unobserve(entry.target);   // 出现过一次就不再观察，避免反复触发
        });
      }, {
        threshold: 0.12,               // 露出 12% 就触发
        rootMargin: '0px 0px -40px 0px' // 底部提前 40px 触发，观感更自然
      });

      revealEls.forEach(el => io.observe(el));
    }
  }


  /* ==========================================================
     4. 导航栏高亮当前板块
     ----------------------------------------------------------
     思路：找出「最后一个顶部已经滚过去的板块」，它就是当前板块。
     ========================================================== */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

  // 只保留能对应上板块的导航链接（"项目详情" 指向别的页面，会被排除）
  const linkMap = links
    .map(link => ({
      link: link,
      section: document.getElementById(link.getAttribute('href').slice(1))
    }))
    .filter(item => item.section);

  function setActive() {
    if (!linkMap.length) return;

    // 判定线：视口顶部往下 120px。滚过这条线的板块算「当前板块」
    const line = window.scrollY + 120;
    let current = null;

    linkMap.forEach(function (item) {
      if (item.section.offsetTop <= line) current = item;
    });

    // 滚到最底部时，强制高亮最后一个（否则最后一个板块太矮永远轮不到）
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      current = linkMap[linkMap.length - 1];
    }

    linkMap.forEach(function (item) {
      item.link.classList.toggle('active', item === current);
    });
  }


  /* ==========================================================
     滚动事件合并
     ----------------------------------------------------------
     滚动会在一秒内触发几十次，每次都直接算会很卡。
     这里用 requestAnimationFrame 把多次触发合并成每帧最多一次。
     ========================================================== */
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollNav();
      setActive();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // 首屏也要跑一次，否则刚打开时导航栏没有任何高亮
  onScrollNav();
  setActive();


  /* ==========================================================
     5. 图片占位兜底
     ----------------------------------------------------------
     你把图片放进 image/ 之前，浏览器会显示一个难看的「碎图」图标。
     这里统一换成一块灰色占位图，等你放了真图就自动失效。
     全部图片都就位后，这一节可以删掉。
     ========================================================== */

  // 一块灰色占位图（直接内嵌成 data URI，不需要额外的图片文件）
  const PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="100%" height="100%" fill="#eef0f3"/>
      <g fill="none" stroke="#b8bcc4" stroke-width="4"
         stroke-linecap="round" stroke-linejoin="round">
        <rect x="158" y="118" width="84" height="64" rx="6"/>
        <circle cx="180" cy="140" r="7"/>
        <path d="M158 170l22-20 18 16 14-12 30 26"/>
      </g>
      <text x="200" y="216" fill="#9aa0a6" font-size="15"
            font-family="sans-serif" text-anchor="middle">图片占位</text>
    </svg>`);

  document.querySelectorAll('img').forEach(function (img) {
    // 图片加载失败时替换成占位图
    function swapInPlaceholder() {
      if (img.dataset.phDone) return;   // 已经换过了，别重复换
      img.dataset.phDone = '1';
      img.src = PLACEHOLDER;
    }

    img.addEventListener('error', swapInPlaceholder);

    // 注意：如果图片在脚本执行前就已经加载失败了，error 事件不会再触发。
    // complete 为 true 但 naturalWidth 为 0，就说明是这种情况。
    if (img.complete && img.naturalWidth === 0) swapInPlaceholder();
  });
})();
