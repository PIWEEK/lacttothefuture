import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";

@IonicPage()
@Component({
  selector: 'page-selectbaby',
  templateUrl: 'selectbaby.html',
})
export class SelectbabyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public repository: RepositoryProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectbabyPage');
  }

  selectBaby(baby){
    this.repository.currentBaby = this.repository.babiesList[baby];
    this.repository.updateCardData();
    this.navCtrl.pop();

  }

}
