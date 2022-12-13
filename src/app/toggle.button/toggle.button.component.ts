import { Component, Input, OnInit } from '@angular/core';
import { TabbarComponent } from '../tabbar/tabbar.component';

@Component({
  selector: 'toggle-button',
  templateUrl: './toggle.button.component.html',
  styleUrls: ['./toggle.button.component.css']
})
export class ToggleButtonComponent {
  @Input() isSelected: boolean = false;
  @Input() endPoint: string = '';

  constructor(private container: TabbarComponent) { }

    // change the state of the container
    toggle() {
      this.container.toggleButton(this)
    }
  
    toggleSelection() {
      this.isSelected = !this.isSelected;
    }

}
