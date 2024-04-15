import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfisDetailComponent } from './perfis-detail.component';

describe('UsuarioPerfisDetailComponent', () => {
  let component: PerfisDetailComponent;
  let fixture: ComponentFixture<PerfisDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfisDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PerfisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
