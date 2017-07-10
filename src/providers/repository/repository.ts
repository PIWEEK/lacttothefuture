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
      {name:'Diego'},
      {name:'Pepe'}
    ]

    this.currentBaby = this.babiesList[0]

  }

  getCurrentBaby() {
    return this.currentBaby
}

}
