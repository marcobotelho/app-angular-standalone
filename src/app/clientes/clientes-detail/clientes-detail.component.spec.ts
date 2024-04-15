import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesDetailComponent } from './clientes-detail.component';

describe('ClientesDetailComponent', () => {
  let component: ClientesDetailComponent;
  let fixture: ComponentFixture<ClientesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
