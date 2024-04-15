import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { PerfilClass } from '../classes/perfil-class';
import { PerfisService } from '../services/perfis.service';

@Component({
  selector: 'app-perfis-list',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './perfis-list.component.html',
  styleUrl: './perfis-list.component.scss'
})
export class PerfisListComponent implements OnInit {
  perfis: PerfilClass[] = [];
  alertMessage: string = '';
  alertType: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private perfisService: PerfisService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.getPerfis();
  }

  private getPerfis() {
    this.subscription = this.perfisService.getAll().subscribe({
      next: perfis => {
        this.perfis = perfis;
      },
      error: err => {
        const urlFragments = ['auth'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  goToEdit(perfil: PerfilClass) {
    //console.log(usuario);
    this.router.navigate(['perfis', perfil.id]);
  }

  goToUsuarios(perfil: PerfilClass) {
    this.router.navigate(['perfis', perfil.id, 'usuarios']);
  }

  goToNew() {
    this.router.navigate(['perfis', 0]);
  }

  onDelete(perfilId: number) {
    if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
      const urlFragments = ['usuarios'];
      this.subscription = this.perfisService.delete(perfilId).subscribe({
        next: () => {
          //console.log('Usuario excluído:', updatedUsuario);
          this.alertService.sendAlert(urlFragments, '<strong>Perfil excluído com sucesso</strong>', 'success');
          this.getPerfis();
        },
        error: err => {
          //console.error('Erro ao atualizar usuario:', err);
          this.alertService.sendAlert(urlFragments, "<strong>Erro ao excluir perfil</strong><br>" + err, 'error');
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
