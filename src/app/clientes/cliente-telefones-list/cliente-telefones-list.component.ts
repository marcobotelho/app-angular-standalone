import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { ClienteClass } from '../utils/classes/cliente-class';
import { TelefoneClass } from '../utils/classes/telefone-class';
import { ClientesService } from '../utils/services/clientes.service';
import { TelefonesService } from '../utils/services/telefones.service';

@Component({
  selector: 'app-cliente-telefones-list',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe, AlertComponent],
  templateUrl: './cliente-telefones-list.component.html',
  styleUrl: './cliente-telefones-list.component.scss',
  providers: [provideNgxMask()]
})
export class ClienteTelefonesListComponent {
  clienteId: number = 0;
  cliente: ClienteClass = new ClienteClass();
  telefones: TelefoneClass[] = [];

  alertMessage: string = '';
  alertType: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute,
    private telefonesService: TelefonesService, private clientesService: ClientesService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
      //console.log("this.alertMessage: " + this.alertMessage);
      //console.log("this.alertType: " + this.alertType);
    });

    this.route.paramMap.subscribe(params => {
      this.clienteId = Number(params.get('clienteId'));
      //console.log("clienteId: " + this.clienteId);
    });

    this.getClienteById(this.clienteId);

    this.getTelefones();
    //console.log(this.telefones);
  }

  goToEdit(telefone: TelefoneClass) {
    this.router.navigate(['clientes', this.clienteId, 'telefones', telefone.id]);
  }

  goToNew() {
    this.router.navigate(['clientes', this.clienteId, 'telefones', 0]);
  }

  goToClientes() {
    this.router.navigate(['clientes']);
  }

  onDelete(telefoneId: number) {
    if (window.confirm('Tem certeza que deseja excluir este telefone?')) {
      this.subscription = this.telefonesService.delete(telefoneId).subscribe({
        next: () => {
          //console.log('Telefone excluído:', savedCliente);
          const urlFragments = ['clientes', this.clienteId, 'telefones'];
          this.alertService.sendAlert(urlFragments, '<strong>Telefone excluído com sucesso</strong>', 'success');
          this.getTelefones();
        },
        error: err => {
          //console.error('Erro ao excluir telefone:', err);
          const urlFragments = ['clientes', this.clienteId, 'telefones'];
          this.alertService.sendAlert(urlFragments, "<strong>Erro ao excluir telefone</strong><br>" + err, 'error');
        }
      });
    }
  }

  private getClienteById(id: number) {
    this.subscription = this.clientesService.getById(id).subscribe({
      next: cliente => {
        this.cliente = cliente;
      },
      error: err => {
        const urlFragments = ['auth'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  private getTelefones() {
    this.subscription = this.telefonesService.getAll(this.clienteId).subscribe({
      next: telefones => {
        this.telefones = telefones;
      },
      error: err => {
        const urlFragments = ['auth'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
