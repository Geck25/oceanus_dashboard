import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-panel-dialog',
  templateUrl: './panel-dialog.component.html',
  styleUrls: ['./panel-dialog.component.css']
})
export class PanelDialogComponent implements OnInit {
  panelName = new FormControl<string>('', {nonNullable: true});
  config: any = null;

  constructor(
    public dialogRef: MatDialogRef<PanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private configService: ConfigService
    ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addPanel(): void {
    var currentConfig = this.configService.getConfig();
    if (currentConfig === null) {
      // dobbiamo costruire il json 
      //let cfg: string = "{" + this.panelName.value + ": [] }";
    } else {
      this.config = JSON.parse(currentConfig);
      
      this.config[this.panelName.value] = [];
      let newCfg = JSON.stringify(this.config);
      this.configService.saveConfig(newCfg);

    }
    console.log(this.panelName.value);
    this.dialogRef.close();
  }

}
