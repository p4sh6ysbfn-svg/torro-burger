/* TORRO BURGER — shared cart (localStorage) */
(function () {
  'use strict';
  var KEY = 'torro_cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  var cart = load();

  /* build UI */
  var chip = document.createElement('button');
  chip.className = 'cart-chip';
  chip.setAttribute('aria-label', 'Cart');
  chip.innerHTML = '<span>Your cart</span><span class="n">0</span>';
  var panel = document.createElement('div');
  panel.className = 'cart-panel';
  document.body.appendChild(chip);
  document.body.appendChild(panel);
  var nEl = chip.querySelector('.n');
  var checkoutMode = false;

  function items() { return Object.keys(cart); }
  function count() { return items().reduce(function (s, k) { return s + cart[k].q; }, 0); }
  function total() { return items().reduce(function (s, k) { return s + cart[k].q * cart[k].p; }, 0); }

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function renderChip() {
    nEl.textContent = count();
  }

  function renderPanel() {
    if (checkoutMode) {
      panel.innerHTML =
        '<h4>Almost there!</h4>' +
        '<p class="empty" style="opacity:.8">Total: ' + total() + ' mdl — call your nearest TORRO to confirm the order:</p>' +
        '<div class="phones">' +
          '<a href="tel:+37378117744">+373 (78) 117 744</a><p class="loc">R&#226;&#537;cani &#183; Miron Costin 13/1</p>' +
          '<a href="tel:+37379105105">+373 (79) 105 105</a><p class="loc">Centru &#183; Alexandr Pu&#537;kin 12</p>' +
          '<a href="tel:+37379129129">+373 (79) 129 129</a><p class="loc">Botanica &#183; Trandafirilor 43</p>' +
        '</div>' +
        '<button class="clear" data-act="back">&#8592; Back to cart</button>';
      return;
    }
    var ks = items();
    var rows;
    if (!ks.length) {
      rows = '<p class="empty">Hungry? Add items to start your order.</p>';
    } else {
      rows = ks.map(function (k) {
        var it = cart[k];
        return '<div class="line" data-k="' + esc(k) + '">' +
          '<span class="nm2">' + esc(k) + '</span>' +
          '<span class="qty">' +
            '<button class="qb" data-act="dec" aria-label="Less">&#8722;</button>' +
            '<span>' + it.q + '</span>' +
            '<button class="qb" data-act="inc" aria-label="More">+</button>' +
          '</span>' +
          '<span class="sum">' + it.q * it.p + ' mdl</span>' +
        '</div>';
      }).join('');
    }
    panel.innerHTML =
      '<h4>Your cart</h4>' + rows +
      '<div class="tot"><span>Total</span><span>' + total() + ' mdl</span></div>' +
      (ks.length ? '<button class="co" data-act="checkout">Checkout</button><button class="clear" data-act="clear">Clear cart</button>' : '');
  }

  chip.addEventListener('click', function () {
    checkoutMode = false;
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) renderPanel();
  });
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && !chip.contains(e.target)) panel.classList.remove('open');
  });

  panel.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var act = btn.dataset.act;
    if (act === 'checkout') { checkoutMode = true; renderPanel(); return; }
    if (act === 'back') { checkoutMode = false; renderPanel(); return; }
    if (act === 'clear') { cart = {}; save(); renderChip(); renderPanel(); return; }
    var line = btn.closest('.line');
    if (!line) return;
    var k = line.dataset.k;
    if (!cart[k]) return;
    if (act === 'inc') cart[k].q++;
    if (act === 'dec') { cart[k].q--; if (cart[k].q <= 0) delete cart[k]; }
    save(); renderChip(); renderPanel();
  });

  window.TorroCart = {
    add: function (name, price) {
      if (!cart[name]) cart[name] = { p: +price, q: 0 };
      cart[name].q++;
      save();
      renderChip();
      chip.classList.remove('bump');
      void chip.offsetWidth;
      chip.classList.add('bump');
      if (panel.classList.contains('open') && !checkoutMode) renderPanel();
    }
  };

  renderChip();
})();
