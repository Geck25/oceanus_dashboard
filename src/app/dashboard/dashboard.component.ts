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
  name: string = 'prova';
  value: string = '10';
  selectedMeasurement = ['aws', 'awa', 'sog', 'cog'];

  constructor(private telemetry: TelemetryService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 2000).pipe(
      map(() => {
        this.telemetry.getTelemetry().subscribe(data => {
          this.response = data;
        });
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
