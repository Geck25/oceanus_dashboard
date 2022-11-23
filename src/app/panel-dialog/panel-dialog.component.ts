import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../services/config.service';
import { measures } from '../utils/measure';

@Component({
  selector: 'app-panel-dialog',
  templateUrl: './panel-dialog.component.html',
  styleUrls: ['./panel-dialog.component.css']
})
export class PanelDialogComponent implements OnInit {
  panelName = new FormControl<string>('', {nonNullable: true});
  config: any = null;
  selectedMeasures: string[] = [];
  error: string = '';

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
      let cfgAsString: string =`{"${this.panelName.value}" : [`;
      for (let measure of this.selectedMeasures) {
        cfgAsString += `\"${measure}\", `;
      }
      cfgAsString += "]}";
      // regex per rimuovere ', ' alla fine della string
      cfgAsString = cfgAsString.replace(/,\s(?=[^,]*$)/, "");
      console.log(cfgAsString);
      this.configService.saveConfig(cfgAsString);
    } else {
      // se c'è già una configurazione faccio il parsing e aggiungo la nuova tab
      this.config = JSON.parse(currentConfig);
      this.config[this.panelName.value] = this.selectedMeasures;
      let newCfg = JSON.stringify(this.config);
      this.configService.saveConfig(newCfg);
    }
    this.dialogRef.close();
    // permette di ricaricare la pagina e quindi di aggiornare la tab bar
    window.location.reload();
  }

  addMeasure(newChip: MatChip) {
    if (newChip.selected) {
      const index = this.selectedMeasures.indexOf(newChip.value);
      this.selectedMeasures.splice(index, 1);
      newChip.toggleSelected();
      this.error = '';
    } else {
      if (this.selectedMeasures.length + 1 <= 4) {
        this.selectedMeasures.push(newChip.value);
        newChip.toggleSelected();
      } else {
        this.error = 'Puoi avere massimo 4 widgets!'
      }
    }
    console.log(this.selectedMeasures);
  }

}
