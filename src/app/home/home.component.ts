import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { AlertService } from '../shared/alert/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  alertMessage: string = '';
  alertType: string = '';

  constructor(private route: ActivatedRoute, private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.alertMessage = params['alertMessage'];
      this.alertType = params['alertType'];
    });
  }
}
