import { Component, OnInit, Input, Inject, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input() measureName: any;
  @Input() measureValue: any;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void{
    
  }

}
