import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";

@IonicPage()
@Component({
  selector: 'page-doctorhistory',
  templateUrl: 'doctorhistory.html',
})
export class DoctorhistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public repository: RepositoryProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorhistoryPage');
  }

}
