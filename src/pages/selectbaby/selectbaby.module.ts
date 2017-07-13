import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectbabyPage } from './selectbaby';

@NgModule({
  declarations: [
    SelectbabyPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectbabyPage),
  ],
  exports: [
    SelectbabyPage
  ]
})
export class SelectbabyPageModule {}
