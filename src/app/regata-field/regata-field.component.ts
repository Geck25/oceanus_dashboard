import { Component, OnInit } from '@angular/core';
import { Subscription, timer, map } from 'rxjs';
import { TelemetryService } from '../services/telemetry.service';
import { 
  distanceBetweenTwoPoints, 
  bearingBetweenTwoPoints, 
  gradiDecimaliToGradiMinuti,
  angleStartLinePinLin } from '../utils/functions';

interface DeviceInformation {
  label: string;
  latitude: string;
  longitude: string;
  distance: string;
  course: string;
  time: string;
  sog: string;
  cog: string;
}

@Component({
  selector: 'app-regata-field',
  templateUrl: './regata-field.component.html',
  styleUrls: ['./regata-field.component.css']
})
export class RegataFieldComponent implements OnInit {
  response: any;
  apiSubscription: Subscription;
  devices : DeviceInformation[] = [];
  dColumns: string[] = ['label', 'latitude', 'longitude', 'distance', 'course', 'time', 'sog', 'cog'];
  // Angle Start Line - PIN Line
  asl_pl: number;
  // Angle PIN OFFSET - PIN Line
  apo_pl: number;

  emptyRows: DeviceInformation[] = [
    {label: 'Offset Mark', latitude: '', longitude: '', distance: '',course: '', time: '', sog: '', cog: ''},
    {label: 'Leeward Mark', latitude: '', longitude: '', distance: '',course: '', time: '', sog: '', cog: ''},
    {label: 'Finish Mark', latitude: '', longitude: '', distance: '',course: '', time: '', sog: '', cog: ''},
    {label: 'Changing Mark', latitude: '', longitude: '', distance: '',course: '', time: '', sog: '', cog: ''},
  ];

  // array ausiliario per "convertire" le label tx1 -> vessel, rx2 -> top mark, rx3 -> pin
  labels: string[] = ['Vessel', 'Top Mark', 'PIN'];

  constructor(private telemetryService: TelemetryService) { }

  ngOnInit(): void {
    this.apiSubscription = timer(0, 2000).pipe(
      map(() => {
        this.telemetryService.getTelemetry().subscribe(data => {
          const dataAsArray = Object.entries(data);
          const filtered = dataAsArray.filter(([key, value]) => key === 'tyson');
          this.response = Object.fromEntries(filtered);

          // empty the array each time we get new data
          this.devices = [];
          const values = <string[]>this.response['tyson'].split('#');
          values.forEach((device, index) => {
            // split the string into array of strings
            let deviceFields = device.split(',');
            // for each string trim (remove) spaces
            deviceFields = deviceFields.map(field => field.trim());
            this.devices.push(
              {
                label: this.labels[index],
                latitude: deviceFields[2],
                longitude: deviceFields[4],
                distance: deviceFields[0] === 'TX1' ? '0' : this.calcDistance(deviceFields),
                course: deviceFields[0] === 'TX1' ? '' : this.calcBearing(deviceFields),
                time: deviceFields[1],
                sog: '',
                cog: '',
              }
            );
            
          });
          // calc a.s.l. and a.p.o.
          this.asl_pl = angleStartLinePinLin(this.devices[2].course, this.devices[1].course);
          this.devices = this.devices.concat(this.emptyRows);
        });
      })
    ).subscribe();
  }

  private calcDistance(deviceInfo: string[]): string {
    let tx1: DeviceInformation = this.devices[0];
  
    let distance = distanceBetweenTwoPoints(
      parseFloat(tx1.latitude),
      parseFloat(tx1.longitude),
      parseFloat(deviceInfo[2]), 
      parseFloat(deviceInfo[4])
    );

    if (deviceInfo[0] === 'RX2') { 
      distance /= 1852.0;
      return distance.toFixed(1) + ' NM';
    } else {
      return distance.toFixed(1) + ' m';
    }
  
  }

  private calcBearing(deviceInfo: string[]): string {
    let tx1: DeviceInformation = this.devices[0];

    let bearing = bearingBetweenTwoPoints(
      parseFloat(tx1.latitude),
      parseFloat(tx1.longitude),
      parseFloat(deviceInfo[2]), 
      parseFloat(deviceInfo[4])
    );

    return bearing.toFixed(0);
  }

  parseToGradiMinuti(coord: string): string {
    // questo if serve per evitare che i tre campi vuoti (offset/leeward/finish) presentino un NaN 
    if (coord.length === 0) { return ''; }
    let coordAsFloat = parseFloat(coord);
    let converted = gradiDecimaliToGradiMinuti(coordAsFloat);
    return converted;
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }

}
