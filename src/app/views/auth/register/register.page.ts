import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  message: string = '';
  email: string = '';
  pass: string = '';
  pass2: string = '';
  errMsg: string = '';
  showPassword: boolean = false;
  showUsers: boolean = false;
  errorStates = { email: false, pass: false, pass2: false };

  firebaseSvc = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.showUsers = false;
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  CrearCuenta() {
    this.errMsg = '';
    this.errorStates = { email: false, pass: false, pass2: false };

    if (!this.email || !this.pass || !this.pass2) {
      this.errMsg = 'Completa todos los campos';
      this.errorStates.email = !this.email;
      this.errorStates.pass = !this.pass;
      this.errorStates.pass2 = !this.pass2;
      return;
    }

    if (this.pass !== this.pass2) {
      this.errMsg = 'Las contraseñas no coinciden';
      this.errorStates.pass = true;
      this.errorStates.pass2 = true;
      return;
    }

    this.firebaseSvc
      .signUp({ email: this.email, password: this.pass })
      .then((res) => {
        console.log(res);

        let seconds = 5;
        this.message = `Cuenta creada exitosamente! Redirigiendo en ${seconds} segundos...`;

        const interval = setInterval(() => {
          seconds--;
          this.message = `Cuenta creada exitosamente! Redirigiendo en ${seconds} segundos...`;
          if (seconds === 0) {
            clearInterval(interval);
            this.message = '';
            this.email = '';
            this.pass = '';
            this.pass2 = '';
            this.router.navigateByUrl('/login');
          }
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        switch (err.message.trim()) {
          case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
            this.errMsg = 'La contraseña debe tener al menos 6 caracteres.';
            this.errorStates.pass = true;
            this.errorStates.pass2 = true;
            break;

          case 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).':
            this.errorStates.email = true;
            this.errMsg = 'El email ya esta registrado.';
            break;
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  toggleUsersVisibility() {
    this.showUsers = !this.showUsers;
  }

  autoFillUser(): void {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let userName = '';
    for (let i = 0; i < 10; i++) {
      userName += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    
    this.email = `${userName}@gmail.com`;
    this.pass = '123456';
    this.pass2 = '123456';
  }
}
