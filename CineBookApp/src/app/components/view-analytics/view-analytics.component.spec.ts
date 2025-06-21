import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnalyticsComponent } from './view-analytics.component';

describe('ViewAnalyticsComponent', () => {
  let component: ViewAnalyticsComponent;
  let fixture: ComponentFixture<ViewAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
