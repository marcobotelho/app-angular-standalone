import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { PerfisService } from '../../perfis/services/perfis.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { UsuarioClass } from '../classes/usuario-class';
import { UsuarioPerfisClass } from '../classes/usuario-perfis-class';
import { UsuariosService } from '../services/usuarios.service';

class PerfilChecked {
  id: number = 0;
  nome: string = '';
  descricao: string = '';
  checked: boolean = false;
}

@Component({
  selector: 'app-usuario-perfis-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './usuario-perfis-list.component.html',
  styleUrl: './usuario-perfis-list.component.scss'
})
export class UsuarioPerfisListComponent implements OnInit {
  usuarioId: number = 0;
  usuario: UsuarioClass = new UsuarioClass();
  perfisChecked: PerfilChecked[] = [];

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
      this.usuarioId = Number(params.get('usuarioId'));
    });

    this.getUsuarioById(this.usuarioId);

    this.getPerfisChecked();

  }

  goToUsuarios() {
    this.router.navigate(['usuarios']);
  }

  onCheck(perfilChecked: PerfilChecked) {
    for (const p of this.perfisChecked) {
      if (p.id === perfilChecked.id) {
        p.checked = !p.checked;
      }
    }
  }

  private getUsuarioById(id: number) {
    this.subscription = this.usuariosService.getById(id).subscribe({
      next: usuario => {
        this.usuario = usuario;
      },
      error: err => {
        const urlFragments = ['usuarios', this.usuarioId, 'perfis'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  private async getPerfisChecked() {
    try {
      const perfis = await lastValueFrom(this.perfisService.getAll());
      const usuarioPerfis = await lastValueFrom(this.usuariosService.getUsuarioPerfis(this.usuarioId));
      if (perfis && usuarioPerfis) {
        this.perfisChecked = perfis.map(p => ({
          id: p.id,
          nome: p.nome,
          descricao: p.descricao,
          checked: usuarioPerfis.some(up => up.id === p.id)
        }));
      }

    } catch (err) {
      const urlFragments = ['usuarios'];
      this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
    }
  }

  onSave() {
    let usuarioPerfisList: UsuarioPerfisClass[] = [];

    for (const p of this.perfisChecked) {
      let usuarioPerfisClass: UsuarioPerfisClass = new UsuarioPerfisClass();
      usuarioPerfisClass.usuarioId = this.usuarioId;
      usuarioPerfisClass.perfilId = p.id;
      usuarioPerfisClass.adicionar = p.checked;
      usuarioPerfisList.push(usuarioPerfisClass);
    }

    this.subscription = this.usuariosService.updateUsuarioPerfisList(usuarioPerfisList).subscribe({
      next: () => {
        //console.log('Perfis atualizados:', savedPerfis);
        const urlFragments = ['usuarios', this.usuarioId, 'perfis'];
        this.alertService.sendAlert(urlFragments, '<strong>Perfis atualizados com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao atualizar perfis:', err);
        const urlFragments = ['usuarios', this.usuarioId, 'perfis'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao atualizar perfis</strong><br>" + err, 'error');
      }
    });


    // let perfis: PerfilClass[] = [];
    // console.log("perfisChecked", this.perfisChecked);
    // for (const p of this.perfisChecked) {
    //   if (p.checked) {
    //     let perfil: PerfilClass = new PerfilClass();
    //     perfil.id = p.id;
    //     perfil.nome = p.nome;
    //     perfil.descricao = p.descricao;
    //     perfis.push(perfil);
    //   }
    // }
    // this.subscription = this.usuariosService.updateUsuarioPerfis(this.usuarioId, perfis).subscribe({
    //   next: () => {
    //     //console.log('Perfis atualizados:', savedPerfis);
    //     const urlFragments = ['usuarios', this.usuarioId, 'perfis'];
    //     this.alertService.sendAlert(urlFragments, '<strong>Perfis atualizados com sucesso</strong>', 'success');
    //   },
    //   error: err => {
    //     //console.error('Erro ao atualizar perfis:', err);
    //     const urlFragments = ['usuarios', this.usuarioId, 'perfis'];
    //     this.alertService.sendAlert(urlFragments, "<strong>Erro ao atualizar perfis</strong><br>" + err, 'error');
    //   }
    // });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
