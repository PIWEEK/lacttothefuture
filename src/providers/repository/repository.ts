import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import * as mlr from "../../utils/mlr";
import {feedEvents} from "../../utils/data";

@Injectable()
export class RepositoryProvider {

  public currentBaby: any;
  public babiesList: any;
  public cardsData: any;
  public ready: boolean;


  constructor(private storage: Storage) {
    this.ready = false;
    //TODO: For now, we clear the data every time. Remove this clear ASAP
    //this.storage.set('lact_data', '{}');

    this.cardsData = {
        nextFeed: {
          prediction: 0,
          mealsToday: 0,
          happy: 0,
          lastFeedType: '',
          lastFeedBreast: '',
          comment: '',
          type: '',
          feedEndTime: -1,
          feedStartTime: -1,
          quantity: 0,
          bottleType: '',
          solidName: ''
        },
        nextSleep: {
          prediction: 0,
          timestamp: 0,
          status: "AWAKE",
          happy: 0,
          daytime: 'morning'
        },
        nextDoctor: {
          timestamp: -1,
          comment: ""
        }
    }


    //this.createSampleData()
    this.currentBaby = {
        name:'',
        sex: 'boy',
        feedHistory: [],
        sleepHistory: [],
        doctorHistory: []
      }
      this.loadFromLocalStorage()
  }

  createSampleData() {
    this.babiesList = [
      {
        name:'Diego',
        sex: 'girl',
        feedHistory: [
         /* {
            feedStartTime: new Date().getTime() - 122 * 60000,
            feedEndTime: new Date().getTime() - 111 * 60000,
            happy: 5,
            totalFeedingTime: 8000,
            leftFeedingTime: 3000,
            rightFeedingTime: 5000,
            lastFeedType: 'breast',
            lastFeedBreast: 'r',
            comment: '',
            type: 'breast',
            quantity: 0,
            bottleType: '',
            solidName: ''
          }*/
        ]
      },
      {
        name:'Sonia',
        sex: 'girl',
        feedHistory: [],
        sleepHistory: [],
        doctorHistory: []
      }
    ]

    this.currentBaby = this.babiesList[0]

    this.saveToLocalStorage()

  }

  saveFeedData(feedStartTime, feedEndTime, totalFeedingTime, leftFeedingTime, rightFeedingTime, lastFeedBreast, happy, comment, type, quantity, bottleType, solidName) {
    if (!this.currentBaby.feedHistory){
      this.currentBaby.feedHistory = [];
    }

    var feedData = {
          feedStartTime: feedStartTime.getTime(),
          feedEndTime: feedEndTime.getTime(),
          happy: happy,
          totalFeedingTime: totalFeedingTime,
          leftFeedingTime: leftFeedingTime,
          rightFeedingTime: rightFeedingTime,
          lastFeedBreast: lastFeedBreast,
          comment: comment,
          type: type,
          quantity: quantity,
          bottleType: bottleType,
          solidName: solidName
    }

    this.currentBaby.feedHistory.push(feedData);


    this.saveToLocalStorage();

    this.updateCardData();
  }

  saveDoctorData(date, comment) {

    if (!this.currentBaby.doctorHistory){
      this.currentBaby.doctorHistory = [];
    }

    var doctorData = {
          timestamp: date.getTime(),
          comment: comment
    }

    var i =0;
    while ((i<this.currentBaby.doctorHistory.length) && (this.currentBaby.doctorHistory[i].timestamp < doctorData.timestamp)){
      i+=1;
    }


    this.currentBaby.doctorHistory.splice(i, 0, doctorData);
    this.saveToLocalStorage();

    this.updateCardData();
  }

  saveSleepData(date, comment, happy) {

    if (!this.currentBaby.sleepHistory){
      this.currentBaby.sleepHistory = [];
    }

    var status = 'SLEEPING';
    if (this.cardsData.nextSleep.status == 'SLEEPING') {
      status = 'AWAKE';
    }

    var sleepData = {
          timestamp: date.getTime(),
          comment: comment,
          status: status,
          happy: happy
    }

    this.currentBaby.sleepHistory.push(sleepData);


    this.saveToLocalStorage();

    this.updateCardData();
  }

  addBaby(name, sex, birthDate){
    this.currentBaby = {
        name: name,
        sex: sex,
        birthDate: birthDate,
        feedHistory: [],
        sleepHistory: [],
        doctorHistory: []
      }
    if (! this.babiesList) {
      this.babiesList = [];
    }
    console.log(this.babiesList);
    this.babiesList.push(this.currentBaby);
    this.saveToLocalStorage();
    this.updateCardData();
  }



  saveToLocalStorage(){
    this.storage.set('lact_data', JSON.stringify(this.babiesList));

  }

  loadFromLocalStorage(){
    this.storage.get('lact_data').then((val) => {
      this.babiesList = JSON.parse(val);
      if (this.babiesList && this.babiesList.length > 0){
        this.currentBaby = this.babiesList[0];
        if (!this.currentBaby.feedHistory){
          this.currentBaby.feedHistory = [];
        }
        if (!this.currentBaby.sleepHistory){
          this.currentBaby.sleepHistory = [];
        }
        if (!this.currentBaby.doctorHistory){
          this.currentBaby.doctorHistory = [];
        }

        this.updateCardData();
        this.ready = true;
      } else {
        this.babiesList = [];
        this.ready = true;
        //TODO
        //Open onboarding
        //this.createSampleData();
        //this.updateCardData();
      }
    });


  }

