import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { TabbarComponent } from './tabbar/tabbar.component';
import { PanelDialogComponent } from './panel-dialog/panel-dialog.component';
import { WidgetGridComponent } from './widget-grid/widget-grid.component';
import { RoutingStrategy } from './routing/RoutingStrategy';
import { RouteReuseStrategy } from '@angular/router';
import { HomeComponent } from './home/home.component';

/** Angular Material Imports */
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ToggleButtonComponent } from './toggle.button/toggle.button.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WidgetComponent,
    TabbarComponent,
    PanelDialogComponent,
    WidgetGridComponent,
    HomeComponent,
    ToggleButtonComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
  ],
  exports: [
    MatFormFieldModule,
    PanelDialogComponent
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: RoutingStrategy
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
