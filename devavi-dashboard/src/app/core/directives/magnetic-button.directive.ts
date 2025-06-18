// magnetic-button.directive.ts
import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[magneticButton]',
  standalone: true
})
export class MagneticButton implements OnInit {
  private boundingBox!: DOMRect;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.boundingBox = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const x = e.clientX - this.boundingBox.left - this.boundingBox.width/2;
    const y = e.clientY - this.boundingBox.top - this.boundingBox.height/2;
    
    gsap.to(this.el.nativeElement, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    gsap.to(this.el.nativeElement, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });
  }
}