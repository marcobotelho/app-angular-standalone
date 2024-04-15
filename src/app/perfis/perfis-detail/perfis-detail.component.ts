import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PerfilClass } from '../../perfis/classes/perfil-class';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { PerfisService } from '../services/perfis.service';

@Component({
  selector: 'app-perfis-detail',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './perfis-detail.component.html',
  styleUrl: './perfis-detail.component.scss'
})
export class PerfisDetailComponent implements OnInit {

  perfilId: number = 0;
  perfil: PerfilClass = new PerfilClass();

  alertMessage: string = '';
  alertType: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private router: Router,
    private perfisService: PerfisService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.route.paramMap.subscribe(params => {
      this.perfilId = Number(params.get('perfilId'));
    })

    if (this.perfilId == 0) {
      this.perfil = new PerfilClass();
    } else {
      this.getPerfilById(this.perfilId);
    }
  }

  private getPerfilById(id: number) {
    this.subscription = this.perfisService.getById(id).subscribe({
      next: perfil => {
        this.perfil = perfil;
      },
      error: err => {
        const urlFragments = ['perfis', this.perfilId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  onSubmit() {
    if (this.perfil.id == 0) {
      this.savePerfil();
    } else {
      this.updatePerfil();
    }
  }

  goToPerfis() {
    this.router.navigate(['perfis']);
  }

  private savePerfil() {
    this.subscription = this.perfisService.save(this.perfil).subscribe({
      next: () => {
        //console.log('Telefone incluido:', savedCliente);
        const urlFragments = ['perfis'];
        this.alertService.sendAlert(urlFragments, '<strong>Perfil incluido com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao incluir telefone:', err);
        const urlFragments = ['perfis', this.perfilId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao incluir perfil</strong><br>" + err, 'error');
      }
    });
  }

  private updatePerfil() {
    this.subscription = this.perfisService.update(this.perfil).subscribe({
      next: () => {
        //console.log('Telefone atualizado:', updatedCliente);
        const urlFragments = ['perfis'];
        this.alertService.sendAlert(urlFragments, '<strong>Perfil atualizado com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao atualizar telefone:', err);
        const urlFragments = ['perfis', this.perfilId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao atualizar perfil</strong><br>" + err, 'error');
      }
    });
  }


  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}
