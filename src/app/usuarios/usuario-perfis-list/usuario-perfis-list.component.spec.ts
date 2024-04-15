import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioPerfisListComponent } from './usuario-perfis-list.component';

describe('UsuarioPerfisListComponent', () => {
  let component: UsuarioPerfisListComponent;
  let fixture: ComponentFixture<UsuarioPerfisListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioPerfisListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuarioPerfisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
