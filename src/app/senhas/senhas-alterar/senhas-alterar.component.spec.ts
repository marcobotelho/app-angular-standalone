import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenhasAlterarComponent } from './senhas-alterar.component';

describe('SenhasAlterarComponent', () => {
  let component: SenhasAlterarComponent;
  let fixture: ComponentFixture<SenhasAlterarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenhasAlterarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SenhasAlterarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
