import { Component, OnInit } from '@angular/core';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {

  constructor(public authService: FireAuthService) { }

  ngOnInit(): void {
  }

}
