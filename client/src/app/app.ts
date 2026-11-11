import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from './core/components/site-footer/site-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteFooterComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="kl-shell">
      <router-outlet />
      <app-site-footer />
    </div>
  `,
})
export class App {}
