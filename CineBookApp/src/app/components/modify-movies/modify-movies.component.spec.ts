import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMoviesComponent } from './modify-movies.component';

describe('ModifyMoviesComponent', () => {
  let component: ModifyMoviesComponent;
  let fixture: ComponentFixture<ModifyMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
