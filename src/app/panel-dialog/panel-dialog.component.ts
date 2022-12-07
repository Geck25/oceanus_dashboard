import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ConfigService } from '../services/config.service';

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
  selectedDimension: string = '';
  selectableWidgets: number = 0;

  dimensions: Map<string, number[]> = new Map([
    ['2x2', [2, 2]],
    ['3x3', [3, 3]]
  ]);

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
   * salvata nel local storage altrimenti la crea.
   */
  addPanel(): void {
    if (this.panelName.valid && this.selectedMeasures.length === this.selectableWidgets) {
      let currentConfig = this.configService.getConfig();
      if (currentConfig === null) {
        // build a cfg object
        const cfg = {
          [this.panelName.value as string]: {
            panelDimension: this.dimensions.get(this.selectedDimension),
            measures: this.selectedMeasures
          }
        };

        this.configService.saveConfig(JSON.stringify(cfg));
      } else {
        // se c'è già una configurazione faccio il parsing e aggiungo la nuova tab
        this.config = JSON.parse(currentConfig);
        this.config[this.panelName.value!] = {
          panelDimension: this.dimensions.get(this.selectedDimension),
          measures: this.selectedMeasures
        }
        // converto la nuova cfg in stringa e la salvo
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
    // se il chip che ha emesso l'evento è selezionato
    if (newChip.selected) {
      // trovo la posizione della misura corrispondente
      const index = this.selectedMeasures.indexOf(newChip.value);
      // la rimuovo dall'array
      this.selectedMeasures.splice(index, 1);
      // "spengo" il chip
      newChip.toggleSelected();
      this.widgetsOverflowError = '';
    } else {
      if (this.selectedMeasures.length + 1 <= this.selectableWidgets) {
        this.selectedMeasures.push(newChip.value);
        newChip.toggleSelected();
      } else {
        this.widgetsOverflowError = `Puoi avere massimo ${this.selectableWidgets} widgets!`
      }
    }
  }


  updateSelectableWidgets(event: any): void {
    // se l'utente cambia la dimensione della griglia, lo fa magari perché vuole
    // più widget, perciò resetto il messaggio di errore
    this.widgetsOverflowError = '';
    let arrayOfDimensions: number[] = this.dimensions.get(event.value)!;
    this.selectableWidgets = arrayOfDimensions[0] * arrayOfDimensions[1];
    console.log(this.selectableWidgets);
  }

}
