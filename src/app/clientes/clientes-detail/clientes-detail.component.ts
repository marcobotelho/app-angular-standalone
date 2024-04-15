import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Subscription, lastValueFrom } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../shared/alert/alert.service';
import { ViaCepService } from '../../shared/via-cep/via-cep.service';
import { ClienteClass } from '../utils/classes/cliente-class';
import { EstadoClass } from '../utils/classes/estado-class';
import { MunicipioClass } from '../utils/classes/municipio-class';
import { ClientesService } from '../utils/services/clientes.service';
import { EstadosService } from '../utils/services/estados.service';

@Component({
  selector: 'app-clientes-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective, AlertComponent],
  templateUrl: './clientes-detail.component.html',
  styleUrl: './clientes-detail.component.scss',
  providers: [provideNgxMask()]
})
export class ClientesDetailComponent implements OnInit {

  clienteId: number = 0;
  cliente: ClienteClass = new ClienteClass();
  estados: EstadoClass[] = [];
  municipios: MunicipioClass[] = [];
  alertMessage: string = '';
  alertType: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private router: Router,
    private clienteService: ClientesService, private alertService: AlertService, private estadosService: EstadosService,
    private viaCepService: ViaCepService) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });

    this.route.paramMap.subscribe(params => {
      this.clienteId = Number(params.get('clienteId'));
    })

    this.getEstados();

    if (this.clienteId === 0) {
      this.cliente = new ClienteClass();
    } else {
      this.getClienteById(this.clienteId);
    }

  }

  private getClienteById(id: number) {
    this.subscription = this.clienteService.getById(id).subscribe({
      next: cliente => {
        this.cliente = cliente;
        this.getMunicipios(cliente.municipio.estado.id);
      },
      error: err => {
        const urlFragments = ['clientes'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  private getEstados() {
    this.subscription = this.estadosService.getAll().subscribe({
      next: estados => {
        this.estados = estados;
      },
      error: err => {
        const urlFragments = ['clientes'];
        this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
      }
    });
  }

  onChangeEstados(event: Event) {
    const estadoId = (event.target as HTMLSelectElement).value;
    if (estadoId) {
      this.getMunicipios(Number(estadoId));
    } else {
      this.municipios = [];
    }
  }

  private getMunicipios(estadoId: number) {
    if (estadoId) {
      //console.log('ID do estado:', estadoId);
      this.subscription = this.estadosService.getMunicipiosByEstadoId(estadoId).subscribe({
        next: municipios => {
          this.municipios = municipios;
        },
        error: err => {
          const urlFragments = ['clientes'];
          this.alertService.sendAlert(urlFragments, "<strong>Erro</strong><br>" + err, 'error');
        }
      });
    } else {
      this.municipios = [];
    }
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    const selectedMunicipio = this.municipios.find(m => m.id == this.cliente.municipio.id);
    if (selectedMunicipio) {
      console.log('Municipio selecionado:', selectedMunicipio);
      this.cliente.municipio = selectedMunicipio;
      console.log('Cliente:', this.cliente);
    }
    if (this.cliente.id == 0) {
      this.saveCliente();
    } else {
      this.updateCliente();
    }
  }

  private saveCliente() {
    this.subscription = this.clienteService.save(this.cliente).subscribe({
      next: () => {
        //console.log('Cliente incluido:', this.cliente);
        const urlFragments = ['clientes'];
        this.alertService.sendAlert(urlFragments, '<strong>Cliente incluido com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao incluir cliente:', err);
        const urlFragments = ['clientes', this.cliente.id];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao incluir cliente</strong><br>" + err, 'error');
      }
    });
  }

  private updateCliente() {
    this.subscription = this.clienteService.update(this.cliente).subscribe({
      next: () => {
        //console.log('Cliente atualizado:', updatedCliente);
        const urlFragments = ['clientes'];
        this.alertService.sendAlert(urlFragments, '<strong>Cliente atualizado com sucesso</strong>', 'success');
      },
      error: err => {
        //console.error('Erro ao atualizar cliente:', err);
        const urlFragments = ['clientes', this.cliente.id];
        this.alertService.sendAlert(urlFragments, "<strong>Erro ao atualizar cliente</strong><br>" + err, 'error');
      }
    });
  }

  onCancel() {
    this.router.navigate(['clientes']);
  }

  onCepBlur() {
    this.alertMessage = 'Buscando CEP...';
    this.alertType = 'success';
    if (this.cliente.cep) {
      this.subscription = this.viaCepService.buscarCep(this.cliente.cep).subscribe({
        next: (result) => {
          console.log('Endereços:', result);
          if (!result.erro) {
            this.cliente.endereco = result.logradouro;
            this.cliente.bairro = result.bairro;
            this.getMunicipioByEstadoSiglaMunicipioNome(result.uf, result.localidade);
          }
        },
        error: err => {
          const urlFragments = ['clientes', this.cliente.id];
          this.alertService.sendAlert(urlFragments, "<strong>Erro ao buscar CEP</strong><br>Cep inválido ou inexistente", 'error');
          this.cliente.endereco = "";
          this.cliente.bairro = "";
          this.municipios = [];
          this.cliente.municipio = new MunicipioClass();
        }
      });
    }
    this.alertMessage = '';
    this.alertType = '';
  }

  private async getMunicipioByEstadoSiglaMunicipioNome(estadoSigla: string, municipioNome: string) {
    const municipios = await lastValueFrom(this.estadosService.getMunicipiosByEstadoSigla(estadoSigla));
    const municipio = await lastValueFrom(this.estadosService.getMunicipioByEstadoSiglaMunicipioNome(estadoSigla, municipioNome));
    if (municipios && municipio) {
      this.municipios = municipios;
      this.cliente.municipio = municipio;
    } else {
      this.municipios = [];
      this.cliente.municipio = new MunicipioClass();
    }
  }
}
