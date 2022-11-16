import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  public saveConfig(config: string) {
    localStorage.setItem('config', config);
  }

  public getConfig() {
    return localStorage.getItem('config');
  }
}
