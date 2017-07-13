import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedhistoryPage } from './feedhistory';

@NgModule({
  declarations: [
    FeedhistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedhistoryPage),
  ],
  exports: [
    FeedhistoryPage
  ]
})
export class FeedhistoryPageModule {}