  updateCardData() {
    var i;

    if (this.currentBaby.feedHistory && this.currentBaby.feedHistory.length > 0){
        //Calculate today values
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var mealsToday = 0;

        for (i=this.currentBaby.feedHistory.length-1;i>=0;i--){
          var feedDate = new Date(this.currentBaby.feedHistory[i].feedStartTime);
          feedDate.setHours(0, 0, 0, 0);
          if (feedDate.getTime() != today.getTime()){
            break
          }
          mealsToday += 1;
        }


        var lastFeed = this.currentBaby.feedHistory[this.currentBaby.feedHistory.length-1];

        this.cardsData.nextFeed.mealsToday = mealsToday;
        this.cardsData.nextFeed.happy = lastFeed.happy;
        this.cardsData.nextFeed.lastFeedBreast = lastFeed.lastFeedBreast;
        this.cardsData.nextFeed.lastFeedType = lastFeed.type;
        this.cardsData.nextFeed.prediction = this.predictFeed();
        this.cardsData.nextFeed.feedEndTime = lastFeed.feedEndTime;
        this.cardsData.nextFeed.feedStartTime = lastFeed.feedStartTime;
        this.cardsData.nextFeed.bottleType = lastFeed.bottleType;
        this.cardsData.nextFeed.solidName = lastFeed.solidName;
    } else {
        this.cardsData.nextFeed.mealsToday = 0;
        this.cardsData.nextFeed.happy = 0;
        this.cardsData.nextFeed.lastFeedType = '';
        this.cardsData.nextFeed.prediction = 0;
        this.cardsData.nextFeed.feedEndTime = -1;
        this.cardsData.nextFeed.feedStartTime = -1;
        this.cardsData.nextFeed.bottleType = '';
        this.cardsData.nextFeed.solidName = '';
    }


    // Sleep
    this.cardsData.nextSleep.timestamp = -1;
    this.cardsData.nextSleep.comment = "";
    this.cardsData.nextSleep.happy = 0;
    this.cardsData.nextSleep.prediction = 0;
    if (this.currentBaby.sleepHistory && this.currentBaby.sleepHistory.length > 0){
      this.cardsData.nextSleep.timestamp = this.currentBaby.sleepHistory[this.currentBaby.sleepHistory.length - 1].timestamp;
      this.cardsData.nextSleep.comment = this.currentBaby.sleepHistory[this.currentBaby.sleepHistory.length - 1].comment;
      this.cardsData.nextSleep.happy = this.currentBaby.sleepHistory[this.currentBaby.sleepHistory.length - 1].happy;
      this.cardsData.nextSleep.status = this.currentBaby.sleepHistory[this.currentBaby.sleepHistory.length - 1].status;
      if (this.cardsData.nextSleep.status == 'SLEEPING'){
        this.cardsData.nextSleep.prediction = this.predictSleepTime();
      } else {
        this.cardsData.nextSleep.prediction = this.predictAwakeTime();
      }

      var date = new Date(this.cardsData.nextSleep.timestamp)
      if (date.getHours() < 9) {
        this.cardsData.nextSleep.daytime = 'night'
      } else if (date.getHours() < 15) {
        this.cardsData.nextSleep.daytime = 'morning'
      } else if (date.getHours() < 21) {
        this.cardsData.nextSleep.daytime = 'afternoon'
      } else {
        this.cardsData.nextSleep.daytime = 'night'
      }

    }

    // Doctor
    this.cardsData.nextDoctor.timestamp = -1;
    this.cardsData.nextDoctor.comment = "";
    if (this.currentBaby.doctorHistory && this.currentBaby.doctorHistory.length > 0){
      var now = new Date().getTime();
      i = 0;
      var nextAppointment = this.currentBaby.doctorHistory[i];
      while (nextAppointment && nextAppointment.timestamp < now){
        i += 1;
        nextAppointment = this.currentBaby.doctorHistory[i];
      }

      if (nextAppointment) {
        this.cardsData.nextDoctor.timestamp = nextAppointment.timestamp;
        this.cardsData.nextDoctor.comment = nextAppointment.comment;
      }
    }


  }

  predictFeed() {
    //TODO: Call ML
    //For now, 3 hours later
    // return this.currentBaby.feedHistory[this.currentBaby.feedHistory.length-1].feedEndTime + 180 * 60000;

    // let predictNextFeedTime = mlr.predictNextFeedTime(this.currentBaby.feedHistory);
    let predictNextFeedTime = mlr.predictNextFeedTime(feedEvents);
    console.log("The baby will be hungry again in " + predictNextFeedTime + "minutes");

    return predictNextFeedTime
  }

  predictSleepTime() {
    let predictSleeping = mlr.predictSleepTime(this.currentBaby.sleepHistory);
    console.log("The baby will be sleeping for " + predictSleeping + "minutes");
    return predictSleeping
  }

  predictAwakeTime() {
    let predictAwake = mlr.predictAwakeTime(this.currentBaby.sleepHistory);
    console.log("The baby will be awake for " + predictAwake + "minutes");

    return predictAwake
  }

}
