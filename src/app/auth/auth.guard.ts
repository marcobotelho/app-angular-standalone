import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AlertService } from '../shared/alert/alert.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private alertService: AlertService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        const expectedRoles = next.data['expectedRoles']; // Usando ['expectedRoles'] para acessar as roles esperadas
        const currentUserRoles = this.authService.getRoles(); // Obtém os papéis do usuário atual

        // Verifica se o usuário tem permissão para acessar a rota
        if (!currentUserRoles.some(role => expectedRoles.includes(role))) {
            // Redireciona o usuário para uma página de acesso negado
            this.alertService.sendAlert(['auth'], '<strong>Acesso negado</strong>', 'error');
            return false;
        }
        return true;
    }

}

