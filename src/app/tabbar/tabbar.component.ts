import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ConfigService } from '../services/config.service';
import {MatDialog } from '@angular/material/dialog';
import { PanelDialogComponent } from '../panel-dialog/panel-dialog.component';
import { ToggleButtonComponent } from '../toggle.button/toggle.button.component';


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

  constructor(private configService: ConfigService, public dialog: MatDialog) { }

  ngOnInit(): void {
    let cfg = this.configService.getConfig();
    let cfgObject = JSON.parse(cfg!); 
    for (const [key, value] of Object.entries(cfgObject)) {
      this.tabs.push(key);
    }
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

  openDialog(): void {
    const dialogRef = this.dialog.open(PanelDialogComponent, {
      width: '500px'
    });
  }

}

