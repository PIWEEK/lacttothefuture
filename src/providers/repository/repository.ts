import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the RepositoryProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RepositoryProvider {

  private currentBaby: any;
  private babiesList: any;

  constructor() {

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
        }
      },
      {name:'Pepe'}
    ]

    this.currentBaby = this.babiesList[0]

  }

  getCurrentBaby() {
    return this.currentBaby
}

}
