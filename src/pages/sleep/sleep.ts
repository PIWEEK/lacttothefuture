import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";
import { HappyPage } from "../happy/happy";

@IonicPage()
@Component({
  selector: 'page-sleep',
  templateUrl: 'sleep.html',
})
export class SleepPage {
  private sleepTimeISOString: string;
  private comments: string;
  private confirmedExit: boolean;
  private happiness: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private repository: RepositoryProvider, private modalCtrl: ModalController) {
    this.confirmedExit = false;
    this.sleepTimeISOString = new Date().toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SleepPage');
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

  public saveData() {
    this.showHappiness();

  }


  showHappiness() {
   let profileModal = this.modalCtrl.create(HappyPage, {  });
   profileModal.onDidDismiss(data => {
     this.happiness = data.happiness;
     this.saveAndExit()
   });
   profileModal.present();
  }

  public saveAndExit(){
    this.repository.saveSleepData(new Date(this.sleepTimeISOString), this.comments, this.happiness);
    this.confirmedExit = true;
    this.navCtrl.pop();
  }



}
