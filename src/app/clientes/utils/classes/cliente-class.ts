import { MunicipioClass } from "./municipio-class";

export class ClienteClass {
    id: number = 0;
    nome: string = '';
    email: string = '';
    idade: number = 0;
    dataNascimento: string = '';
    cep: string = '';
    endereco: string = '';
    bairro: string = '';
    municipio: MunicipioClass = new MunicipioClass();
    // municipio: string = '';
    // estado: string = '';
}
