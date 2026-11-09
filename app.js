(() => {
  const cart = document.querySelector('#cart');
  const cartItem = document.querySelector('#cartItem');
  const cartEmpty = document.querySelector('#cartEmpty');
  const scrim = document.querySelector('#scrim');
  const cartCount = document.querySelector('#cartCount');
  const cartOpen = document.querySelector('#cartOpen');
  const toast = document.querySelector('#toast');
  const menu = document.querySelector('#menuToggle');
  const nav = document.querySelector('#navLinks');
  const storageKey = 'mori-air-shortlist';
  let isSaved = false;
  let lastFocus;
  let toastTimer;

  try {
    isSaved = localStorage.getItem(storageKey) === 'true';
  } catch {
    // The shortlist still works for this visit when browser storage is unavailable.
  }

  function renderShortlist() {
    cartCount.textContent = isSaved ? '1' : '0';
    cartItem.hidden = !isSaved;
    cartEmpty.hidden = isSaved;
  }

  function openCart() {
    lastFocus = document.activeElement;
    cart.classList.add('open');
    scrim.classList.add('show');
    cart.setAttribute('aria-hidden', 'false');
    cart.removeAttribute('inert');
    cartOpen.setAttribute('aria-expanded', 'true');
    document.body.classList.add('cart-open');
    document.querySelector('#cartClose').focus();
  }

  function closeCart() {
    cart.classList.remove('open');
    scrim.classList.remove('show');
    cart.setAttribute('aria-hidden', 'true');
    cart.setAttribute('inert', '');
    cartOpen.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('cart-open');
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  function closeMenu() {
    nav.classList.remove('menu-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'メニューを開く');
    menu.textContent = '☰';
  }

  function showToast() {
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  }

  cartOpen.addEventListener('click', openCart);
  document.querySelector('#cartClose').addEventListener('click', closeCart);
  document.querySelector('#cartDone').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);

  document.querySelector('#reserve').addEventListener('click', () => {
    isSaved = true;
    renderShortlist();
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {
      // Keep the in-memory state when browser storage is unavailable.
    }
    showToast();
    openCart();
  });

  document.querySelector('#remove').addEventListener('click', () => {
    isSaved = false;
    renderShortlist();
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // The visible state is still updated for this visit.
    }
    document.querySelector('#cartClose').focus();
  });

  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    menu.setAttribute('aria-label', expanded ? 'メニューを開く' : 'メニューを閉じる');
    menu.textContent = expanded ? '☰' : '×';
    nav.classList.toggle('menu-open', !expanded);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (cart.classList.contains('open')) closeCart();
      closeMenu();
    }
    if (event.key === 'Tab' && cart.classList.contains('open')) {
      const controls = [...cart.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  renderShortlist();
})();
