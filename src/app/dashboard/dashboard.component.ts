import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription, timer } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { TelemetryService } from '../services/telemetry.service';
import { measures } from '../utils/measure';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  host: {
    class: 'fh'
  }
})
export class DashboardComponent implements OnInit {
  private subscription: Subscription = Subscription.EMPTY;
  response: any = null;
  config: any = null;
  selectedMeasurement: string[] = [];
  col: number = 2;
  row: number = 2;
  isSmallDimension: boolean = false;
  panelName: string = '';


  constructor(
    private telemetry: TelemetryService, 
    private configService: ConfigService, 
    private activatedRoute: ActivatedRoute,
    private breakPoint: BreakpointObserver
    ) { }

  ngOnInit(): void {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    this.panelName = String(routeParams.get('dashboard-name'));

    let savedConfig = this.configService.getConfig();
    this.config = JSON.parse(savedConfig!);
    this.selectedMeasurement = this.selectedMeasurement.concat(this.config[this.panelName].measures);
    this.col = this.config[this.panelName].panelDimension[0];
    this.row = this.config[this.panelName].panelDimension[1];

    this.breakPoint.observe(
      '(max-width: 600px)'
    ).subscribe(result => {
      this.isSmallDimension = false;
      if (result.matches) { this.isSmallDimension = true; }
    })

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

  isCompass(measure: any): boolean {
    return measures[measure as string].isCompass || false;
  }


}
