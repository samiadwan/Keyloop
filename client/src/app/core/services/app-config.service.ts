import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppConfig } from '../models/app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private readonly config$ = this.http
    .get<AppConfig>(`${environment.apiBaseUrl}/api/config`)
    .pipe(shareReplay(1));

  getConfig(): Observable<AppConfig> {
    return this.config$;
  }
}
