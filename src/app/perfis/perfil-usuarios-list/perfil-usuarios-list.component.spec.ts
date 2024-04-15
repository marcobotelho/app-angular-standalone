import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilUsuariosListComponent } from './perfil-usuarios-list.component';

describe('PerfilUsuariosListComponent', () => {
  let component: PerfilUsuariosListComponent;
  let fixture: ComponentFixture<PerfilUsuariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilUsuariosListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilUsuariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
