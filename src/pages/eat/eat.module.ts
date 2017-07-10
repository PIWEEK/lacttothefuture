import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EatPage } from './eat';

@NgModule({
  declarations: [
    EatPage,
  ],
  imports: [
    IonicPageModule.forChild(EatPage),
  ],
  exports: [
    EatPage
  ]
})
export class EatPageModule {}
