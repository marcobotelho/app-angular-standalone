import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { SenhasService } from '../senhas.service';

@Component({
  selector: 'app-senhas-reset',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './senhas-reset.component.html',
  styleUrl: './senhas-reset.component.scss'
})
export class SenhasResetComponent implements OnInit, OnDestroy {

  usuarioEmail: string = this.authService.getUsuarioEmail();
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

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.subscription = this.senhasService.getSenhasReset(this.usuarioEmail)
      .subscribe({
        next: (senhasAlterarClass) => {
          this.alertService.sendAlert(['senhas', 'alterar', senhasAlterarClass.token], "<strong>Sucesso!</strong> Um nova senha foi enviada para o seu e-mail.", 'success');
        },
        error: (error) => {
          this.alertService.sendAlert(['senhas', 'reset'], "<strong>Erro!</strong> " + error, 'error');
        }
      })
  }
}
