import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { getCatalogMapCenter } from '../../utils/location-catalog';

@Component({
  selector: 'app-vehicle-location-map',
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  template: `
    <div class="kl-location-map">
      <h2>Pickup area map</h2>
      @if (unavailable()) {
        <p class="kl-alert-info" role="status">Map is not available for this location.</p>
      } @else {
        <div class="kl-location-map-frame">
          <div #mapHost class="kl-location-map-host" role="img" [attr.aria-label]="mapAriaLabel()"></div>
        </div>
      }
    </div>
  `,
})
export class VehicleLocationMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) city = '';
  @Input() label = '';

  @ViewChild('mapHost') mapHost?: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private marker?: L.Marker;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.configureDefaultIcon();
    this.renderMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewReady) {
      return;
    }
    if (changes['city'] || changes['label']) {
      this.renderMap();
    }
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  unavailable(): boolean {
    return getCatalogMapCenter(this.city) === null;
  }

  mapAriaLabel(): string {
    const center = getCatalogMapCenter(this.city);
    if (!center) {
      return '';
    }
    const title = this.label.trim() || center.city;
    return `Map showing pickup area near ${center.city}, Australia for ${title}`;
  }

  private configureDefaultIcon(): void {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });
  }

  private renderMap(): void {
    if (!this.viewReady || !this.mapHost) {
      return;
    }

    const center = getCatalogMapCenter(this.city);
    if (!center) {
      this.destroyMap();
      return;
    }

    const title = this.label.trim() || center.city;

    if (!this.map) {
      this.map = L.map(this.mapHost.nativeElement, {
        scrollWheelZoom: false,
        attributionControl: false,
        zoomControl: true,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '',
      }).addTo(this.map);
    }

    const latLng: L.LatLngExpression = [center.lat, center.lng];
    if (this.marker) {
      this.marker.setLatLng(latLng);
      this.marker.setPopupContent(this.popupHtml(title, center.city));
    } else {
      this.marker = L.marker(latLng).addTo(this.map).bindPopup(this.popupHtml(title, center.city));
    }

    this.map.setView(latLng, center.zoom);
    requestAnimationFrame(() => {
      this.map?.invalidateSize();
    });
  }

  private popupHtml(title: string, city: string): string {
    return `<strong>${escapeHtml(title)}</strong><br/>Pickup city: ${escapeHtml(city)}`;
  }

  private destroyMap(): void {
    this.marker = undefined;
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
