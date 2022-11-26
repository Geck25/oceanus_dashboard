import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  panelName = new FormControl<string>('', Validators.required);
  config: any = null;
  selectedMeasures: string[] = [];
  someError: boolean = false;
  widgetsOverflowError: string = '';

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

  /**
   * Funzione che viene eseguita al 'submit' del bottone presente nel dialog
   * utilizza il ConfigService per recuperare, se presente, l'attuale configurazione 
   * salvata nel local storage
   */
  addPanel(): void {
    if (this.panelName.valid && this.selectedMeasures.length === 4) {
      var currentConfig = this.configService.getConfig();
      if (currentConfig === null) {
        let cfgAsString: string =`{"${this.panelName.value}" : [`;
        for (let measure of this.selectedMeasures) {
          cfgAsString += `\"${measure}\", `;
        }
        cfgAsString += "]}";
        // regex per rimuovere ', ' alla fine della stringa
        cfgAsString = cfgAsString.replace(/,\s(?=[^,]*$)/, "");
        this.configService.saveConfig(cfgAsString);
      } else {
        // se c'è già una configurazione faccio il parsing e aggiungo la nuova tab
        this.config = JSON.parse(currentConfig);
        this.config[this.panelName.value!] = this.selectedMeasures;
        let newCfg = JSON.stringify(this.config);
        this.configService.saveConfig(newCfg);
      }
      this.dialogRef.close();
      // permette di ricaricare la pagina e quindi di aggiornare la tab bar
      window.location.reload();
    } else {
      this.someError = true;
    }
  }

  addMeasure(newChip: MatChip) {
    if (newChip.selected) {
      const index = this.selectedMeasures.indexOf(newChip.value);
      this.selectedMeasures.splice(index, 1);
      newChip.toggleSelected();
      this.widgetsOverflowError = '';
    } else {
      if (this.selectedMeasures.length + 1 <= 4) {
        this.selectedMeasures.push(newChip.value);
        newChip.toggleSelected();
      } else {
        this.widgetsOverflowError = 'Puoi avere massimo 4 widgets!'
      }
    }
    console.log(this.selectedMeasures);
  }

}
