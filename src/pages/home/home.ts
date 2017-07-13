import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EatPage} from "../eat/eat"
import { SleepPage} from "../sleep/sleep"
import { DoctorPage} from "../doctor/doctor"
import { FeedhistoryPage} from "../feedhistory/feedhistory"
import { SleephistoryPage} from "../sleephistory/sleephistory"
import { DoctorhistoryPage} from "../doctorhistory/doctorhistory"
import { OnboardingPage} from "../onboarding/onboarding"


import { RepositoryProvider } from "../../providers/repository/repository";
import { Observable, Subscription } from 'rxjs/Rx';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private $counter: Observable<number>;
  private subscription: Subscription;
  private hoursNextFeed: string;
  private hoursNextSleep: string;
  private hoursSleeping: string;
  private hoursFromLastFeeding: string;
  private daysNextDoctor: string;
  private dateNextDoctor: string;
  private lastFeedIcon: string;
  private lastFeedText: string;




  constructor(public navCtrl: NavController, public repository: RepositoryProvider) {

  }

  ngOnInit() {
    console.log('ngOnInit');
    this.updateInfo();
      //every second
      this.$counter = Observable.interval(1000).map((x) => {
          return x;
      });

      this.subscription = this.$counter.subscribe((x) => {
          this.updateInfo();
      });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    //console.log('ionViewDidEnter Home');
    //this.repository.loadFromLocalStorage()
    //this.updateInfo();
    if (!this.repository.currentBaby.name) {
      this.navCtrl.push(OnboardingPage, {})
    }

  }




  itemTapped(item) {
    if (item === 'eat') {
      this.navCtrl.push(EatPage, {})
    }else if (item === 'sleep') {
      this.navCtrl.push(SleepPage, {})
    }else if (item === 'doctor') {
      this.navCtrl.push(DoctorPage, {})
    }else if (item === 'feedHistory') {
      this.navCtrl.push(FeedhistoryPage, {})
    }else if (item === 'sleepHistory') {
      this.navCtrl.push(SleephistoryPage, {})
    }else if (item === 'doctorHistory') {
      this.navCtrl.push(DoctorhistoryPage, {})
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
    if (this.repository.cardsData.nextFeed.happy > 0){
      millis = this.repository.cardsData.nextFeed.prediction - now;
      if (millis > 0){
        hours = Math.floor(millis / 3600000);
        mins = Math.floor(((millis - (hours * 3600000)) / 60000));
        minsPad = ("0" + mins).slice(-2)
        this.hoursNextFeed = hours + "h "+minsPad+"min";
      } else {
        this.hoursNextFeed = "AHORA";
      }


      this.lastFeedIcon = "";
      this.lastFeedText = '??';
      this.hoursFromLastFeeding = '??';

      if (this.repository.currentBaby.feedHistory && this.repository.currentBaby.feedHistory.length > 0){
        if (this.repository.cardsData.nextFeed.lastFeedType == 'breast') {
          if (this.repository.cardsData.nextFeed.lastFeedBreast == 'l') {
            this.lastFeedIcon = 'left_breast';
            this.lastFeedText = 'PECHO IZQUIERDO';
          } else if (this.repository.cardsData.nextFeed.lastFeedBreast == 'r') {
            this.lastFeedIcon = 'right_breast';
            this.lastFeedText = 'PECHO DERECHO';
          } else {
            this.lastFeedIcon = 'both_breast'
            this.lastFeedText = 'AMBOS PECHOS';
          }
        } else if (this.repository.cardsData.nextFeed.lastFeedType == 'bottle') {
            this.lastFeedIcon = 'eat_bottle';
            this.lastFeedText = (this.repository.cardsData.nextFeed.bottleType=='formula')?'FÓRMULA':((this.repository.cardsData.nextFeed.bottleType=='mother')?'EXTRAÍDA':'AGUA');
        } else if (this.repository.cardsData.nextFeed.lastFeedType == 'solid') {
            this.lastFeedIcon = 'eat_solid';
            this.lastFeedText = this.repository.cardsData.nextFeed.solidName;
            if (this.lastFeedText && this.lastFeedText.length > 25){
              this.lastFeedText = this.lastFeedText.substr(0,22);
              this.lastFeedText += '...';
            }
        }

        millis = now - this.repository.cardsData.nextFeed.feedEndTime;
        if (millis > 0){
          hours = Math.floor(millis / 3600000);
          mins = Math.floor(((millis - (hours * 3600000)) / 60000));
          minsPad = ("0" + mins).slice(-2)
          this.hoursFromLastFeeding = hours + "h "+minsPad+"min";
        } else {
          this.hoursFromLastFeeding = "AHORA";
        }


      }




    } else {
      //No data
      this.hoursNextFeed = "??";
      this.lastFeedIcon = 'eat_bottle';
      this.lastFeedText = 'NO HAY DATOS';
    }


    // Sleep prediction
    if (this.repository.cardsData.nextSleep.happy > 0){
      millis = this.repository.cardsData.nextSleep.prediction - now;
      if (millis > 0){
        hours = Math.floor(millis / 3600000);
        mins = Math.floor(((millis - (hours * 3600000)) / 60000));
        minsPad = ("0" + mins).slice(-2)
        this.hoursNextSleep = hours + "h "+minsPad+"min";
      } else {
        this.hoursNextSleep = "AHORA";
      }


      // Sleeping
      millis = now - this.repository.cardsData.nextSleep.timestamp;
      if (millis > 0){
        hours = Math.floor(millis / 3600000);
        mins = Math.floor(((millis - (hours * 3600000)) / 60000));
        minsPad = ("0" + mins).slice(-2)
        this.hoursSleeping = hours + "h "+minsPad+"min";
      } else {
        this.hoursSleeping = "AHORA";
      }

    } else {
      this.hoursNextSleep = "??";
      this.hoursSleeping = "";
    }


    // Doctor
    if (this.repository.cardsData.nextDoctor.timestamp > 0) {
      var nextDoctor = "0h";
      var appointment = new Date(this.repository.cardsData.nextDoctor.timestamp);

      this.dateNextDoctor = appointment.getDate() +
        "/" +("0"+(appointment.getMonth()+1)).slice(-2) +
        "/" + appointment.getFullYear()
        + " " + ("0"+appointment.getHours()).slice(-2)
        + ":" + ("0"+appointment.getMinutes()).slice(-2);

      millis = this.repository.cardsData.nextDoctor.timestamp - now;
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
      } else {
        this.dateNextDoctor = "AHORA";
      }

      this.daysNextDoctor = nextDoctor;
    } else {
      this.dateNextDoctor = "NO HAY CITAS";
      this.daysNextDoctor = "";
    }
  }

}
