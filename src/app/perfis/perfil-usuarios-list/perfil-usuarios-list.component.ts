import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { PerfilClass } from '../classes/perfil-class';
import { PerfilUsuariosClass } from '../classes/perfil-usuarios-class';
import { PerfisService } from '../services/perfis.service';

class UsuarioChecked {
  id: number = 0;
  nome: string = '';
  email: string = '';
  checked: boolean = false;
}

@Component({
  selector: 'app-perfil-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './perfil-usuarios-list.component.html',
  styleUrl: './perfil-usuarios-list.component.scss'
})
export class PerfilUsuariosListComponent implements OnInit {
  perfilId: number = 0;
  perfil: PerfilClass = new PerfilClass();
  usuariosChecked: UsuarioChecked[] = [];

  alertMessage: string = '';
  alertType: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute,
    private perfisService: PerfisService, private usuariosService: UsuariosService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.route.paramMap.subscribe(params => {
      this.perfilId = Number(params.get('perfilId'));
    });

    this.getPerfilById(this.perfilId);

    this.getUsuariosChecked();

  }

  goToPerfis() {
    this.router.navigate(['perfis']);
  }

  onCheck(usuarioChecked: UsuarioChecked) {
    for (const u of this.usuariosChecked) {
      if (u.id === usuarioChecked.id) {
        u.checked = !u.checked;
      }
    }
  }

  private getPerfilById(id: number) {
    this.subscription = this.perfisService.getById(id).subscribe({
      next: perfil => {
        this.perfil = perfil;
      },
      error: err => {
        const urlFragments = ['perfis', this.perfilId, 'usuarios'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  private async getUsuariosChecked() {
    try {
      const usuarios = await lastValueFrom(this.usuariosService.getAll());
      const perfilUsuarios = await lastValueFrom(this.perfisService.getPerfilUsuarios(this.perfilId));
      console.log("perfilUsuarios", perfilUsuarios);
      if (usuarios && perfilUsuarios) {
        this.usuariosChecked = usuarios.map(u => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          checked: perfilUsuarios.some(pu => pu.id === u.id)
        }));
      }

    } catch (err) {
      const urlFragments = ['perfis'];
      this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
    }
  }

  onSave() {
    let perfilUsuariosList: PerfilUsuariosClass[] = [];
    for (const uc of this.usuariosChecked) {
      perfilUsuariosList.push({ usuarioId: uc.id, perfilId: this.perfilId, adicionar: uc.checked });
    }
    this.subscription = this.perfisService.updatePerfilUsuariosList(perfilUsuariosList).subscribe({
      next: () => {
        const urlFragments = ['perfis', this.perfilId, 'usuarios'];
        this.alertService.sendAlert(urlFragments, '<strong>Usuarios atualizados com sucesso</strong>', 'success');
      },
      error: err => {
        const urlFragments = ['perfis', this.perfilId, 'usuarios'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao atualizar usuarios</strong><br>" + err, 'error');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
