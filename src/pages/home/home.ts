import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EatPage} from "../eat/eat"
import { SleepPage} from "../sleep/sleep"
import { DoctorPage} from "../doctor/doctor"

import { RepositoryProvider } from "../../providers/repository/repository";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RepositoryProvider]
})
export class HomePage {
  currentBaby: any;

  constructor(public navCtrl: NavController, public repository: RepositoryProvider) {
    this.currentBaby = repository.getCurrentBaby();
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
