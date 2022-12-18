import {Component, OnInit} from '@angular/core';
import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {AlertController, ToastController} from '@ionic/angular';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit {

  constructor(public toastCtrl: ToastController,
              public authService: FireAuthService) {
  }

  ngOnInit() {
  }

  hapticsVibrate = async () => {
    await Haptics.vibrate({duration: 500});
  };

  async presentToast(duration: number) {

    duration *= 60;

    let remainingTime = duration;
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;

    const toast = await this.toastCtrl.create({
      message: `Good Work! Recovery in: ${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`,
      duration: duration * 1000,
      icon: 'globe',
      position: 'top'
    });


    toast.present();


    const interval = setInterval(() => {

      remainingTime--;
      minutes = Math.floor(remainingTime / 60);
      seconds = remainingTime % 60;

      toast.message = `Good Work! Recovery in: ${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
      if (seconds < 4) {
        this.hapticsVibrate();
      }

    }, 1000);

    toast.onDidDismiss().then(() => {
      clearInterval(interval);

    });
  }
}
