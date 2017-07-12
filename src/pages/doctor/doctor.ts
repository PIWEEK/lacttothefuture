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
    this.doctorTimeISOString = new Date().toISOString();
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
    this.repository.saveDoctorData(new Date(this.doctorTimeISOString), this.comments);
    this.confirmedExit = true;
    this.navCtrl.pop();
  }

}
