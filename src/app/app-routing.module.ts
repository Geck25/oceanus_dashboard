import { NgModule } from '@angular/core';
import { RouterModule, ROUTES, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfigService } from './services/config.service';

const routes: Routes = [
  //{ path: '', redirectTo: 'dashboard/gps', pathMatch: 'full'},
  { path: 'dashboard/:dashboard-name', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
