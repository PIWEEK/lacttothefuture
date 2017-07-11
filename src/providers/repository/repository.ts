import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class RepositoryProvider {

  public currentBaby: any;
  private babiesList: any;

  constructor(private storage: Storage) {
    //this.createSampleData()
    this.currentBaby = {
        name:'',
        sex: 'boy',
        nextEat: {
          prediction: 0,
          feedStartTime: 0,
          feedEndTime: 0,
          totalToday: '',
          mealsToday: 0,
          happy: 4,
          totalFeedingTime: 0,
          leftFeedingTime:0,
          rightFeedingTime:0,
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
        },
        feedHistory: []
      }
      this.loadFromLocalStorage()
  }

  createSampleData() {

    this.babiesList = [
      {
        name:'Diego',
        sex: 'boy',
        nextEat: {
          prediction: new Date().getTime() + 120 * 60000,
          feedStartTime: new Date().getTime() - 122 * 60000,
          feedEndTime: new Date().getTime() - 122 * 60000,
          totalToday: '2h 21min',
          mealsToday: 3,
          happy: 5,
          totalFeedingTime: 0,
          leftFeedingTime:0,
          rightFeedingTime:0,
          lastFeedBreast: 'i'
        },
        nextSleep: {
          prediction: new Date().getTime()  + 240 * 60000,
          timestamp: new Date().getTime()  - 37 * 60000,
          status: "DESPIERTO",
          happy: 4,
          daytime: 'afternoon'
        },
        nextDoctor: {
          timestamp: new Date().getTime()  + 1.2 * 24 * 60 * 60000,
          notes: "Cita con el pediatra por fiebre y vómitos. Malestar general, sobre todo de noche, que no hay quién le duerma."
        },
        feedHistory: []
      },
      {name:'Pepe'}
    ]

    this.currentBaby = this.babiesList[0]

    this.saveToLocalStorage()

  }

  saveFeedData(feedStartTime, totalFeedingTime, leftFeedingTime, rightFeedingTime, lastFeedBreast, happy) {
    console.log("saveFeedData");
    console.log(this);

    //TODO
    var feedData = {
          prediction: new Date().getTime() + 180 * 60000, //3 hours from now
          feedStartTime: feedStartTime,
          feedEndTime: new Date(),
          totalToday: 0,
          mealsToday: 0,
          happy: 5,
          totalFeedingTime: totalFeedingTime,
          leftFeedingTime: leftFeedingTime,
          rightFeedingTime: rightFeedingTime,
          lastFeedBreast: lastFeedBreast
    }

    this.currentBaby.feedHistory.push(feedData);
    this.currentBaby.nextEat = feedData;

    this.saveToLocalStorage();

    this.updateTodayValues();
  }



  saveToLocalStorage(){
    this.storage.set( 'lact_data', JSON.stringify(this.babiesList));

  }

  loadFromLocalStorage(){
    this.storage.get('lact_data').then((val) => {
      this.babiesList = JSON.parse(val);
      if (this.babiesList){
        this.currentBaby = this.babiesList[0];
        this.updateTodayValues();
      } else {
        //TODO
        //Open onboarding
        this.createSampleData();
      }
    });


  }

  updateTodayValues() {
      //Calculate today values
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      var mealsToday = 0;

      for (var i=this.currentBaby.feedHistory.length-1;i>=0;i--){
        var feedDate = new Date(this.currentBaby.feedHistory[i].feedStartTime);
        feedDate.setHours(0, 0, 0, 0);
        console.log(today);
        console.log(feedDate);
        if (feedDate.getTime() == today.getTime()){
          mealsToday += 1;
        } else {
          break;
        }
      }

      this.currentBaby.nextEat.mealsToday = mealsToday;
  }

}
