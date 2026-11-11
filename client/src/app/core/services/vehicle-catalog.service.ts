import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleCatalogService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/vehicles`;

  getVehicles(location?: string): Observable<Vehicle[]> {
    let params = new HttpParams();
    if (location?.trim()) {
      params = params.set('location', location.trim());
    }
    return this.http.get<Vehicle[]>(this.base, { params });
  }

  getVehicle(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.base}/${id}`);
  }
}
