import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
})
export class MenuBarComponent {

  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) { }

  onLogout() {
    this.authService.onLogout();
    const urlFragments = ['login'];
    this.alertService.sendAlert(urlFragments, 'Logout efetuado com sucesso', 'success');
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getUsuarioEmail(): string {
    return this.authService.getUsuarioEmail();
  }

}