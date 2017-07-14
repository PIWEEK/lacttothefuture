import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RepositoryProvider } from "../../providers/repository/repository";

@IonicPage()
@Component({
  selector: 'page-doctor',
  templateUrl: 'doctor.html',
})
export class DoctorPage {
  private doctorTimeISOString: string;
  private comments: string;
  private confirmedExit: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private repository: RepositoryProvider) {
    this.confirmedExit = false;
    var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(10);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    tomorrow = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000))

    this.doctorTimeISOString = tomorrow.toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorPage');
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
    var date = new Date(this.doctorTimeISOString);
    date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    this.repository.saveDoctorData(date, this.comments);
    this.confirmedExit = true;
    this.navCtrl.pop();
  }

}
