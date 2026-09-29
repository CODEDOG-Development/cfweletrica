/* ==========================================================
   CFW Elétrica - script.js
   Tudo dentro de uma função anônima que se executa sozinha
   (IIFE) para não criar variáveis globais.
   ========================================================== */
(function () {
  'use strict';

  const EMAIL_DESTINO = 'montagem2@cfweletrica.com.br';

  /* 1. MENU DO CELULAR ----------------------------------- */
  const botaoMenu = document.querySelector('.menu-botao');
  const menu = document.querySelector('#menu');

  function definirMenu(abrir) {
    menu.classList.toggle('menu--aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  }

  botaoMenu.addEventListener('click', function () {
    definirMenu(!menu.classList.contains('menu--aberto'));
  });

  // fecha o menu ao tocar em um link
  menu.addEventListener('click', function (evento) {
    if (evento.target.closest('a')) {
      definirMenu(false);
    }
  });

  // fecha o menu com a tecla Esc
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      definirMenu(false);
    }
  });

  /* 2. LINK ATIVO NO MENU (conforme a rolagem) ----------- */
  const secoes = document.querySelectorAll('main section[id]');
  const linksMenu = document.querySelectorAll('.menu a');

  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) {
          return;
        }
        linksMenu.forEach(function (link) {
          const ativo = link.getAttribute('href') === '#' + entrada.target.id;
          if (ativo) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    // considera "visível" só a faixa perto do meio da tela
    { rootMargin: '-40% 0px -55% 0px' }
  );

  secoes.forEach(function (secao) {
    observador.observe(secao);
  });

  /* 3. FORMULÁRIO DE ORÇAMENTO --------------------------- */
  const formulario = document.querySelector('#form-orcamento');
  const aviso = document.querySelector('#form-aviso');
  const campos = formulario.querySelectorAll('input, textarea');

  function mensagemDeErro(campo) {
    const valor = campo.value.trim();

    if (!valor) {
      return 'Preencha este campo.';
    }
    if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      return 'Digite um e-mail válido. Exemplo: nome@empresa.com.br';
    }
    if (campo.type === 'tel' && valor.replace(/\D/g, '').length < 10) {
      return 'Digite o telefone com DDD. Exemplo: (31) 99999-9999';
    }
    return '';
  }

  // mostra ou limpa o erro; devolve true se o campo está válido
  function validarCampo(campo) {
    const texto = mensagemDeErro(campo);
    document.querySelector('#erro-' + campo.id).textContent = texto;
    campo.setAttribute('aria-invalid', String(texto !== ''));
    return texto === '';
  }

  campos.forEach(function (campo) {
    campo.addEventListener('blur', function () {
      validarCampo(campo);
    });
  });

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const invalidos = Array.from(campos).filter(function (campo) {
      return !validarCampo(campo);
    });

    if (invalidos.length > 0) {
      invalidos[0].focus();
      aviso.textContent = 'Corrija os campos indicados e envie novamente.';
      return;
    }

    const nome = formulario.nome.value.trim();
    const corpo =
      'Nome: ' + nome + '\n' +
      'Telefone: ' + formulario.telefone.value.trim() + '\n' +
      'E-mail: ' + formulario.email.value.trim() + '\n\n' +
      formulario.mensagem.value.trim();

    const assunto = 'Solicitação de orçamento - ' + nome;

    window.location.href =
      'mailto:' + EMAIL_DESTINO +
      '?subject=' + encodeURIComponent(assunto) +
      '&body=' + encodeURIComponent(corpo);

    aviso.textContent = 'Abrimos o seu e-mail com a solicitação pronta. É só enviar.';
  });

  /* 4. ANO DO RODAPÉ ------------------------------------- */
  document.querySelector('#ano').textContent = new Date().getFullYear();
})();
