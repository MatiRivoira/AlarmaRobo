import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterLink } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from "@angular/fire/compat";

const firebaseConfig = {
  apiKey: 'AIzaSyBWh9ZePe049MhEDN_6iduhLMmmp3P5J4E',
  authDomain: 'pruebaapp-5ca51.firebaseapp.com',
  projectId: 'pruebaapp-5ca51',
  storageBucket: 'pruebaapp-5ca51.appspot.com',
  messagingSenderId: '966512395249',
  appId: '1:966512395249:web:64b9c22f38fa4ceb863a50',
  measurementId: 'G-PE1EB6GQ8Y',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterLink
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
