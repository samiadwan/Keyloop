import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-keyloop-logo',
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="kl-logo">
      <img class="kl-logo-mark" src="assets/keyloop-mark.svg" alt="" width="36" height="36" />
      <span>Keyloop</span>
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    .kl-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      color: var(--ink);
    }
    .kl-logo:hover {
      color: var(--brand-strong);
    }
    .kl-logo-mark {
      width: 2.25rem;
      height: 2.25rem;
      flex-shrink: 0;
      display: block;
    }
  `,
})
export class KeyloopLogoComponent {}
