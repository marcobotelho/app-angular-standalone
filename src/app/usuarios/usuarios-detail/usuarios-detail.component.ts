import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { PerfisService } from '../../perfis/services/perfis.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { UsuarioClass } from '../classes/usuario-class';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-usuarios-detail',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, AlertComponent],
  templateUrl: './usuarios-detail.component.html',
  styleUrl: './usuarios-detail.component.scss'
})
export class UsuariosDetailComponent {

  usuarioId: number = 0;
  usuario: UsuarioClass = new UsuarioClass();

  alertMessage: string = '';
  alertType: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private router: Router,
    private usuariosService: UsuariosService, private perfisService: PerfisService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.route.paramMap.subscribe(params => {
      this.usuarioId = Number(params.get('usuarioId'));
    })

    if (this.usuarioId == 0) {
      this.usuario = new UsuarioClass();
    } else {
      this.getUsuarioById(this.usuarioId);
    }
  }

  private getUsuarioById(id: number) {
    this.subscription = this.usuariosService.getById(id).subscribe({
      next: usuario => {
        this.usuario = usuario;
      },
      error: err => {
        const urlFragments = ['usuarios', this.usuarioId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.usuario.id == 0) {
      this.saveUsuario();
    } else {
      this.updateUsuario();
    }
  }

  goToUsuarios() {
    this.router.navigate(['usuarios']);
  }

  private saveUsuario() {
    this.subscription = this.usuariosService.save(this.usuario).subscribe({
      next: () => {
        //console.log('Telefone incluido:', savedCliente);
        const urlFragments = ['usuarios'];
        this.alertService.sendAlert(urlFragments, '<strong>Usuário incluido com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao incluir telefone:', err);
        const urlFragments = ['usuarios', this.usuarioId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao incluir usuário</strong><br>" + err, 'error');
      }
    });
  }

  private updateUsuario() {
    this.subscription = this.usuariosService.update(this.usuario).subscribe({
      next: () => {
        //console.log('Telefone atualizado:', updatedCliente);
        const urlFragments = ['usuarios'];
        this.alertService.sendAlert(urlFragments, '<strong>Usuário atualizado com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao atualizar telefone:', err);
        const urlFragments = ['usuarios', this.usuarioId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao atualizar usuário</strong><br>" + err, 'error');
      }
    });
  }
}
