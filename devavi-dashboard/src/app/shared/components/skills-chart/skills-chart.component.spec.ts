import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsChartComponent } from './skills-chart.component';

describe('SkillsChartComponent', () => {
  let component: SkillsChartComponent;
  let fixture: ComponentFixture<SkillsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
