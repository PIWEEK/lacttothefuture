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
          totalToday: 0,
          mealsToday: 0,
          happy: 0,
          lastFeedBreast: 'i'
        },
        nextSleep: {
          prediction: 0,
          timestamp: 0,
          status: "DESPIERTO",
          happy: 5,
          daytime: 'morning'
        },
        nextDoctor: {
          timestamp: 0,
          notes: ""
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
          {
            feedStartTime: new Date().getTime() - 122 * 60000,
            feedEndTime: new Date().getTime() - 111 * 60000,
            happy: 5,
            totalFeedingTime: 8000,
            leftFeedingTime: 3000,
            rightFeedingTime: 5000,
            lastFeedBreast: 'r'
          }
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

  saveFeedData(feedStartTime, totalFeedingTime, leftFeedingTime, rightFeedingTime, lastFeedBreast, happy) {
    console.log("saveFeedData");
    var feedData = {
          feedStartTime: feedStartTime.getTime(),
          feedEndTime: new Date().getTime(),
          happy: happy,
          totalFeedingTime: totalFeedingTime,
          leftFeedingTime: leftFeedingTime,
          rightFeedingTime: rightFeedingTime,
          lastFeedBreast: lastFeedBreast
    }

    this.currentBaby.feedHistory.push(feedData);
    this.currentBaby.nextFeed = feedData;

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

    if (this.currentBaby.feedHistory.length > 0){
        //Calculate today values
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var mealsToday = 0;

        for (var i=this.currentBaby.feedHistory.length-1;i>=0;i--){
          var feedDate = new Date(this.currentBaby.feedHistory[i].feedStartTime);
          feedDate.setHours(0, 0, 0, 0);
          console.log(today);
          console.log(feedDate);
          if (feedDate.getTime() != today.getTime()){
            break
          }
          mealsToday += 1;
        }


        var lastFeed = this.currentBaby.feedHistory[this.currentBaby.feedHistory.length-1];

        this.cardsData.nextFeed.totalToday = 0;
        this.cardsData.nextFeed.mealsToday = mealsToday;
        this.cardsData.nextFeed.happy = lastFeed.happy;
        this.cardsData.nextFeed.lastFeedBreast = lastFeed.lastFeedBreast;
        this.cardsData.nextFeed.prediction = this.predictFeed();
    } else {
        this.cardsData.nextFeed.totalToday = 0;
        this.cardsData.nextFeed.mealsToday = 0;
        this.cardsData.nextFeed.happy = 0;
        this.cardsData.nextFeed.lastFeedBreast = 'i';
        this.cardsData.nextFeed.prediction = 0;
    }


  }

  predictFeed() {
    //TODO: Call ML
    //For now, 3 hours later
    console.log(this.currentBaby.feedHistory[this.currentBaby.feedHistory.length-1])
    return this.currentBaby.feedHistory[this.currentBaby.feedHistory.length-1].feedEndTime + 180 * 60000;
  }

}
