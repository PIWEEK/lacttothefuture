import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EatPage} from "../eat/eat"
import { SleepPage} from "../sleep/sleep"
import { DoctorPage} from "../doctor/doctor"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  itemTapped(item) {
    if (item === 'eat') {
      this.navCtrl.push(EatPage, {})
    }else if (item === 'sleep') {
      this.navCtrl.push(SleepPage, {})
    }else if (item === 'doctor') {
      this.navCtrl.push(DoctorPage, {})
    }

  }

}
