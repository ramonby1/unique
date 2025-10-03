<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unique — Experiences</title>
  <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="/unique/" data-i18n="brand">Unique</a>

      <nav class="nav" aria-label="Main">
        <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu">☰</button>
        <ul id="nav-menu" class="menu">
          <li><a href="destinations.html" data-i18n="menu.destinations">Destinations</a></li>
          <li><a href="listing.html" data-i18n="menu.experiences">Experiences</a></li>

          <li class="has-dropdown">
            <a href="#" data-i18n="menu.help">24/7 Help</a>
            <ul class="dropdown">
              <li><a href="#" id="help-webchat" data-i18n="help.webchat">Web chat</a></li>
              <li><a href="https://wa.me/" target="_blank" rel="noopener" data-i18n="help.whatsapp">WhatsApp</a></li>
              <li><a href="tel:+000000000" data-i18n="help.phone">Phone call</a></li>
            </ul>
          </li>

          <!-- Idioma: click en GB/ES alterna directamente -->
          <li class="has-dropdown">
            <a href="#" id="lang-current" aria-label="Language">GB</a>
            <ul class="dropdown">
              <li><a href="#" data-lang="en">English 🇬🇧</a></li>
              <li><a href="#" data-lang="es">Español 🇪🇸</a></li>
            </ul>
          </li>

          <li class="has-dropdown">
            <a href="#" id="cur-current" aria-label="Currency">£</a>
            <ul class="dropdown">
              <li><a href="#" data-cur="GBP">GBP £</a></li>
              <li><a href="#" data-cur="EUR">EUR €</a></li>
              <li><a href="#" data-cur="USD">USD $</a></li>
            </ul>
          </li>

          <li class="has-dropdown">
            <a href="#" aria-label="Account">👤</a>
            <ul class="dropdown">
              <li><a href="#" id="nav-register" data-i18n="auth.register">Register</a></li>
              <li><a href="#" id="nav-signin" data-i18n="auth.signin">Sign in</a></li>
            </ul>
          </li>

          <li><a class="cart-link" href="checkout.html">🛒 <span data-i18n="menu.cart">Cart</span> <span id="cart-count">0</span></a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <!-- HERO con logo -->
    <section class="hero">
      <div class="container hero-inner">
        <img class="hero-logo" src="assets/img/logo-unique.png" alt="Unique Experiences logo" />
        <!-- SEARCH BAR -->
        <form class="search" action="listing.html" method="get">
          <!-- DESTINATION -->
          <label class="has-mega">
            <span data-i18n="form.destination">Destination</span>
            <input id="destino" type="text" name="q" autocomplete="off" />
            <div class="mega-panel solid" id="form-destinations" role="menu" aria-label="Destinations">
              <div class="mega-inner form">
                <aside class="mega-col l1" aria-label="Regions">
                  <ul id="dest-l1" class="menu-plain"></ul>
                </aside>
                <section class="mega-col l2" aria-label="Areas">
                  <h4 id="dest-l2-title">Select a region</h4>
                  <ul id="dest-l2" class="menu-plain single"></ul>
                </section>
              </div>
            </div>
          </label>

          <!-- DATES (single range) -->
          <label class="has-daterange">
            <span data-i18n="form.dates">Dates</span>
            <input id="dates" type="text" readonly />
            <input id="checkin"  name="checkin"  type="hidden" />
            <input id="checkout" name="checkout" type="hidden" />
            <div id="date-range" class="range-panel" aria-hidden="true"></div>
          </label>

          <!-- THEME (select nativo) -->
          <label class="has-theme">
            <span data-i18n="form.theme">Theme</span>
            <select id="theme" name="theme"></select>
          </label>

          <!-- GUESTS -->
          <label class="guests-narrow has-guests">
            <span data-i18n="form.guests">Guests</span>
            <div class="guests-field">
              <span class="icon">👥</span>
              <input id="guests" type="text" value="2" readonly />
            </div>
            <div id="guests-panel" class="guests-panel">
              <div class="row">
                <div class="label" data-i18n="guests.adults">Adults<br><small>12+ years</small></div>
                <div class="ctrl"><button type="button" data-g="-1" data-k="adults">-</button><span id="gv-adults">2</span><button type="button" data-g="+1" data-k="adults">+</button></div>
              </div>
              <div class="row">
                <div class="label" data-i18n="guests.children">Children<br><small>Under 12</small></div>
                <div class="ctrl"><button type="button" data-g="-1" data-k="children">-</button><span id="gv-children">0</span><button type="button" data-g="+1" data-k="children">+</button></div>
              </div>
              <div class="row">
                <div class="label" data-i18n="guests.babies">Babies<br><small>Under 2</small></div>
                <div class="ctrl"><button type="button" data-g="-1" data-k="babies">-</button><span id="gv-babies">0</span><button type="button" data-g="+1" data-k="babies">+</button></div>
              </div>
              <div class="row confirm"><button type="button" id="guests-ok" class="btn" data-i18n="actions.confirm">Confirm</button></div>
            </div>
          </label>

          <button class="btn" type="submit" data-i18n="actions.search">Search</button>
        </form>
      </div>
    </section>

    <!-- QUICK CATEGORIES (moved below the fold) -->
    <section class="container section">
      <div class="section-head">
        <h2 data-i18n="section.explore">Explore</h2>
      </div>
      <div class="quick-cats">
        <a class="qcard" href="listing.html?tag=romantic">
          <img src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1400&auto=format&fit=crop" alt=""><span data-i18n="qc.romantic">Romantic</span>
        </a>
        <a class="qcard" href="listing.html?tag=spa">
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1400&auto=format&fit=crop" alt=""><span data-i18n="qc.spa">Spa & Relax</span>
        </a>
        <a class="qcard" href="listing.html?tag=adventure">
          <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop" alt=""><span data-i18n="qc.adventure">Adventure</span>
        </a>
      </div>
    </section>

    <!-- Highlights -->
    <section class="container section">
      <div class="section-head">
        <h2 data-i18n="section.highlights">This week’s highlights</h2>
        <a class="link" href="listing.html" data-i18n="actions.viewAll">View all</a>
      </div>
      <div id="featured" class="grid cards"></div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <small>© <span id="year"></span> <span data-i18n="brand">Unique</span> · <span data-i18n="footer.demo">Demo</span></small>
    </div>
  </footer>

  <script src="assets/js/main.js"></script>
</body>
</html>
