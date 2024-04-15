import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenhasResetComponent } from './senhas-reset.component';

describe('SenhasResetComponent', () => {
  let component: SenhasResetComponent;
  let fixture: ComponentFixture<SenhasResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenhasResetComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SenhasResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
