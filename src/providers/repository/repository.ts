import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class RepositoryProvider {

  public currentBaby: any;
  private babiesList: any;
  public cardsData: any;


  constructor(private storage: Storage) {
    //TODO: For now, we clear the data every time. Remove this clear ASAP
    this.storage.set('lact_data', '{}');

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
          feedStartTime: -1
        },
        nextSleep: {
          prediction: 0,
          timestamp: 0,
          status: "DESPIERTO",
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
            type: 'breast'
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

  saveFeedData(feedStartTime, feedEndTime, totalFeedingTime, leftFeedingTime, rightFeedingTime, lastFeedBreast, happy, comment, type) {
    console.log("saveFeedData");
    var feedData = {
          feedStartTime: feedStartTime.getTime(),
          feedEndTime: feedEndTime.getTime(),
          happy: happy,
          totalFeedingTime: totalFeedingTime,
          leftFeedingTime: leftFeedingTime,
          rightFeedingTime: rightFeedingTime,
          lastFeedBreast: lastFeedBreast,
          comment: comment,
          type: type
    }

    this.currentBaby.feedHistory.push(feedData);

    this.saveToLocalStorage();

    this.updateCardData();
  }

  saveDoctorData(date, comment) {

    var doctorData = {
          timestamp: date.getTime(),
          comment: comment
    }

    this.currentBaby.doctorHistory.push(doctorData);
    var i =0;
    while (this.currentBaby.doctorHistory[i] < doctorData.timestamp){
      i+=1;
    }

    this.currentBaby.doctorHistory.splice(i, 0, doctorData);

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
        console.log(this.currentBaby);
        this.updateCardData();
      } else {
        //TODO
        //Open onboarding
        this.createSampleData();
        this.updateCardData();
      }
    });


  }

  updateCardData() {

    if (this.currentBaby.feedHistory && this.currentBaby.feedHistory.length > 0){
        //Calculate today values
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var mealsToday = 0;

        for (var i=this.currentBaby.feedHistory.length-1;i>=0;i--){
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
    } else {
        this.cardsData.nextFeed.mealsToday = 0;
        this.cardsData.nextFeed.happy = 0;
        this.cardsData.nextFeed.lastFeedType = '';
        this.cardsData.nextFeed.prediction = 0;
        this.cardsData.nextFeed.feedEndTime = -1;
        this.cardsData.nextFeed.feedStartTime = -1;
    }


    // Doctor
    this.cardsData.nextDoctor.timestamp = -1;
    this.cardsData.nextDoctor.notes = "";
    if (this.currentBaby.doctorHistory && this.currentBaby.doctorHistory.length > 0){
      var i = 0;
      var now = new Date().getTime();
      while (this.currentBaby.doctorHistory[i].timestamp > now){
        i += 1;
      }
      if (i < this.currentBaby.doctorHistory.length){
        this.cardsData.nextDoctor.timestamp = this.currentBaby.doctorHistory[i].timestamp;
        this.cardsData.nextDoctor.notes = this.currentBaby.doctorHistory[i].notes;
      }
    }


  }

  predictFeed() {
    //TODO: Call ML
    //For now, 3 hours later
    return this.currentBaby.feedHistory[this.currentBaby.feedHistory.length-1].feedEndTime + 180 * 60000;
  }

}
