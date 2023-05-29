import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {

  private congifUrl = 'http://localhost:3000/configurations';

  constructor(private http: HttpClient) { }

  getTelemetry(): Observable<Object> {
    return this.http.get(environment.telemetryUrl);
  }

  getConfigs(): Observable<any[]> {
    return this.http.get<any[]>(this.congifUrl);
  }

  saveConfig(config: any): Observable<Object> {
    return this.http.post(this.congifUrl, config);
  }

  deleteConfig(config: string): Observable<Object> {
    return this.http.delete(this.congifUrl +"/" + config);
  }

  

  

  

}
