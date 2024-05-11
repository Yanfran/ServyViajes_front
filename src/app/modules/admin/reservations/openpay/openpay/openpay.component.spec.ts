import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenpayComponent } from './openpay.component';

describe('OpenpayComponent', () => {
  let component: OpenpayComponent;
  let fixture: ComponentFixture<OpenpayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenpayComponent]
    });
    fixture = TestBed.createComponent(OpenpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
