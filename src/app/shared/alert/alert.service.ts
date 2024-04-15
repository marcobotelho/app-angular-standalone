import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private router: Router) { }

  sendAlert(urlFragments: unknown[], msg: string, type: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        alertMessage: msg,
        alertType: type // 'success' ou 'error', conforme necessário
      }
    };
    this.router.navigate(urlFragments, navigationExtras);
  }
}
