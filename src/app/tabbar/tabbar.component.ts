import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../services/config.service';
import {MatDialog } from '@angular/material/dialog';
import { PanelDialogComponent } from '../panel-dialog/panel-dialog.component';


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

  constructor(private configService: ConfigService, public dialog: MatDialog) { }

  ngOnInit(): void {
    let cfg = this.configService.getConfig();
    let cfgObject = JSON.parse(cfg!); 
    for (var key in cfgObject) {
      this.tabs.push(key);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PanelDialogComponent, {
      width: '500px'
    });
  }

}

