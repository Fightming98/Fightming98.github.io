/* ============================================================
   页面交互
   ------------------------------------------------------------
   一共六件事：
     1. 页面下滚时，导航栏浮现边框和阴影
     2. 手机端汉堡菜单的展开 / 收起
     3. 元素滚动到视野内时淡入上浮
     4. 导航栏高亮当前所在的板块
     5. 图片加载失败时换成灰色占位图
     6. 点获奖作品图，全屏看大图
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


  /* ==========================================================
     6. 图片放大
     ----------------------------------------------------------
     点带 data-zoom 的按钮（现在只有个人荣誉里的两张获奖作品图），
     全屏看大图。放大层的 DOM 在这里现建，不用往每个页面抄一份 HTML。
     想给别的图也加上这个功能，只要给它套个
     <button data-zoom="大图的地址"> 就行。
     ========================================================== */
  const zoomBtns = document.querySelectorAll('[data-zoom]');

  if (zoomBtns.length) {
    // --- 先把放大层的骨架搭出来，塞在 </body> 前 ---
    const box = document.createElement('div');
    box.className = 'lightbox';
    // role + aria-modal：告诉屏幕阅读器「这是一层弹窗，底下的内容先别看」
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', '图片放大查看');
    box.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="关闭">' +
        '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<img class="lightbox-img" alt="">';
    document.body.appendChild(box);

    const boxImg = box.querySelector('.lightbox-img');
    const boxClose = box.querySelector('.lightbox-close');
    let lastFocus = null;   // 记住是谁点开的，关掉之后把焦点还回去

    function openLightbox(src, alt) {
      lastFocus = document.activeElement;
      boxImg.src = src;
      boxImg.alt = alt;
      box.classList.add('open');
      document.body.classList.add('no-scroll');   // 锁住底层页面滚动

      focusClose(3);
    }

    /* 把焦点移进放大层。不移的话键盘用户按 Tab 会跑到背后那些
       看不见的链接上，等于被困住了。

       为什么要重试：元素在 visibility: hidden 时是「不可聚焦」的，
       focus() 会一声不响地失败，焦点留在原来那张图上。
       注意 focus() 不返回值，也不报错，只能回头查 activeElement 才知道成没成。

       正常情况下 class 一加，放大层立刻就是 visible，第一次就成；
       但系统开了「减少动态效果」时，Chrome 会把所有过渡时长强制压成
       1e-05s，还会把 transition-property 强制成 all——于是 visibility
       被摊上一个延迟，要过一帧才真正可见，第一次就会落空。
       所以失败就下一帧再试，最多试 tries 次，绝不会一直转下去 */
    function focusClose(tries) {
      boxClose.focus();
      if (document.activeElement !== boxClose && tries > 0) {
        requestAnimationFrame(function () { focusClose(tries - 1); });
      }
    }

    function closeLightbox() {
      box.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (lastFocus) lastFocus.focus();   // 焦点回到刚才那张图上
    }

    zoomBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // 大图的说明文字直接复用按钮里那张小图的 alt，省得两处各写一份
        const thumb = btn.querySelector('img');
        openLightbox(btn.dataset.zoom, thumb ? thumb.alt : '');
      });
    });

    boxClose.addEventListener('click', closeLightbox);

    // 点图片以外的空白处也关掉。这里必须判断 e.target === box：
    // 图片是 box 的子元素，点在图片上时 e.target 是那个 img，
    // 不判断的话点图也会被当成点背景，一放大就自己关了
    box.addEventListener('click', function (e) {
      if (e.target === box) closeLightbox();
    });

    // 按 Esc 关掉
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('open')) closeLightbox();
    });
  }
})();
