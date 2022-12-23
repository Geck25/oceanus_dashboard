import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild('confirmModal') confirmModal: ElementRef<HTMLElement>;
  @ViewChild('panelOptions') panelOptions: ElementRef<HTMLElement>;


  constructor(
    private telemetry: TelemetryService, 
    private configService: ConfigService, 
    private activatedRoute: ActivatedRoute,
    private breakPoint: BreakpointObserver,
    private router: Router
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

  deletePanel(): void {
    delete this.config[this.panelName];
    this.configService.saveConfig(JSON.stringify(this.config));
    this.closeConfirmDialog();
    this.router.navigate(['/home']).then(() => window.location.reload());
  }

  openConfirmDialog(): void {
    this.confirmModal.nativeElement.style.display = 'flex';
  }

  closeConfirmDialog(): void {
    this.confirmModal.nativeElement.style.display = 'none';
  }

  showOptions(): void {
    this.panelOptions.nativeElement.style.display = 'block';
  }

  @HostListener('window:click', ['$event.target'])
  onOutsideModalClick(target: HTMLElement) {
    if (target === this.confirmModal.nativeElement) {
      target.style.display = 'none';
    }
    
    if (this.panelOptions.nativeElement.style.display === 'block' && target.classList.contains('widgets')) {
      this.panelOptions.nativeElement.style.display = 'none';
    }
  }

  isCompass(measure: any): boolean {
    return measures[measure as string].isCompass || false;
  }


}
