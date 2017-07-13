import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SleephistoryPage } from './sleephistory';

@NgModule({
  declarations: [
    SleephistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SleephistoryPage),
  ],
  exports: [
    SleephistoryPage
  ]
})
export class SleephistoryPageModule {}
