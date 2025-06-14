import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnWithMeComponent } from './learn-with-me.component';

describe('LearnWithMeComponent', () => {
  let component: LearnWithMeComponent;
  let fixture: ComponentFixture<LearnWithMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnWithMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
