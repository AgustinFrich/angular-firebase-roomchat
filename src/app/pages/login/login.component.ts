import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  password = '';
  mail = '';
  errorMsg = '';
  constructor(private authS: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.authS.login(this.mail, this.password);
  }

  rapido1() {
    this.authS.login('agustinfrich@gmail.com', '11111111');
  }
  rapido2() {
    this.authS.login('test1@test.com', '11111111');
  }
  rapido3() {
    this.authS.login('test2@test.com', '11111111');
  }
}
