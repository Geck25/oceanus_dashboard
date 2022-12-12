import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { TelemetryService } from '../services/telemetry.service';

@Component({
  selector: 'widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.css']
})
export class WidgetGridComponent implements OnInit {
  measures: string[] = [];
  selectedMeasures: string[] = [];
  error: string = '';
  @Output() submitSelectedMeasuresEvent = new EventEmitter<MatChip>();

  constructor(private telemetry: TelemetryService) { }

  ngOnInit(): void {
    this.telemetry.getTelemetry().subscribe(data => {
      this.measures = Object.keys(data);
    })
  }

  sendNewItemToParent(chip: MatChip) {
    
    this.submitSelectedMeasuresEvent.emit(chip);
  }

}
