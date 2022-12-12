import { Component, OnInit } from '@angular/core';
import { map, Subscription, timer } from 'rxjs';
import { TelemetryService } from '../services/telemetry.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private subscription: Subscription = Subscription.EMPTY;
  response: any = null;
  private coordinates: string[] = ['lat', 'lon'];
  currentDate: Date = new Date();
  lat: string = '';
  lon: string = '';

  constructor(private telemetry: TelemetryService) {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnInit(): void {
    this.subscription = timer(0, 2000).pipe(
      map(() => {
        this.telemetry.getTelemetry().subscribe(data => {
          this.response = data; // Object
          const asArray = Object.entries(data);
          const filtered = asArray.filter(([key, value]) => this.coordinates.includes(key));
          this.response = Object.fromEntries(filtered);
          this.lat = this.response['lat'];
          this.lon = this.response['lon'];
        });
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
