/* ═══════════════════════════════════════
     CONFIGURAÇÃO DOS LINKS DO MERCADO PAGO
═══════════════════════════════════════ */
const LINK_PLANO_30 = "https://mpago.la/1FiBfYL";
const LINK_PLANO_25 = "https://mpago.la/1fJjZCp";
const LINK_PLANO_20 = "https://mpago.la/1NGFjQ9";
const usernameInput = document.getElementById('usernameInput');
const usernameError = document.getElementById('usernameError');

/* ─── ESTADOS DO CALCULADOR ─── */
let selectedPlan = 'padrao'; // Opções: 'padrao' | 'alternativo'
let discountActive = false;
const prices = { padrao: 30, alternativo: 25 };

/* ─── MAPEAMENTO DE ELEMENTOS DOM ─── */
const cardPadrao = document.getElementById('card-padrao');
const cardAlternativo = document.getElementById('card-alternativo');
const checkPadrao = document.getElementById('check-padrao');
const checkAlternativo = document.getElementById('check-alternativo');
const discountRow = document.getElementById('discountRow');
const toggleTrack = document.getElementById('toggleTrack');
const totalValueEl = document.getElementById('totalValue');
const btnPagar = document.getElementById('btnPagar');
const btnScrollRenovacao = document.getElementById('btnScrollRenovacao');

const planBuilderCard = document.getElementById('planBuilderCard');
const redirectCard = document.getElementById('redirectCard');
const confirmValueEl = document.getElementById('confirmValue');
const mpDirectLink = document.getElementById('mpDirectLink');
const btnVoltarPlano = document.getElementById('btnVoltarPlano');

/* ─── SELEÇÃO DINÂMICA DE PLANOS ─── */
function selectPlan(plan) {
  selectedPlan = plan;

  if (plan === 'padrao') {
    cardPadrao.classList.add('selected');
    cardPadrao.style.borderColor = '#9333ea';
    checkPadrao.style.background = '#9333ea';
    checkPadrao.innerHTML = '<i class="fa-solid fa-check" style="font-size:10px;"></i>';

    cardAlternativo.classList.remove('selected');
    cardAlternativo.style.borderColor = '#e5e7eb';
    checkAlternativo.style.background = '#e5e7eb';
    checkAlternativo.innerHTML = '';
  } else {
    cardAlternativo.classList.add('selected');
    cardAlternativo.style.borderColor = '#9333ea';
    checkAlternativo.style.background = '#9333ea';
    checkAlternativo.innerHTML = '<i class="fa-solid fa-check" style="font-size:10px;"></i>';

    cardPadrao.classList.remove('selected');
    cardPadrao.style.borderColor = '#e5e7eb';
    checkPadrao.style.background = '#e5e7eb';
    checkPadrao.innerHTML = '';
  }

  updateTotal();
}

/* ─── ATIVAR/DESATIVAR DESCONTO ─── */
function toggleDiscount() {
  discountActive = !discountActive;
  toggleTrack.classList.toggle('on', discountActive);
  updateTotal();
}

/* ─── CÁLCULO DO VALOR EM TEMPO REAL ─── */
function updateTotal() {
  let base = prices[selectedPlan];
  let total = discountActive ? base - 5 : base;
  if (total < 0) total = 0;

  const label = 'R$ ' + total.toFixed(2).replace('.', ',');

// ESSA É A LINHA QUE VOCÊ PRECISA ADICIONAR:
const confirmValue = document.getElementById('confirmValue');
if (confirmValue) {
    confirmValue.textContent = label;
}
  // Efeito rápido de pulo ao mudar o preço
  totalValueEl.classList.remove('total-animating');
  void totalValueEl.offsetWidth; // Força reflow do navegador
  totalValueEl.classList.add('total-animating');
}

/* ─── DESCOBRIR O LINK DE DESTINO CORRETO ─── */
function getPaymentLink() {
  let base = prices[selectedPlan];
  let total = discountActive ? base - 5 : base;
  if (total <= 20) return LINK_PLANO_20;
  if (total <= 25) return LINK_PLANO_25;
  return LINK_PLANO_30;
}

