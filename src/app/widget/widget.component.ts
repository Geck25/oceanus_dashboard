import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { measures } from '../utils/measure';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input() measureName: any;
  @Input() measureValue: any;
  measureFullName: string = '';
  unitOfMeasurement: string = '';

  constructor() {}

  ngOnInit(): void {
    this.measureFullName = measures[this.measureName].fullName;
    this.unitOfMeasurement = measures[this.measureName].unitOfMeasurement;
  }

  ngOnChanges(changes: SimpleChanges): void{
    
  }

}
