import { Component, OnInit, Inject, ViewChild, ElementRef, HostListener, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { ConfigService } from '../services/config.service';
// import {MatDialog } from '@angular/material/dialog';
import { ToggleButtonComponent } from '../toggle.button/toggle.button.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';


// export interface DialogData {
//   selectedMeasurement: string,
// }

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.css']
})
export class TabbarComponent implements OnInit {
  tabs: string[] = [];
  selectedButton: ToggleButtonComponent | null = null;
  @ViewChildren(ToggleButtonComponent) childrenButton: QueryList<ToggleButtonComponent>;
  @ViewChild('dmenu') dropdownMenu: ElementRef<HTMLDivElement>;
  @ViewChild('modal') modal: ElementRef<HTMLDivElement>;
  useSideNav: boolean = false;
  currentEndpoint: string = '';

  constructor(
    private configService: ConfigService,
    //public dialog: MatDialog,
    private breakPoint: BreakpointObserver,
    private router: Router
    ) { }

  ngOnInit(): void {
    let cfg = this.configService.getConfig();
    let cfgObject = JSON.parse(cfg!); 
    for (const [key, value] of Object.entries(cfgObject)) {
      this.tabs.push(key);
    }

    this.breakPoint.observe(
      '(max-width: 600px)'
    ).subscribe(result => {
      this.useSideNav = false;
      if (result.matches) { this.useSideNav = true; }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let endpoint = event.url;
        this.currentEndpoint = endpoint.substring(endpoint.lastIndexOf('/') + 1);
        console.log(`current endpoint ${this.currentEndpoint}`)
      }
    })
  }



  ngAfterViewInit() {
    // setTimeout is used to avoid "Expression has changed after it was checked" error
    setTimeout(() => {
      if (this.currentEndpoint.length !== 0) {
        this.childrenButton.forEach(button => {
          let parameter = button.endPoint.substring(button.endPoint.lastIndexOf('/') + 1);
          console.log(parameter)
          if (parameter === this.currentEndpoint) {
            this.toggleButton(button);
          }
        });
      }
    });
  }

  toggleButton(button: ToggleButtonComponent) {
    if (this.selectedButton === null) {
      this.selectedButton = button;
      button.toggleSelection();
    } else {
      this.selectedButton.toggleSelection();
      this.selectedButton = button;
      this.selectedButton.toggleSelection();
    }
  }

  toggleTabPanel(): void {
    if (this.dropdownMenu.nativeElement.style.display === 'none') {
      this.dropdownMenu.nativeElement.style.display = 'block';
    } else {
      this.dropdownMenu.nativeElement.style.display = 'none';
    }
  }

  openDialog(): void {
    this.modal.nativeElement.style.display = 'flex';
  }

  @HostListener('window:click', ['$event.target'])
  onOutsideModalClick(target: HTMLElement) {
    if (target === this.modal.nativeElement) {
      this.modal.nativeElement.style.display = 'none';
    }
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(PanelDialogComponent, {
  //     width: '500px'
  //   });
  // }

}