/* ─── REDIRECIONAMENTO E TELA DE CONFIRMAÇÃO ─── */
function goToPayment() {
  // 1. Procura o campo de texto e o texto de erro no HTML
  const usernameInput = document.getElementById('usernameInput');
  const usernameError = document.getElementById('usernameError');

  // 2. Garante que o nome ou login foi digitado
  if (!usernameInput || !usernameInput.value.trim()) {
    usernameInput.classList.add('border-red-500');
    usernameError.classList.remove('hidden');
    usernameInput.focus();
    return; // Trava o código aqui e não deixa abrir o Mercado Pago
  }

  // 3. Se estiver tudo certo, limpa os avisos de erro
  usernameInput.classList.remove('border-red-500');
  usernameError.classList.add('hidden');

  // 4. Pega o nome digitado e calcula os valores do plano
  const clienteNome = usernameInput.value.trim();
  const link = getPaymentLink();
  let base = prices[selectedPlan];
  let total = discountActive ? base - 5 : base;
  if (total < 0) total = 0;
  const label = 'R$ ' + total.toFixed(2).replace('.', ',');

  // 5. Troca os cards na tela (esconde o editor e mostra o sucesso)
  document.getElementById('planBuilderCard').classList.add('hidden');
  const rCard = document.getElementById('redirectCard');
  rCard.classList.remove('hidden');
  document.getElementById('confirmValue').textContent = label;
  document.getElementById('mpDirectLink').href = link;

  /* =========================================================================
     A MÁGICA DO WHATSAPP DINÂMICO
     ========================================================================= */
  // 6. Monta o texto que vai preenchido para o cliente
  const textoWhatsApp = encodeURIComponent(`Olá! Acabei de realizar o pagamento da minha renovação no site.\n\n👤 *Nome/Login:* ${clienteNome}\n💵 *Valor:* ${label}\n\nSegue o comprovante em anexo:`);
  
  // 7. DIGITE O SEU NÚMERO REAL COM DDD AQUI (Ex: 55 + DDD + Número)
  const seuNumeroWhatsApp = "5571982018230"; 
  
  // 8. Junta o seu número com o texto que o robô do site criou
  const linkWhatsAppDinamico = `https://wa.me/${seuNumeroWhatsApp}?text=${textoWhatsApp}`; 
  
  // 9. Atualiza o link do botão amarelo com o novo caminho personalizado
  const botaoComprovante = document.getElementById('link-whatsapp-comprovante');
  if (botaoComprovante) {
    botaoComprovante.href = linkWhatsAppDinamico;
  }

  // 10. Move a tela para o topo do card de sucesso de forma suave
  rCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // 11. Abre o link do Mercado Pago em uma nova aba para o cliente pagar
  window.open(link, '_blank');
}

function goBackToPlan() {
  redirectCard.classList.add('hidden');
  planBuilderCard.classList.remove('hidden');
  document.getElementById('renovacao').scrollIntoView({ behavior: 'smooth' });
}

/* ─── OUVINTES DE EVENTOS DOS PLANOS ─── */
cardPadrao.addEventListener('click', () => selectPlan('padrao'));
cardAlternativo.addEventListener('click', () => selectPlan('alternativo'));
discountRow.addEventListener('click', toggleDiscount);
btnPagar.addEventListener('click', goToPayment);
btnVoltarPlano.addEventListener('click', goBackToPlan);
btnScrollRenovacao.addEventListener('click', () => {
  document.getElementById('renovacao').scrollIntoView({ behavior: 'smooth' });
  usernameInput.addEventListener('input', () => {
  if (usernameInput.value.trim()) {
    usernameInput.classList.remove('border-red-500');
    usernameError.add('hidden');
  }
});
});


/* ═══════════════════════════════════════
     LÓGICA DO CARROSSEL AUTOMÁTICO (BUG-FREE)
═══════════════════════════════════════ */
let currentSlide = 0;
const TOTAL_SLIDES = 3;
let autoTimer;
const carouselTrack = document.getElementById('carouselTrack');
const dotButtons = document.querySelectorAll('.dot-nav .dot-btn');

function goToSlide(n) {
  // Garante que o contador fique estritamente entre 0 e 2
  currentSlide = ((n % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  // Atualiza os indicadores visuais (bolinhas)
  dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

// Reinicia o relógio do carrossel do zero (evita atropelar e pular slides)
function resetTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 4000);
}

// Ouvintes de clique das setas laterais
document.getElementById('prevBtn').addEventListener('click', () => { prevSlide(); resetTimer(); });
document.getElementById('nextBtn').addEventListener('click', () => { nextSlide(); resetTimer(); });

// Ouvintes de clique direto nas bolinhas indicadoras
dotButtons.forEach((dot, idx) => {
  dot.addEventListener('click', () => { goToSlide(idx); resetTimer(); });
});

/* ─── GESTOS DE TOUCH (ARRASTAR NO CELULAR) ─── */
let touchStartX = 0;
carouselTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
carouselTrack.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) { // Sensibilidade do swipe
    if (diff > 0) { nextSlide(); } else { prevSlide(); }
    resetTimer();
  }
});

// Inicialização de partida do Carrossel
resetTimer();


/* ═══════════════════════════════════════
     EFEITO SCROLL REVEAL (SUAVIZAR ENTRADA)
═══════════════════════════════════════ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ═══════════════════════════════════════
     LÓGICA INTERATIVA DO FAQ (SANFONA)
═══════════════════════════════════════ */
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const content = trigger.nextElementSibling;
    const isActive = item.classList.contains('active');

    // Fecha todos os outros FAQs que estiverem abertos (opcional, deixa mais limpo)
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-content').style.maxHeight = null;
      }
    });

    // Abre ou fecha o FAQ clicado calculando a altura do texto
    if (!isActive) {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      item.classList.remove('active');
      content.style.maxHeight = null;
    }
  });
});

/* ═══════════════════════════════════════
     MONITORAMENTO DO SERVIDOR (LOCAL)
═══════════════════════════════════════ */
function atualizarStatusServidores() {
  const labelTexto = document.getElementById('status-text');
  const bolinha = document.getElementById('status-ball');

  if (bolinha && labelTexto) {
    // Para testar a bolinha vermelha em alguma manutenção, mude para false
    const servidoresOk = true; 

    if (servidoresOk) {
      bolinha.className = "w-2.5 h-2.5 rounded-full status-online";
      labelTexto.textContent = "Servidores 100% Online";
      labelTexto.style.color = "#22c55e"; // Cor verde suave
    } else {
      bolinha.className = "w-2.5 h-2.5 rounded-full status-offline";
      labelTexto.textContent = "Servidores em Manutenção Preventiva";
      labelTexto.style.color = "#ef4444"; // Cor vermelha
    }
  }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarStatusServidores);