import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import * as mlr from "../../utils/mlr";
//import * as converter from "../../utils/converter";

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
        sex: 'boy',
        feedHistory: [],
        sleepHistory: [],
        doctorHistory: []

      },
      {
        name:'Maya',
        sex: 'girl',
        feedHistory: [],
        sleepHistory: [],
        doctorHistory: []
      },
      {
        name:'Juan',
        sex: 'boy',
        feedHistory: [],
        sleepHistory: [],
        doctorHistory: []
      }
    ]

    var date = new Date().getTime() - 86400000; //24h
    while (date < new Date().getTime()){
      var feedingTime = ((Math.floor((Math.random() * 30) + 15)) * 60000); // Min 15 mins, max 45 mins
      var left = feedingTime - ((Math.floor((Math.random() * feedingTime) + 1)));
      var feedTypes = ['breast', 'bottle', 'solid'];
      var breasts = ['r', 'l'];
      var bottleTypes = ['formula', 'extracted', 'watter'];
      var solidTypes = ['Macarrones', 'Puré de verduras', 'Potito de frutas'];

      var feed = {
            feedStartTime: date,
            feedEndTime: date + feedingTime,
            happy: Math.floor((Math.random() * 5) + 1),
            totalFeedingTime: feedingTime,
            leftFeedingTime: left,
            rightFeedingTime: feedingTime - left,
            lastFeedBreast: breasts[Math.floor(Math.random() * 2)],
            comment: 'Lorem ipsum dolor...',
            type: feedTypes[Math.floor(Math.random() * 3)],
            quantity: Math.floor(Math.random() * 50) + 50,
            bottleType: bottleTypes[Math.floor(Math.random() * 3)],
            solidName: solidTypes[Math.floor(Math.random() * 3)]
          }
      this.babiesList[0].feedHistory.push(feed);
      date = date + ((Math.floor(Math.random() * 60) + 240) * 60000);
    }

    date = new Date().getTime() - 86400000; //24h
    var status = "AWAKE";
    while (date < new Date().getTime()){

      var sleep = {
            timestamp: date,
            comment: 'Lorem ipsum dolor...',
            status: status,
            happy: Math.floor((Math.random() * 5) + 1),
          }
      this.babiesList[0].sleepHistory.push(sleep);
      date = date + ((Math.floor(Math.random() * 60) + 240) * 60000);
      if (status == "AWAKE"){
        status = "SLEEPING"
      } else {
        status = "AWAKE"
      }
    }


    var d = new Date();
    d.setHours(12);
    d.setMinutes(0);
    d.setDate(16);


    var doctorData = {
          timestamp: d.getTime(),
          comment: "Tiene muchos mocos y fiebre"
    }
    this.babiesList[0].doctorHistory.push(doctorData);

    d.setHours(13);
    d.setMinutes(0);
    d.setDate(24);

    doctorData = {
          timestamp: d.getTime(),
          comment: "Vacuna sarampión"
    }
    this.babiesList[0].doctorHistory.push(doctorData);


    d.setHours(11);
    d.setMinutes(30);
    d.setDate(28);

    doctorData = {
          timestamp: d.getTime(),
          comment: "Vacuna rubeola"
    }
    this.babiesList[0].doctorHistory.push(doctorData);


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
    return this.currentBaby.feedHistory[this.currentBaby.feedHistory.length-1].feedEndTime + 180 * 60000;
  }

  predictSleepTime() {
    let predictSleeping = mlr.predictSleepTime(this.currentBaby.sleepHistory);
    console.log("The baby will be sleeping for " + predictSleeping + "minutes");
    return this.cardsData.nextSleep.timestamp + (predictSleeping * 60 * 1000);
  }

  predictAwakeTime() {
    let predictAwake = mlr.predictAwakeTime(this.currentBaby.sleepHistory);
    console.log("The baby will be awake for " + predictAwake + "minutes");

    return this.cardsData.nextSleep.timestamp + (predictAwake * 60 * 1000);
  }

}
