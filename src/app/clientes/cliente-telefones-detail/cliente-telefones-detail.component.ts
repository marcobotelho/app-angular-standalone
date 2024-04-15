import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { ClienteClass } from '../utils/classes/cliente-class';
import { TelefoneClass } from '../utils/classes/telefone-class';
import { TipoTelefoneEnum } from '../utils/enums/tipo-telefone.enum';
import { ClientesService } from '../utils/services/clientes.service';
import { TelefonesService } from '../utils/services/telefones.service';

@Component({
  selector: 'app-cliente-telefones-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective, AlertComponent],
  templateUrl: './cliente-telefones-detail.component.html',
  styleUrl: './cliente-telefones-detail.component.scss',
  providers: [provideNgxMask()]
})
export class ClienteTelefonesDetailComponent {

  clienteId: number = 0;
  telefoneId: number = 0;
  telefone: TelefoneClass = new TelefoneClass();
  cliente: ClienteClass = new ClienteClass();
  telefoneTipos: any = this.telefonesService.enumSelector(TipoTelefoneEnum);

  alertMessage: string = '';
  alertType: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private router: Router,
    private telefonesService: TelefonesService, private clientesService: ClientesService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.route.paramMap.subscribe(params => {
      this.clienteId = Number(params.get('clienteId'));
      this.telefoneId = Number(params.get('telefoneId'));
    })

    this.getClienteById(this.clienteId);

    if (this.telefoneId == 0) {
      this.telefone = new TelefoneClass();
      this.telefone.clienteId = this.clienteId;
    } else {
      this.getTelefoneById(this.telefoneId);
    }
  }

  private getClienteById(id: number) {
    this.subscription = this.clientesService.getById(id).subscribe({
      next: cliente => {
        this.cliente = cliente;
      },
      error: err => {
        const urlFragments = ['clientes', this.clienteId, 'telefones', this.telefoneId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  private getTelefoneById(id: number) {
    this.subscription = this.telefonesService.getById(id).subscribe({
      next: telefone => {
        this.telefone = telefone;
      },
      error: err => {
        const urlFragments = ['clientes', this.clienteId, 'telefones', this.telefoneId];
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
    if (this.telefone.id == 0) {
      this.saveTelefone();
    } else {
      this.updateTelefone();
    }
  }

  goToCliente() {
    this.router.navigate(['clientes', this.clienteId, 'telefones']);
  }

  private saveTelefone() {
    this.subscription = this.telefonesService.save(this.telefone).subscribe({
      next: () => {
        //console.log('Telefone incluido:', savedCliente);
        const urlFragments = ['clientes', this.clienteId, 'telefones'];
        this.alertService.sendAlert(urlFragments, '<strong>Telefone incluido com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao incluir telefone:', err);
        const urlFragments = ['clientes', this.clienteId, 'telefones', this.telefone.id];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao incluir telefone</strong><br>" + err, 'error');
      }
    });
  }

  private updateTelefone() {
    this.subscription = this.telefonesService.update(this.telefone).subscribe({
      next: () => {
        //console.log('Telefone atualizado:', updatedCliente);
        const urlFragments = ['clientes', this.clienteId, 'telefones'];
        this.alertService.sendAlert(urlFragments, '<strong>Telefone atualizado com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao atualizar telefone:', err);
        const urlFragments = ['clientes', this.clienteId, 'telefones', this.telefoneId];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao atualizar telefone</strong><br>" + err, 'error');
      }
    });
  }
}
