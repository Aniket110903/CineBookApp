import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTheatersComponent } from './manage-theaters.component';

describe('ManageTheatersComponent', () => {
  let component: ManageTheatersComponent;
  let fixture: ComponentFixture<ManageTheatersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTheatersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTheatersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
