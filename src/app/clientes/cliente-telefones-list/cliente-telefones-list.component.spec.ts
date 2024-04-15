import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTelefonesListComponent } from './cliente-telefones-list.component';

describe('ClienteTelefonesListComponent', () => {
  let component: ClienteTelefonesListComponent;
  let fixture: ComponentFixture<ClienteTelefonesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteTelefonesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteTelefonesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
