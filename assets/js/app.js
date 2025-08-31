const ENDPOINT = 'COLE_AQUI_A_URL_DO_SEU_WEBAPP_GAS';

const hamb = document.getElementById('hamb');
const desktopMenu = document.getElementById('menu');
const mobileMenu = document.getElementById('menuMobile');

if (hamb) {
  hamb.addEventListener('click', () => {
    // alterna menu mobile
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
  });
}
// fecha mobile ao clicar num link
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.style.display = 'none'));
