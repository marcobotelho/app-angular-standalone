import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { ClienteClass } from '../utils/classes/cliente-class';
import { ClientesService } from '../utils/services/clientes.service';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss'
})
export class ClientesListComponent {
  clientes: ClienteClass[] = [];
  alertMessage: string = '';
  alertType: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private clientesService: ClientesService, private alertService: AlertService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.getClientes();
  }

  private getClientes() {
    this.subscription = this.clientesService.getAll().subscribe({
      next: clientes => {
        this.clientes = clientes;
      },
      error: err => {
        const urlFragments = ['auth'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  goToEdit(cliente: ClienteClass) {
    //console.log(cliente);
    this.router.navigate(['clientes', cliente.id]);
  }

  goToTelefones(cliente: ClienteClass) {
    this.router.navigate(['clientes', cliente.id, 'telefones']);
  }

  goToNew() {
    this.router.navigate(['clientes', 0]);
  }

  onDelete(clienteId: number) {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const urlFragments = ['clientes'];
      this.subscription = this.clientesService.delete(clienteId).subscribe({
        next: () => {
          //console.log('Cliente excluído:', updatedCliente);
          this.alertService.sendAlert(urlFragments, '<strong>Cliente excluído com sucesso</strong>', 'success');
          this.getClientes();
        },
        error: err => {
          //console.error('Erro ao atualizar cliente:', err);
          this.alertService.sendAlert(urlFragments, "<strong>Erro ao excluir cliente</strong><br>" + err, 'error');
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
