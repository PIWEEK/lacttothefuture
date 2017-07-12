import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";


@IonicPage()
@Component({
  selector: 'page-happy',
  templateUrl: 'happy.html',
})
export class HappyPage {
  happiness: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public repository: RepositoryProvider,public viewCtrl: ViewController) {
  }


  setHappiness(happiness){
    this.happiness = happiness;
    this.dismiss();
  }



 dismiss() {
   let data = { 'happiness': this.happiness };
   this.viewCtrl.dismiss(data);
 }


}
