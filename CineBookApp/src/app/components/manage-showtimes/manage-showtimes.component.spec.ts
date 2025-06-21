import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShowtimesComponent } from './manage-showtimes.component';

describe('ManageShowtimesComponent', () => {
  let component: ManageShowtimesComponent;
  let fixture: ComponentFixture<ManageShowtimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageShowtimesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageShowtimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
