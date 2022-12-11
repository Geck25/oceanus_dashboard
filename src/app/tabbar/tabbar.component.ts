import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ConfigService } from '../services/config.service';
import {MatDialog } from '@angular/material/dialog';
import { PanelDialogComponent } from '../panel-dialog/panel-dialog.component';
import { ToggleButtonComponent } from '../toggle.button/toggle.button.component';
import { BreakpointObserver } from '@angular/cdk/layout';


export interface DialogData {
  selectedMeasurement: string,
}

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.css']
})
export class TabbarComponent implements OnInit {
  tabs: string[] = [];
  selectedButton: ToggleButtonComponent | null = null;
  @ViewChild(ToggleButtonComponent) homeButton: ToggleButtonComponent | null = null;
  @ViewChild('dmenu') dropdownMenu: ElementRef<HTMLDivElement>;
  useSideNav: boolean = false;

  constructor(
    private configService: ConfigService,
    public dialog: MatDialog,
    private breakPoint: BreakpointObserver
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
    })
  }

  ngAfterViewInit() {
    this.selectedButton = this.homeButton;
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
    const dialogRef = this.dialog.open(PanelDialogComponent, {
      width: '500px'
    });
  }

}

