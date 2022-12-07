import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subscription, timer } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { TelemetryService } from '../telemetry.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  host: {
    class: 'full-height'
  }
})
export class DashboardComponent implements OnInit {
  private subscription: Subscription = Subscription.EMPTY;
  response: any = null;
  config: any = null;
  selectedMeasurement: string[] = [];
  col: number = 2;
  row: number = 2;

  constructor(private telemetry: TelemetryService, private configService: ConfigService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const panelName = String(routeParams.get('dashboard-name'));

    let configAsString = this.configService.getConfig();
    this.config = JSON.parse(configAsString!);
    this.selectedMeasurement = this.selectedMeasurement.concat(this.config[panelName].measures);
    this.col = this.config[panelName].panelDimension[0];
    this.row = this.config[panelName].panelDimension[1];

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
