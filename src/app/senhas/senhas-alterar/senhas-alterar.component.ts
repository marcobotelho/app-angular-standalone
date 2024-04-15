import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { SenhasAlterarClass } from '../senhas-alterar-class';
import { SenhasService } from '../senhas.service';

@Component({
  selector: 'app-senhas-alterar',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './senhas-alterar.component.html',
  styleUrl: './senhas-alterar.component.scss'
})
export class SenhasAlterarComponent implements OnInit, OnDestroy {

  senhasAlterarClass: SenhasAlterarClass = new SenhasAlterarClass();

  alertMessage: string = '';
  alertType: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private senhasService: SenhasService, private authService: AuthService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.route.paramMap.subscribe(params => {
      this.senhasAlterarClass.token = params.get('token') ?? '';
    })

    if (this.senhasAlterarClass.token === '') {
      this.senhasAlterarClass.token = this.authService.getToken();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {

    this.subscription = this.senhasService.putSenhasAlterar(this.senhasAlterarClass.token, this.senhasAlterarClass)
      .subscribe({
        next: () => {
          this.authService.onLogout();
          this.alertService.sendAlert(['auth'], "<strong>Sucesso!</strong> Senha alterada. Faça o login com sua nova senha.", 'success');
        },
        error: (error) => {
          this.alertService.sendAlert(['senhas', 'alterar', this.senhasAlterarClass.token], "<strong>Erro!</strong> " + error, 'error');
        }
      })

  }

}

