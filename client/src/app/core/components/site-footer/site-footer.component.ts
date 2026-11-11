import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeyloopLogoComponent } from '../keyloop-logo/keyloop-logo.component';

@Component({
  selector: 'app-site-footer',
  imports: [KeyloopLogoComponent, RouterLink],
  template: `
    <footer class="kl-site-footer" aria-label="Site footer">
      <div class="kl-site-footer-grid">
        <div>
          <app-keyloop-logo />
          <p>Keyloop is a car rental booking demo for Australia.</p>
        </div>
        <div>
          <h2 class="kl-footer-heading">Explore</h2>
          <ul class="kl-footer-list">
            <li><a routerLink="/" class="kl-footer-link">Search vehicles</a></li>
            <li><a routerLink="/trips" class="kl-footer-link">My trips</a></li>
            <li><a routerLink="/" fragment="faq" class="kl-footer-link">FAQ</a></li>
          </ul>
        </div>
      </div>
      <p class="kl-site-footer-bottom">© {{ year }} Keyloop demo.</p>
    </footer>
  `,
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
