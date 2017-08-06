import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-feedhistory',
  templateUrl: 'feedhistory.html',
})
export class FeedhistoryPage {
  private reversedHistory: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public repository: RepositoryProvider, public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedhistoryPage');
  }

  ionViewDidEnter() {
    this.reversedHistory = [].concat(this.repository.currentBaby.feedHistory);
    this.reversedHistory.reverse();
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

  public deleteFeed(index){
    let alertPopup = this.alertCtrl.create({
        title: 'Borrar esta alimentación',
        message: '¿Seguro que quieres borrar esta alimentación?',
        buttons: [{
                text: 'Borrar',
                handler: () => {
                    alertPopup.dismiss().then(() => {
                        this.confirmDeleteFeed(index);
                    });
                    return false;
                }
            },
            {
                text: 'Cancelar',
                handler: () => {
                  //Nothing
                }
            }]
    });

    // Show the alert
    alertPopup.present();

    // Return false to avoid the page to be popped up
    return false;

  }

  public confirmDeleteFeed(index){
    //The feed is reversed
    let reversedIndex = this.reversedHistory.length - index - 1;
    this.repository.deleteFeed(reversedIndex);

    this.reversedHistory = [].concat(this.repository.currentBaby.feedHistory);
    this.reversedHistory.reverse();
  }


}
