import { Component, Input, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-skills-chart',
  standalone: true,
  templateUrl: './skills-chart.component.html',
  styleUrls: ['./skills-chart.component.scss']
})
export class SkillsChartComponent implements AfterViewInit, OnChanges {
  @Input() skills: {name: string, level: number}[] = [];
  private svg: any;
  private margin = {top: 20, right: 30, bottom: 40, left: 40};
  private width = 600;
  private height = 400;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skills'] && !changes['skills'].firstChange) {
      this.updateChart();
    }
  }

  private createChart() {
    const element = this.el.nativeElement.querySelector('.chart-container');
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    
    this.svg = d3.select(element)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.drawChart();
  }

  private drawChart() {
    // Clear existing chart
    this.svg.selectAll('*').remove();

    // Create scales
    const x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1)
      .domain(this.skills.map(d => d.name));

    const y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 100]);

    // Add axes
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x));

    this.svg.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));

    // Create bars
    this.svg.selectAll('.bar')
      .data(this.skills)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => x(d.name))
      .attr('y', (d: any) => y(d.level))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.level))
      .attr('fill', (d: any) => this.getColor(d.name))
      .on('mouseover', (event: any, d: any) => this.handleMouseOver(event, d))
      .on('mouseout', () => this.handleMouseOut());

    // Add value labels
    this.svg.selectAll('.bar-label')
      .data(this.skills)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d: any) => (x(d.name) ?? 0) + x.bandwidth() / 2)
      .attr('y', (d: any) => y(d.level) - 5)
      .attr('text-anchor', 'middle')
      .text((d: any) => `${d.level}%`);
  }

  private updateChart() {
    this.drawChart();
  }

  private handleMouseOver(event: any, data: any) {
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add tooltip
    const tooltip = this.svg.append('g')
      .attr('class', 'tooltip')
      .attr('transform', `translate(${event.layerX},${event.layerY - 40})`);

    tooltip.append('rect')
      .attr('width', 120)
      .attr('height', 40)
      .attr('fill', '#fff')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('filter', 'url(#drop-shadow)');

    tooltip.append('text')
      .attr('x', 60)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#333')
      .text(`${data.name}: ${data.level}%`);
  }

  private handleMouseOut() {
    d3.selectAll('.bar')
      .transition()
      .duration(200)
      .attr('opacity', 1)
      .attr('stroke', 'none');

    this.svg.selectAll('.tooltip').remove();
  }

  getColor(skillName: string): string {
    const colors = [
      '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', 
      '#59a14f', '#edc948', '#b07aa1', '#ff9da7'
    ];
    const index = this.skills.findIndex(s => s.name === skillName);
    return colors[index % colors.length];
  }
}