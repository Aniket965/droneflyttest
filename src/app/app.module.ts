import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapviewComponent } from './mapview/mapview.component';
import {DronePositionService} from './drone-position.service'
import { DroneControllerService } from './drone-controller.service';
@NgModule({
  declarations: [
    AppComponent,
    MapviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [DronePositionService, DroneControllerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
