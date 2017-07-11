import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EatPage} from "../eat/eat"
import { SleepPage} from "../sleep/sleep"
import { DoctorPage} from "../doctor/doctor"

import { RepositoryProvider } from "../../providers/repository/repository";
import { Observable, Subscription } from 'rxjs/Rx';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RepositoryProvider]
})
export class HomePage {
  private currentBaby: any;
  private $counter: Observable<number>;
  private subscription: Subscription;
  private hoursNextEat: string;
  private hoursNextSleep: string;
  private hoursSleeping: string;
  private daysNextDoctor: string;
  private dateNextDoctor: string;

  private debug: string;


  constructor(public navCtrl: NavController, public repository: RepositoryProvider) {
    this.currentBaby = repository.getCurrentBaby();
    this.debug = "";
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.updateInfo();
      //every 30 seconds
      this.$counter = Observable.interval(30000).map((x) => {
          return x;
      });

      this.subscription = this.$counter.subscribe((x) => {
          this.updateInfo();
      });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
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

  updateInfo() {
    var millis
          var hours
          var mins
          var minsPad

          var today = new Date();
          var now = today.getTime();

          // Eat
          millis = this.currentBaby.nextEat.prediction - now;
          if (millis > 0){
            hours = Math.floor(millis / 3600000);
            mins = Math.floor(((millis - (hours * 3600000)) / 60000));
            minsPad = ("0" + mins).slice(-2)
          } else {
            hours = 0
            minsPad = "00"
          }
          this.hoursNextEat = hours + "h "+minsPad+"min";


          // Sleep prediction
          millis = this.currentBaby.nextSleep.prediction - now;
          if (millis > 0){
            hours = Math.floor(millis / 3600000);
            mins = Math.floor(((millis - (hours * 3600000)) / 60000));
            minsPad = ("0" + mins).slice(-2)
          } else {
            hours = 0
            minsPad = "00"
          }
          this.hoursNextSleep = hours + "h "+minsPad+"min";

          // Sleeping
          millis = now - this.currentBaby.nextSleep.timestamp;
          if (millis > 0){
            hours = Math.floor(millis / 3600000);
            mins = Math.floor(((millis - (hours * 3600000)) / 60000));
            minsPad = ("0" + mins).slice(-2)
          } else {
            hours = 0
            minsPad = "00"
          }
          this.hoursSleeping = hours + "h "+minsPad+"min";


          // Doctor
          var nextDoctor = "0h";
          var appointment = new Date(this.currentBaby.nextDoctor.timestamp);

          this.dateNextDoctor = appointment.getDate() +
            "/" +("0"+(appointment.getMonth()+1)).slice(-2) +
            "/" + appointment.getFullYear()
            + " " + ("0"+appointment.getHours()).slice(-2)
            + ":" + ("0"+appointment.getMinutes()).slice(-2);

          millis = this.currentBaby.nextDoctor.timestamp - now;
          if (millis >0) {
            var days = Math.floor(millis / 86400000);
            if (days > 1){
                nextDoctor = days +" días"
            } else if (days == 1) {
                nextDoctor = "Mañana"
            } else {
              if (today.getDate() != appointment.getDate()){
                //Less than 24h, but tomorrow
                nextDoctor = "Mañana"
              } else {
                hours = Math.floor(millis / 3600000);
                mins = Math.floor(((millis - (hours * 3600000)) / 60000));
                minsPad = ("0" + mins).slice(-2)
                nextDoctor = hours + "h "+minsPad+"min";
              }
            }
          }

          this.daysNextDoctor = nextDoctor;
  }

}
