import { Component } from '@angular/core';
import { LANDING_FAQ_ITEMS } from '../../constants/landing-faq';

@Component({
  selector: 'app-landing-faq',
  template: `
    <section id="faq" class="kl-card" aria-labelledby="faq-heading">
      <h2 id="faq-heading" class="kl-section-heading">Help and FAQ</h2>
      <div class="kl-faq-list">
        @for (item of items; track item.id) {
          <details class="kl-faq-item">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        }
      </div>
    </section>
  `,
})
export class LandingFaqComponent {
  readonly items = LANDING_FAQ_ITEMS;
}
