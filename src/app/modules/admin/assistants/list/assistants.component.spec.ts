import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantsComponent } from './assistants.component';

describe('AssistantsComponent', () => {
  let component: AssistantsComponent;
  let fixture: ComponentFixture<AssistantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistantsComponent]
    });
    fixture = TestBed.createComponent(AssistantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
