import { Component, Input, OnInit } from '@angular/core';
import { map, Subscription, timer } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { TelemetryService } from '../telemetry.service';
import { WidgetComponent } from '../widget/widget.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private subscription: Subscription = Subscription.EMPTY;
  @Input() tabName: string = '';
  response: any = null;
  config: any = null;
  selectedMeasurement: string[] = [];

  constructor(private telemetry: TelemetryService, private configService: ConfigService) { }

  ngOnInit(): void {
    var configAsString = this.configService.getConfig();
    this.config = JSON.parse(configAsString!);
    this.selectedMeasurement = this.selectedMeasurement.concat(this.config[this.tabName]);

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
