import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatusDePagoReservacionComponent } from './estatus-de-pago-reservacion.component';

describe('EstatusDePagoReservacionComponent', () => {
  let component: EstatusDePagoReservacionComponent;
  let fixture: ComponentFixture<EstatusDePagoReservacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstatusDePagoReservacionComponent]
    });
    fixture = TestBed.createComponent(EstatusDePagoReservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
