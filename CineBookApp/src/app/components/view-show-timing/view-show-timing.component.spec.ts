import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShowTimingComponent } from './view-show-timing.component';

describe('ViewShowTimingComponent', () => {
  let component: ViewShowTimingComponent;
  let fixture: ComponentFixture<ViewShowTimingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShowTimingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewShowTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
