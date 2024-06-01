import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@awesome-cordova-plugins/device-motion/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string = "Usuario";
  auth = inject(AuthService);
  password!: string;

  alarmaActivada: boolean = false;
  mostrarModal: boolean = false;


  constructor(private deviceMotion: DeviceMotion, private vibration: Vibration, private flashlight: Flashlight) {}


  alternarAlarma(): void {
    if (this.alarmaActivada) {
      this.mostrarModal = true;
    } else {
      this.start();
      this.alarmaActivada = true;
    }
  }

  desactivarAlarma(): void {
    let userdata = JSON.parse(localStorage.getItem('userdata') || '{"email": "example@example.com"}');

    this.auth.singIn({ email: userdata.user.email, password: this.password })
      .then(() => {
        this.mostrarModal = false;
        this.alarmaActivada = false;
        this.password = "";
        //stoop
        this.subscription.unsubscribe();
        this.vibration.vibrate(0);
      })
      .catch(() => {
        this.vibrar();
        this.encenderLinterna();
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            this.emitirSonido("contraseñaIncorrecta");
          }, i * 1000); // Retardo de 1000 milisegundos (1 segundo)
        }
      });
  }

  
  audio:any;
  emitirSonido(sonido: string) {
    const audio = new Audio(`../assets/sounds/${sonido}.mp3`);
    audio.volume = 1;
  
    // Verificar si el audio anterior ha terminado antes de reproducir uno nuevo
    if (!this.audio || (this.audio.ended && this.audio != audio)) {
      this.audio = audio;
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }

  encenderLinterna(): void {
    this.flashlight.available().then((isAvailable: boolean) => {
      if (isAvailable) {
        // Encender la linterna
        this.flashlight.switchOn().then(() => {
          console.log('Linterna encendida');
        }).catch((error: any) => {
          console.error('Error al encender la linterna:', error);
        });

        // Apagar la linterna después de 3 segundos
        setTimeout(() => {
          this.flashlight.switchOff().then(() => {
            console.log('Linterna apagada');
          }).catch((error: any) => {
            console.error('Error al apagar la linterna:', error);
          });
        }, 5000);
      } else {
        console.log('Linterna no disponible en este dispositivo');
      }
    }).catch((error: any) => {
      console.error('Error al verificar la disponibilidad de la linterna:', error);
    });
  }

  vibrar() {
    this.vibration.vibrate(5000);
    setTimeout(() => {
      this.vibration.vibrate(0);
    }, 5000);
  }
  

  accelerationX: any;
  accelerationY: any;
  accelerationZ: any;
  subscription: any;

  currentPositionCellPhone = 'horizontal';
  previousPositionCellPhone = 'horizontal';

  primeraVez:boolean = true;
  start() {
    this.subscription = this.deviceMotion
      .watchAcceleration({ frequency: 300 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.accelerationX = Math.floor(acceleration.x);
        this.accelerationY = Math.floor(acceleration.y);
        this.accelerationZ = Math.floor(acceleration.z);

        if (acceleration.x > 4) {
          //Inclinacion Izquierda
          this.primeraVez = false;
          //encender flash por 5 segundos y sonido
          if (!this.primeraVez) {
            this.currentPositionCellPhone = 'izquierda';}
        } else if (acceleration.x < -4) {
          //Inclinacion Derecha
          this.primeraVez = false;
          //encender flash por 5 segundos y sonido
          if (!this.primeraVez) {
          this.currentPositionCellPhone = 'derecha';}
        } else if (acceleration.y >= 9) {
          this.primeraVez = false;
          //encender flash por 5 segundos y sonido
          if (!this.primeraVez) {
            this.encenderLinterna();
            this.currentPositionCellPhone = 'vertical';

            if (this.currentPositionCellPhone != this.previousPositionCellPhone) {
              this.previousPositionCellPhone = 'vertical';
            }
          }
          
        } else if (acceleration.z >= 9 && acceleration.y >= -1 && acceleration.y <= 1 && acceleration.x >= -1 && acceleration.x <= 1) 
        {
          //acostado vibrar por 5 segundos y sonido
          if (!this.primeraVez) {
            this.currentPositionCellPhone = 'horizontal';
            this.vibration.vibrate(5000);
          }
        }
        if (!this.primeraVez) {
          this.emitirSonido(this.currentPositionCellPhone);
        }
      });
  } // end of start
}
