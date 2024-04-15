import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { UsuarioClass } from '../classes/usuario-class';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.scss'
})
export class UsuariosListComponent {
  usuarios: UsuarioClass[] = [];
  alertMessage: string = '';
  alertType: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private usuariosService: UsuariosService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.getUsuarios();
  }

  private getUsuarios() {
    this.subscription = this.usuariosService.getAll().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
      },
      error: err => {
        const urlFragments = ['auth'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  goToEdit(usuario: UsuarioClass) {
    //console.log(usuario);
    this.router.navigate(['usuarios', usuario.id]);
  }

  goToPerfis(usuario: UsuarioClass) {
    this.router.navigate(['usuarios', usuario.id, 'perfis']);
  }

  goToNew() {
    this.router.navigate(['usuarios', 0]);
  }

  onDelete(usuarioId: number) {
    if (window.confirm('Tem certeza que deseja excluir este usuario?')) {
      const urlFragments = ['usuarios'];
      this.subscription = this.usuariosService.delete(usuarioId).subscribe({
        next: () => {
          //console.log('Usuario excluído:', updatedUsuario);
          this.alertService.sendAlert(urlFragments, '<strong>Usuario excluído com sucesso</strong>', 'success');
          this.getUsuarios();
        },
        error: err => {
          //console.error('Erro ao atualizar usuario:', err);
          this.alertService.sendAlert(urlFragments, "<strong>Erro ao excluir usuario</strong><br>" + err, 'error');
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
