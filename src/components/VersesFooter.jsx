import React from "react";

/**
 * VersesFooter.jsx
 * Footer separado e autocontido.
 *
 * - Usa data-footer para ser detectado dinamicamente (se necessário).
 * - Mantém design glass e degradê.
 * - Responsivo e acessível.
 */

export default function VersesFooter() {
  return (
    <footer
      data-footer
      id="verses-footer"
      className="verses-footer"
      role="contentinfo"
      aria-label="Rodapé"
    >
      <div className="footer-inner">
        <div className="footer-left">
          <strong>Finance Manager</strong>
          <div className="footer-sub">© {new Date().getFullYear()} - Todos os direitos</div>
        </div>

        <div className="footer-center">
          <nav className="footer-nav" aria-label="Links do rodapé">
            <a href="/relatorios" className="footer-link">Relatórios</a>
            <a href="/cadastro" className="footer-link">Novo Lançamento</a>
            <a href="/privacidade" className="footer-link">Privacidade</a>
          </nav>
        </div>

        <div className="footer-right">
          <div className="footer-contact">Contato: suporte@seuprojeto.com</div>
        </div>
      </div>
    </footer>
  );
}
