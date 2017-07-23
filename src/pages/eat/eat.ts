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
  private feedEndTime: Date;
  private feedStartTimeISOString: string;
  private feedEndTimeISOString: string;
  private feedQuantityISOString: string;
  private feedBreast: string;
  private currentFeedBreast: string;
  private previousFeedText: string;
  private feedBottleType: string;
  private feedSolidName: string;
  private timezoneOffset: number;


  private totalFeedingTime: number;
  private totalFeedingSeconds: string;
  private leftFeedingTime: number;
  private leftStartTime: number;
  private leftEndTime: number;
  private rightStartTime: number;
  private rightEndTime: number;
  private leftFeedingSeconds: string;
  private rightFeedingTime: number;
  private rightFeedingSeconds: string;
  private lastFeedBreast: string;

  private confirmedExit: boolean = false;


  private saveDataFeedStartTime: Date;
  private saveDataFeedEndTime: Date;
  private saveDataTotalFeedingTime: number;
  private saveDataLeftFeedingTime: number;
  private saveDataRightFeedingTime: number;
  private saveDataLastFeedBreast: string;
  private saveDataHapiness:number;
  private saveDataQuantity:number;
  private saveDataFeedBottleType:string;
  private saveDataSolidName: string;
  private comment:string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public repository: RepositoryProvider, public modalCtrl: ModalController) {
    this.timezoneOffset = (new Date().getTimezoneOffset() * 60000);
    this.currentFeedMethod = 'breast';
    this.currentFeedNow = true;
    this.feedBreast = 'l';
    this.currentFeedBreast = "";
    this.totalFeedingTime = 0;
    this.leftFeedingTime = 0;
    this.rightFeedingTime = 0;
    this.totalFeedingSeconds = "0m 00s";
    this.leftFeedingSeconds = "0m 00s";
    this.rightFeedingSeconds = "0m 00s";
    this.feedBottleType = "formula";
    this.feedStartTimeISOString = new Date(new Date().getTime() - this.timezoneOffset).toISOString();
    this.feedEndTimeISOString = this.feedStartTimeISOString;
    var year = new Date();
    year.setFullYear(100)
    this.feedQuantityISOString = year.toISOString();
    this.updatePreviousFeedText();




    //every second
    this.$counter = Observable.interval(1000).map((x) => {
        return x;
    });

    this.subscription = this.$counter.subscribe((x) => {
        this.updateInfo();
    });


  }

  private updatePreviousFeedText(){
    var txt = "";
    if (this.repository.cardsData.nextFeed.happy > 0){
      var millis = new Date().getTime() - this.repository.cardsData.nextFeed.feedStartTime;
      var hours = Math.floor(millis / 3600000);
      var mins = Math.floor(((millis - (hours * 3600000)) / 60000));
      var minsPad = ("0" + mins).slice(-2)

      txt = "Hace " + hours + "h " + minsPad + " min - ";

      if (this.repository.cardsData.nextFeed.lastFeedType == 'breast'){
        if (this.repository.cardsData.nextFeed.lastFeedBreast == 'l') {
          txt += "acabaste en pecho izquierdo";
        } else if (this.repository.cardsData.nextFeed.lastFeedBreast == 'r') {
          txt += "acabaste en pecho derecho";
        } else if (this.repository.cardsData.nextFeed.lastFeedBreast == 'b') {
          txt += "ambos pechos";
        } else if (this.repository.cardsData.nextFeed.lastFeedBreast == 'o') {
          txt += "biberón";
        } else if (this.repository.cardsData.nextFeed.lastFeedBreast == 's') {
          txt += "comida";
        }
      } else if (this.repository.cardsData.nextFeed.lastFeedType == 'bottle'){
        txt += "biberón de "
        txt += (this.repository.cardsData.nextFeed.bottleType=='formula')?'fórmula':((this.repository.cardsData.nextFeed.bottleType=='mother')?'leche extraída':'agua');
      } else if (this.repository.cardsData.nextFeed.lastFeedType == 'solid'){
        txt += this.repository.cardsData.nextFeed.solidName;
      }
    }


    this.previousFeedText = txt;
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
    let now = new Date();
    this.consolidateTimes();

    if (this.currentFeedBreast == breast){ //pause
        this.currentFeedBreast = '';
        this.feedEndTime = now;
    } else {
      this.currentFeedBreast = breast;
      this.lastFeedBreast = breast;
      if (!this.feedStartTime){
        this.feedStartTime = new Date();
      }
      if (breast == 'l'){
        this.leftStartTime = now.getTime();
      } else {
        this.rightStartTime = now.getTime();
      }
    }
  }

  private consolidateTimes(){
    let now = new Date();
    if (this.currentFeedBreast == 'l'){
      this.leftEndTime = now.getTime();
      this.leftFeedingTime += (this.leftEndTime - this.leftStartTime);
    } else if (this.currentFeedBreast == 'r'){
      this.rightEndTime = now.getTime();
      this.rightFeedingTime += (this.rightEndTime - this.rightStartTime);
    }
    this.totalFeedingTime = this.leftFeedingTime + this.rightFeedingTime;

    console.log("Consolidate: "+this.leftFeedingTime+" + "+this.rightFeedingTime+" = "+this.totalFeedingTime);

  }

  updateInfo(){
    let now = new Date();
    let partialLeftTime = 0;
    let partialRightTime = 0;
    if (this.currentFeedBreast != ""){
      if (this.currentFeedBreast == "l"){
        partialLeftTime = now.getTime() - this.leftStartTime;
        this.leftFeedingSeconds = this.millisToMinutesString(this.leftFeedingTime + partialLeftTime);
      } else {
        partialRightTime = now.getTime() - this.rightStartTime;
        this.rightFeedingSeconds = this.millisToMinutesString(this.rightFeedingTime + partialRightTime);
      }

      console.log(partialLeftTime +", "+partialRightTime);

      this.totalFeedingSeconds = this.millisToMinutesString(this.totalFeedingTime + partialLeftTime + partialRightTime);
    }

    this.updatePreviousFeedText();
  }

  private millisToMinutesString(millis){
      let mins = Math.floor(millis / 60000);
      let seconds = Math.floor(((millis - (mins * 60000)) / 1000));
      let secondsPad = ("0" + seconds).slice(-2);
      return mins + "m " + secondsPad + "s";
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
    var date;
    if (this.currentFeedMethod == 'breast') {
      if (this.currentFeedBreast != ''){
        this.currentFeedBreast == '';
        this.feedEndTime = new Date();
      }

      this.saveDataQuantity = 0;
      this.saveDataFeedBottleType = '';
      this.saveDataSolidName = '';

      if (this.currentFeedNow){
        if (this.totalFeedingTime > 0){
          this.saveDataFeedStartTime = this.feedStartTime;
          this.saveDataFeedEndTime = this.feedEndTime;
          this.saveDataTotalFeedingTime = this.totalFeedingTime;
          this.saveDataLeftFeedingTime = this.leftFeedingTime;
          this.saveDataRightFeedingTime = this.rightFeedingTime;
          this.saveDataLastFeedBreast = this.lastFeedBreast;

          this.showHappiness();
        }
      } else {
          this.saveDataFeedStartTime = new Date(this.feedStartTimeISOString);
          this.saveDataFeedEndTime = new Date(this.feedEndTimeISOString);
          this.saveDataTotalFeedingTime = new Date(this.feedEndTimeISOString).getTime() - this.saveDataFeedStartTime.getTime();
          if (this.feedBreast == 'l'){
            this.saveDataLeftFeedingTime = this.saveDataTotalFeedingTime;
            this.saveDataRightFeedingTime = 0;
            this.saveDataLastFeedBreast = 'l';
          } else if (this.feedBreast == 'r'){
            this.saveDataLeftFeedingTime = 0;
            this.saveDataRightFeedingTime = this.saveDataTotalFeedingTime;
            this.saveDataLastFeedBreast = 'r';
          } else if (this.feedBreast == 'bl'){
            this.saveDataLeftFeedingTime = Math.round(this.saveDataTotalFeedingTime / 2);
            this.saveDataRightFeedingTime = Math.round(this.saveDataTotalFeedingTime / 2);
            this.saveDataLastFeedBreast = 'l';
          } else {
            this.saveDataLeftFeedingTime = Math.round(this.saveDataTotalFeedingTime / 2);
            this.saveDataRightFeedingTime = Math.round(this.saveDataTotalFeedingTime / 2);
            this.saveDataLastFeedBreast = 'r';
          }
          this.showHappiness();
      }

    } else if (this.currentFeedMethod == 'bottle') {
        date = new Date(this.feedStartTimeISOString);
        date = new Date(date.getTime() + this.timezoneOffset);
        this.saveDataFeedStartTime = date;
        this.saveDataFeedEndTime = this.saveDataFeedStartTime;
        //TODO Check time from bottle
        this.saveDataTotalFeedingTime = 15 * 60000;
        this.saveDataLeftFeedingTime = 0;
        this.saveDataRightFeedingTime = 0;
        this.saveDataLastFeedBreast = '';
        this.saveDataSolidName = '';
        this.saveDataQuantity = new Date(this.feedQuantityISOString).getFullYear();
        this.saveDataFeedBottleType = this.feedBottleType;
        this.showHappiness();
    } else if (this.currentFeedMethod == 'solid') {
        date = new Date(this.feedStartTimeISOString);
        date = new Date(date.getTime() + this.timezoneOffset);
        this.saveDataFeedStartTime = date;
        this.saveDataFeedEndTime = this.saveDataFeedStartTime;
        //TODO Check time from solid
        this.saveDataTotalFeedingTime = 25 * 60000;
        this.saveDataLeftFeedingTime = 0;
        this.saveDataRightFeedingTime = 0;
        this.saveDataLastFeedBreast = '';
        this.saveDataSolidName = this.feedSolidName;
        this.saveDataQuantity = new Date(this.feedQuantityISOString).getFullYear();
        this.saveDataFeedBottleType = '';
        this.showHappiness();
    }

  }

  saveAndExit(){
    this.repository.saveFeedData(this.saveDataFeedStartTime, this.saveDataFeedEndTime, this.saveDataTotalFeedingTime, this.saveDataLeftFeedingTime,
                                this.saveDataRightFeedingTime, this.saveDataLastFeedBreast, this.saveDataHapiness, this.comment, this.currentFeedMethod,
                                this.saveDataQuantity, this.saveDataFeedBottleType, this.saveDataSolidName);
    this.confirmedExit = true;
    this.navCtrl.pop();
  }

}
