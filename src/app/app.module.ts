import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
import { EatPage } from '../pages/eat/eat';
import { SleepPage } from '../pages/sleep/sleep';
import { DoctorPage } from '../pages/doctor/doctor';
import { HappyPage } from '../pages/happy/happy';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RepositoryProvider } from '../providers/repository/repository';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EatPage,
    SleepPage,
    DoctorPage,
    HappyPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EatPage,
    SleepPage,
    DoctorPage,
    HappyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RepositoryProvider
  ]
})
export class AppModule {}
