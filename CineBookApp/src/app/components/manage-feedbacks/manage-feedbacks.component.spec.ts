import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFeedbacksComponent } from './manage-feedbacks.component';

describe('ManageFeedbacksComponent', () => {
  let component: ManageFeedbacksComponent;
  let fixture: ComponentFixture<ManageFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFeedbacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
