import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTelefonesDetailComponent } from './cliente-telefones-detail.component';

describe('ClienteTelefonesDetailComponent', () => {
  let component: ClienteTelefonesDetailComponent;
  let fixture: ComponentFixture<ClienteTelefonesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteTelefonesDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteTelefonesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
