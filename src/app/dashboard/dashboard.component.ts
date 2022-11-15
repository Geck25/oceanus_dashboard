import { Component, OnInit } from '@angular/core';
import { map, Subscription, timer } from 'rxjs';
import { TelemetryService } from '../telemetry.service';
import { WidgetComponent } from '../widget/widget.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private subscription: Subscription = Subscription.EMPTY;
  response: any = null;
  selectedMeasurement = ['aws', 'awa', 'sog', 'cog', 'mh'];

  constructor(private telemetry: TelemetryService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 2000).pipe(
      map(() => {
        this.telemetry.getTelemetry().subscribe(data => {
          this.response = data; // Object
          const asArray = Object.entries(data);
          const filtered = asArray.filter(([key, value]) => this.selectedMeasurement.includes(key));
          this.response = Object.fromEntries(filtered);
        });
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
