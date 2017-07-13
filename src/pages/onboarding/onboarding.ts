import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  private sex: string;
  private birthDateISOString: string;
  private name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public repository: RepositoryProvider) {
    this.sex = 'girl';
    this.birthDateISOString = new Date().toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

  setSex(sex){
    this.sex = sex;
  }

  saveData(){
    if (this.name){
      this.repository.addBaby(this.name, this.sex, new Date(this.birthDateISOString))
      this.navCtrl.pop();
    }
  }
  cancel() {
    this.navCtrl.pop();
  }

}
