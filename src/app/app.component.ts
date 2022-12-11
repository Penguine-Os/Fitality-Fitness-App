import { Component } from '@angular/core';
import {FireAuthService} from './Services/Authentication/fire-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly placeholder = '/assets/images/Portrait_Placeholder.png';
  constructor(public authService: FireAuthService) {}
}
