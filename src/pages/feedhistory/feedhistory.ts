import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";

@IonicPage()
@Component({
  selector: 'page-feedhistory',
  templateUrl: 'feedhistory.html',
})
export class FeedhistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public repository: RepositoryProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedhistoryPage');
  }

  public selectFeedIcon(entry){
    if (entry.type == 'breast') {
      return 'both_breast';
    } else if (entry.type == 'solid') {
      return 'eat_solid';
    } else{
      return 'eat_bottle';
    }
  }

  public calcMinutes(millis){
    if (millis && millis > 0){
        var mins = Math.floor(millis / 60000);
        var sec = Math.floor(((millis - (mins * 60000)) / 1000));
        var secPad = ("0" + sec).slice(-2)
        return mins + "m "+secPad+"s";
      } else {
        return "0m 0s";
      }
  }


}
