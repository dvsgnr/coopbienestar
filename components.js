/* CoopBienestar — Shared Nav & Footer */

const IMG_LOGO = 'https://coopbienestar.net/wp-content/uploads/2023/05/cropped-Logo-143x143.jpg';

const NAV_HTML = `
<nav class="site-nav" id="site-nav">
  <div class="container nav-inner">
    <a href="index.html" class="nav-logo" aria-label="CoopBienestar — Inicio">
      <img src="${IMG_LOGO}" alt="CoopBienestar" />
    </a>
    <div class="nav-links">
      <a href="index.html">Inicio</a>
      <a href="sobre-nosotros.html">Sobre nosotros</a>
      <a href="servicios.html">Servicios</a>
      <a href="noticias.html">Noticias</a>
      <a href="galeria.html">Galería</a>
      <a href="contactos.html">Contactos</a>
    </div>
    <a href="contactos.html" class="btn btn-primary nav-cta">Contáctanos</a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Menú">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </div>
</nav>
<div class="mobile-nav" id="mobile-nav">
  <a href="index.html">Inicio</a>
  <a href="sobre-nosotros.html">Sobre nosotros</a>
  <a href="servicios.html">Servicios</a>
  <a href="noticias.html">Noticias</a>
  <a href="galeria.html">Galería</a>
  <a href="contactos.html">Contactos</a>
  <a href="contactos.html" class="btn btn-primary" style="margin-top:12px;justify-content:center">Contáctanos</a>
</div>`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <img src="${IMG_LOGO}" alt="CoopBienestar" class="footer-brand-img" />
        <span class="footer-brand-name">COOPBIENESTAR</span>
        <p class="footer-brand-sub">Cooperativa de Ahorros, Crédito y Servicios Múltiples para el Bienestar Social. Comprometidos con el progreso económico de nuestros asociados en Santiago de los Caballeros.</p>
      </div>
      <div class="footer-col">
        <h4>Navegación</h4>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="sobre-nosotros.html">Sobre nosotros</a></li>
          <li><a href="servicios.html">Servicios</a></li>
          <li><a href="noticias.html">Noticias</a></li>
          <li><a href="galeria.html">Galería</a></li>
          <li><a href="contactos.html">Contactos</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Servicios</h4>
        <ul>
          <li><a href="servicios.html">Cuenta de aportaciones</a></li>
          <li><a href="servicios.html">Ahorro retirable</a></li>
          <li><a href="servicios.html">Ahorros especiales</a></li>
          <li><a href="servicios.html">Certificados financieros</a></li>
          <li><a href="servicios.html">Créditos</a></li>
          <li><a href="servicios.html">Órdenes de pago</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contacto</h4>
        <div class="footer-contact-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Av. Las Colinas, esq. Calle 23,<br>Santiago de los Caballeros, R.D.</span>
        </div>
        <div class="footer-contact-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.56C1.36 2.28 2.22 1 3.5 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.51a16 16 0 0 0 5.55 5.55l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>829-583-4261</span>
        </div>
      </div>
    </div>
    <hr class="footer-hr" />
    <div class="footer-bottom">
      <span>© 2026 COOPBIENESTAR. Todos los derechos reservados.</span>
      <span>Santiago de los Caballeros, República Dominicana</span>
    </div>
  </div>
</footer>`;

function initComponents() {
  const navPh = document.getElementById('nav-ph');
  const footerPh = document.getElementById('footer-ph');
  if (navPh) navPh.innerHTML = NAV_HTML;
  if (footerPh) footerPh.innerHTML = FOOTER_HTML;

  // Scroll → solid nav
  const nav = document.getElementById('site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile toggle
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('#nav-toggle');
    if (!toggle) return;
    const mn = document.getElementById('mobile-nav');
    if (!mn) return;
    mn.classList.toggle('open');
    const open = mn.classList.contains('open');
    toggle.innerHTML = open
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  });

  // Active link highlight
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComponents);
} else {
  initComponents();
}
