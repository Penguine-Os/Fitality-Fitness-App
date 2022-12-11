import {Component, OnInit} from '@angular/core';
import {FireAuthService} from '../Services/Authentication/fire-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public authService: FireAuthService) {
  }

  ngOnInit() {
  }
}
