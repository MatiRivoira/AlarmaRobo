import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { inject } from '@angular/core';
import { NurService } from 'src/app/services/nur.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email!: string;
  password!: string;
  errMsgemail!: string;
  errMsgPassword!: string;
  errMsg!: string;
  showPassword: boolean = false;
  showUsers: boolean = false;
  isLoading: boolean = false;

  errorStates = { email: false, password: false };

  nurSvc = inject(NurService);
  firebaseSvc = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.errMsg = '';
    this.errMsgemail = '';
    this.errMsgPassword = '';
    this.errorStates = { email: false, password: false };
  }

  async login() {
    this.errMsgemail = '';
    this.errMsgPassword = '';

    if (!this.email) {
      this.errorStates.email = true;
      this.errMsgemail = 'Ingrese el nombre de usuario.';
    } else {
      this.errorStates.email = false;
    }

    if (!this.password) {
      this.errorStates.password = true;
      this.errMsgPassword = 'Introduzca su contraseña.';
      return;
    } else {
      this.errorStates.password = false;
    }
    
    if (this.email && this.password) {
      this.isLoading = true;
      this.firebaseSvc
        .singIn({ email: this.email, password: this.password })
        .then((res:any) => {
          this.email = "";
          this.password = "";
          this.nurSvc.esperarYRedirigir('userdata', JSON.stringify(res), '/home');
        })
        .catch((err:any) => {
          console.log(err);
          switch (err.code) {
            case 'auth/invalid-email':
              this.errMsgemail = 'Ingrese un correo electronico valido.';
              this.errorStates.email = true;
              break;
            case 'auth/invalid-credential':
              this.errMsg = 'Correo y/o contraseña incorrecta.';
              this.errorStates.email = true;
              this.errorStates.password = true;
              break;
            case 'auth/missing-email':
              this.errMsgemail = 'Ingrese el correo electronico.';
              this.errorStates.email = true;
              this.errMsgPassword = 'Ingrese la contraseña';
              this.errorStates.password = true;
              break;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });

    }
  }

  limpiar() {
    this.email = '';
    this.password = '';
    this.errMsgPassword = '';
    this.errMsgemail = '';
    this.errMsg = '';
    this.errorStates = { email: false, password: false };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  registrar() {
    this.limpiar();
    this.router.navigateByUrl('/register');
  }

  toggleUsersVisibility() {
    this.showUsers = !this.showUsers;
  }

  autoFillUser(user: string): void {
    switch (user) {
      case 'user1':
        this.email = 'mgrivoira26@gmail.com';
        this.password = 'banana22';
        break;
      case 'user2':
        this.email = 'krysa@krysa3d.com';
        this.password = 'krysa3d.com';
        break;
      case 'user3':
        this.email = 'funkosPersonalisadosEn@krysa3d.com';
        this.password = 'krysa3d.com';
        break;
    }
  }
}
