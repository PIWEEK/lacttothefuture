import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SleepPage } from './sleep';

@NgModule({
  declarations: [
    SleepPage,
  ],
  imports: [
    IonicPageModule.forChild(SleepPage),
  ],
  exports: [
    SleepPage
  ]
})
export class SleepPageModule {}
