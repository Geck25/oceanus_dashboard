import { Component, OnInit, Injectable, ViewChild, ElementRef} from '@angular/core';
import { ConfigService } from '../services/config.service';
import { MatAccordion } from '@angular/material/expansion';
import { TelemetryService } from '../services/telemetry.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent  {

  localConfigurations: any[] = [];
  localJsonConfigurations: any = null;
  serverConfigurations: any[] = [];
  numLocalPanels: number = 0;
  numServerPanels: number = 0;
  currentId: string = '';
  configName = new FormControl<string>('', Validators.required);
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('confirmModal') confirmModal: ElementRef<HTMLElement>;
  @ViewChild('confirmModalPanels') confirmModalPanels: ElementRef<HTMLElement>;
  @ViewChild('nameConf') nameConf: ElementRef<HTMLElement>;
  @ViewChild('overwriteModal') overwriteModal: ElementRef<HTMLElement>;

  constructor(
    private configService: ConfigService,
    private telemetryService: TelemetryService,
    private snackBar: MatSnackBar,
    private router: Router
  ){}

  ngOnInit(): void{
    this.localJsonConfigurations = {};
    
  
    //recupero configurazioni sul server
    this.telemetryService.getConfigs().subscribe((response) => {
      this.serverConfigurations = response;
    });

    console.log(this.localConfigurations, this.localJsonConfigurations, this.serverConfigurations);

    //recupero configurazione locale 
    let localcfgObject: any = this.configService.getConfig();
    this.localConfigurations = JSON.parse(localcfgObject!); 

    //primo accesso al browser con nessun pannello attivo
    if(this.localConfigurations === null ){
      this.localConfigurations = [];
    } else {
      this.numLocalPanels = Object.keys(this.localConfigurations).length;
    }
    

  }

 


  uploadConfiguration(): void {

    if(this.configName.valid && this.configName.touched){
      let temp = Object.assign({}, this.localConfigurations, { "id": [this.configName.value as string] });
      
      this.telemetryService.saveConfig(temp).subscribe(
        (response) => {
          console.log("Configurazione caricata con successo");
          this.snackBar.open("Configurazione salvata con successo!", "Chiudi", {
            duration: 3000, 
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar']
          });
          this.ngOnInit();
          this.closeConfirmInputDialog();
          
        },
        (error) => {
          console.log("Errore nel caricamento della configurazione");
          this.snackBar.open("Errore nel salvataggio della configurazione", "Chiudi", {
            duration: 3000, 
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
          this.ngOnInit();
          this.closeConfirmInputDialog();
        
        }
      ); 
    } else {
      this.snackBar.open("Devi inserire un nome valido per salvare la configurazione", "Chiudi", {
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar']
      });
     
    }
    
  }

  deleteConfiguration(): void {
    this.telemetryService.deleteConfig(this.currentId).subscribe(
      () => {
        this.closeConfirmModalDialog();
        //console.log("Configurazione eliminata con successo");
        this.snackBar.open("Configurazione eliminata con successo!", "Chiudi", {
          duration: 3000, 
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar']
        });
        this.ngOnInit();
        
       
      }, 
      (error) => {
        this.closeConfirmModalDialog();
        //console.log("Errore nell'eliminazione della configurazione");
        this.snackBar.open("Errore nell'eliminazione della configurazione", "Chiudi", {
          duration: 3000, 
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
        this.ngOnInit();
        
      }
      ); 
  }


    
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getMeasures(config: any, item: string): string[] {
    let objects: any = null;
    objects = Object.entries(config);
    return objects.find(([key, values]: [string, string[]]) => key === item)[1].measures;
  }

  getDimensions(config: any, item: string): string[] {
    let objects: any = null;
    objects = Object.entries(config);
    return objects.find(([key, values]: [string, string[]]) => key === item)[1].panelDimension;
  }

  checkNames(id: string): void {
    if (this.serverConfigurations === null) {
      // Handle the case where serverConfigurations is null, e.g., by displaying an error message
      
    }
  
    let objectServerNames: Object = this.serverConfigurations.find(obj => obj.id === id);
    let serverConfNames = Object.keys(objectServerNames);
    serverConfNames.pop();

    let objectLocalNames = Object.keys(this.localConfigurations);
    let localNamesPanels = JSON.stringify(objectLocalNames);

    this.currentId = id;

    //controllo se recuperando avrei pannelli omonimi
    if(serverConfNames.some(panelName => localNamesPanels.includes(panelName))){
      this.overwriteModal.nativeElement.style.display = 'flex';
    } else {
      this.restoreConfiguration();
    }
  }


  restoreConfiguration(){
    let objectsConf: Object = this.serverConfigurations.find(obj => obj.id === this.currentId);
    let keys = Object.keys(objectsConf);
    keys.pop();
    
    let currentConfig: any = this.configService.getConfig();
    if(currentConfig === null){
      console.log("entro qua");
      //nel caso in cui non ci siano pannelli o primo accesso al browser
      for(let i = 0; i < keys.length; i++){ 
      
        this.localJsonConfigurations[keys[i]] = {
          panelDimension: this.getDimensions(objectsConf, keys[i]),
          measures: this.getMeasures(objectsConf, keys[i])
        }
        this.configService.saveConfig(JSON.stringify(this.localJsonConfigurations));
      }
      
      this.router.navigate(['/dashboard', keys[0]]).then(() => window.location.reload());
      window.location.reload();
    } else {
      //pannello già presenti o browser già utilizzato
        this.localJsonConfigurations = JSON.parse(currentConfig);
        for(let i = 0; i < keys.length; i++){ 
          this.localJsonConfigurations[keys[i]] = {
            panelDimension: this.getDimensions(objectsConf, keys[i]),
            measures: this.getMeasures(objectsConf, keys[i])
          }
          let newCfg = JSON.stringify(this.localJsonConfigurations);
          this.configService.saveConfig(newCfg);
        }

        this.router.navigate(['/dashboard', keys[0]]).then(() => window.location.reload());
        window.location.reload();
    }
  } 


  deleteAllPanels(): void {
  
    this.localJsonConfigurations = {};
    this.configService.saveConfig(JSON.stringify(this.localJsonConfigurations));
    this.closeConfirmPanelsDialog();
    window.location.reload();
    //this.router.navigate(['/home']).then(() => window.location.reload());

  }


  numberOfServerPanels(config: any): number{
    return Object.keys(config).length - 1;
  }

  openConfirmPanelsDialog(): void {
    this.confirmModalPanels.nativeElement.style.display = 'flex';
  }

  closeConfirmPanelsDialog(): void {
    this.confirmModalPanels.nativeElement.style.display = 'none';
  }

  openConfirmInputDialog(): void {
    this.nameConf.nativeElement.style.display = 'flex';
  }

  closeConfirmInputDialog(): void {
    this.nameConf.nativeElement.style.display = 'none';
  }

  openConfirmModalDialog(id: string): void {
    this.currentId = id;
    this.confirmModal.nativeElement.style.display = 'flex';
  }

  closeConfirmModalDialog(): void {
    this.confirmModal.nativeElement.style.display = 'none';
  }

  closeOverwiteModalDialog(): void {
    this.overwriteModal.nativeElement.style.display = 'none';
  }
  
  
}
