import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AlertService } from './shared/alert/alert.service';
import { MenuBarComponent } from './shared/menu-bar/menu-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, MenuBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app-angular-standalone';

  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {

  }

  onLogout() {
    this.authService.onLogout();
    this.alertService.sendAlert(['auth'], '<strong>Sessão encerrada</strong><br>Efetue o login para continuar', 'success');
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getUsuarioEmail(): string {
    return this.authService.getUsuarioEmail();
  }

  getRoles(): string[] {
    return this.authService.getRoles();
  }

  onAlterarSenha() {
    const token = this.authService.getToken();
    this.router.navigate(['/senhas', 'alterar', token]);
  }
}
