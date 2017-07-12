import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";
import { HappyPage } from "../happy/happy";



@IonicPage()
@Component({
  selector: 'page-eat',
  templateUrl: 'eat.html'
})
export class EatPage {
  private $counter: Observable<number>;
  private subscription: Subscription;
  private currentFeedMethod: string;
  private currentFeedNow: boolean;
  private feedStartTime: Date;
  private feedStartTimeISOString: string;
  private feedEndTimeISOString: string;
  private feedBreast: string;
  private currentFeedBreast: string;


  private totalFeedingTime: number;
  private totalFeedingSeconds: string;
  private leftFeedingTime: number;
  private leftFeedingSeconds: string;
  private rightFeedingTime: number;
  private rightFeedingSeconds: string;
  private lastFeedBreast: string;

  private confirmedExit: boolean = false;


  private saveDataFeedStartTime: Date;
  private saveDataTotalFeedingTime: number;
  private saveDataLeftFeedingTime: number;
  private saveDataRightFeedingTime: number;
  private saveDataLastFeedBreast: string;
  private saveDataHapiness:number;
  private comment:string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public repository: RepositoryProvider, public modalCtrl: ModalController) {
    this.currentFeedMethod = 'breast';
    this.currentFeedNow = true;
    this.feedBreast = 'i';
    this.currentFeedBreast = "";
    this.totalFeedingTime = 0;
    this.leftFeedingTime = 0;
    this.rightFeedingTime = 0;
    this.totalFeedingSeconds = "0m 00s";
    this.leftFeedingSeconds = "0m 00s";
    this.rightFeedingSeconds = "0m 00s";
    var now = new Date()
    this.feedStartTimeISOString = now.toISOString();
    this.feedEndTimeISOString = now.toISOString();


    //every second
    this.$counter = Observable.interval(1000).map((x) => {
        return x;
    });

    this.subscription = this.$counter.subscribe((x) => {
        this.updateInfo();
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EatPage');
  }

  setFeedMethod(method){
    this.currentFeedMethod = method;
  }

  setFeedNow(isNow){
    this.currentFeedNow = isNow;
  }

  startStopFeeding(breast){
    if (this.currentFeedBreast == breast){
        this.currentFeedBreast = '';
    } else{
      this.currentFeedBreast = breast;
      this.lastFeedBreast = breast;
      if (!this.feedStartTime){
        this.feedStartTime = new Date();
      }
    }
  }

  updateInfo(){
    var mins;
    var seconds;
    var secondsPad;
    if (this.currentFeedBreast != ""){
      this.totalFeedingTime += 1000;
      mins = Math.floor(this.totalFeedingTime / 60000);
      seconds = Math.floor(((this.totalFeedingTime - (mins * 60000)) / 1000));
      secondsPad = ("0" + seconds).slice(-2);
      this.totalFeedingSeconds = mins + "m " + secondsPad + "s";

      if (this.currentFeedBreast == "i"){
        this.leftFeedingTime += 1000;
        mins = Math.floor(this.leftFeedingTime / 60000);
        seconds = Math.floor(((this.leftFeedingTime - (mins * 60000)) / 1000));
        secondsPad = ("0" + seconds).slice(-2);
        this.leftFeedingSeconds = mins + "m " + secondsPad + "s";
      } else {
        this.rightFeedingTime += 1000;
        mins = Math.floor(this.rightFeedingTime / 60000);
        seconds = Math.floor(((this.rightFeedingTime - (mins * 60000)) / 1000));
        secondsPad = ("0" + seconds).slice(-2);
        this.rightFeedingSeconds = mins + "m " + secondsPad + "s";
      }
    }
  }

  ionViewCanLeave() {
      if(!this.confirmedExit) {
          let alertPopup = this.alertCtrl.create({
              title: 'No has guardado los datos',
              message: 'No has guardado los datos. ¿Seguro que quieres volver atrás?',
              buttons: [{
                      text: 'Volver sin guardar',
                      handler: () => {
                          alertPopup.dismiss().then(() => {
                              this.exitPage();
                          });
                          return false;
                      }
                  },
                  {
                      text: 'Permanecer aquí',
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
  }

  private exitPage() {
      this.confirmedExit = true;
      this.navCtrl.pop();
  }


  showHappiness() {
   let profileModal = this.modalCtrl.create(HappyPage, {  });
   profileModal.onDidDismiss(data => {
     this.saveDataHapiness = data.happiness;
     this.saveAndExit()
   });
   profileModal.present();
  }




  saveData() {
    if (this.currentFeedMethod == 'breast') {
      this.currentFeedBreast == '';
      if (this.currentFeedNow){
        if (this.totalFeedingTime > 0){
          this.saveDataFeedStartTime = this.feedStartTime;
          this.saveDataTotalFeedingTime = this.totalFeedingTime;
          this.saveDataLeftFeedingTime = this.leftFeedingTime;
          this.saveDataRightFeedingTime = this.rightFeedingTime;
          this.saveDataLastFeedBreast = this.lastFeedBreast;
          this.showHappiness();
        }
      } else {
          this.saveDataFeedStartTime = new Date(this.feedStartTimeISOString);
          this.saveDataTotalFeedingTime = new Date(this.feedEndTimeISOString).getTime() - this.saveDataFeedStartTime.getTime();
          if (this.feedBreast == 'l'){
            this.saveDataLeftFeedingTime = this.saveDataTotalFeedingTime;
            this.saveDataRightFeedingTime = 0;
          } else if (this.feedBreast == 'r'){
            this.saveDataLeftFeedingTime = 0;
            this.saveDataRightFeedingTime = this.saveDataTotalFeedingTime;
          } else {
            this.saveDataLeftFeedingTime = Math.round(this.saveDataTotalFeedingTime / 2);
            this.saveDataRightFeedingTime = Math.round(this.saveDataTotalFeedingTime / 2);
          }
          this.saveDataLastFeedBreast = this.feedBreast;
          this.showHappiness();
      }

    }

  }

  saveAndExit(){
    this.repository.saveFeedData(this.saveDataFeedStartTime, this.totalFeedingTime, this.leftFeedingTime,
                                this.rightFeedingTime, this.lastFeedBreast, this.saveDataHapiness, this.comment);
    this.confirmedExit = true;
    this.navCtrl.pop();
  }

}
