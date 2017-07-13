import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorhistoryPage } from './doctorhistory';

@NgModule({
  declarations: [
    DoctorhistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorhistoryPage),
  ],
  exports: [
    DoctorhistoryPage
  ]
})
export class DoctorhistoryPageModule {}
