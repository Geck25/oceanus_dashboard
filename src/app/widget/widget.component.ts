import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { measures } from '../utils/measure';

@Component({
  selector: 'widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css'],
  host: {
    class: 'fh'
  }
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input() measureName: any;
  @Input() measureValue: any;
  measureFullName: string = '';
  unitOfMeasurement: string = '';
  isCompass: boolean = false;
  compassType: string = '';

  constructor() {}

  ngOnInit(): void {
    this.measureFullName = measures[this.measureName].fullName;
    this.unitOfMeasurement = measures[this.measureName].unitOfMeasurement;
    this.isCompass = measures[this.measureName].isCompass !== undefined ? measures[this.measureName].isCompass! : false;
    this.compassType = measures[this.measureName].compassType !== undefined ? measures[this.measureName].compassType! : '';   
  }

  ngOnChanges(changes: SimpleChanges): void{
    
  }

}
