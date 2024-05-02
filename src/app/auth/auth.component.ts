import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { AlertService } from '../shared/alert/alert.service';
import { AuthClass } from './auth-class';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, FormsModule, AlertComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  auth: AuthClass = new AuthClass();
  alertMessage: string = '';
  alertType: string = '';

  notShow: boolean = true;

  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private alertService: AlertService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    this.getAuth();
  }

  private async getAuth() {
    try {
      const responseToken = await lastValueFrom(this.authService.postLogin(this.auth));
      const usuarioPerfis = await lastValueFrom(this.authService.getUsuarioPerfisByEmail(this.auth.email));
      if (responseToken && usuarioPerfis) {
        const token = responseToken.message.split(' Token ')[1];
        const roles: string[] = [];
        for (const p of usuarioPerfis) {
          roles.push(p.nome);
        }

        this.authService.setUsuarioEmail(this.auth.email);
        this.authService.setToken(token);
        this.authService.setRoles(roles);

        this.router.navigate(['home']);

      }

    } catch (err) {
      const urlFragments = ['auth'];
      this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
    }
  }

  // private async getAuth() {
  //   try {
  //     const responseToken = await lastValueFrom(this.authService.postLogin(this.auth));
  //     if (responseToken) {
  //       const token = responseToken.message.split(' Token ')[1];
  //       this.authService.setUsuarioEmail(this.auth.email);
  //       this.authService.setToken(token);
  //       console.log("Token: " + token);

  //       const usuarioPerfis = await lastValueFrom(this.authService.getUsuarioPerfisByEmail(this.auth.email));
  //       if (usuarioPerfis) {
  //         const roles: string[] = [];
  //         for (const p of usuarioPerfis) {
  //           roles.push(p.nome);
  //         }
  //         this.authService.setRoles(roles);
  //         console.log("roles: " + roles);
  //       }
  //     }
  //     this.router.navigate(['home']);
  //   } catch (err) {
  //     const urlFragments = ['auth'];
  //     this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
  //   }
  // }
}
