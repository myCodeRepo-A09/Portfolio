import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTypewriter]',
  standalone: true
})
export class TypewriterDirective implements OnInit, OnDestroy {
  @Input() text = '';
  @Input() speed = 30; // ms per character
  @Input() delay = 1000; // ms before starting
  @Input() cursor = true;
  
  private currentText = '';
  private typingInterval: any;
  private cursorInterval: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'typing');
    setTimeout(() => {
      this.typewrite();
    }, this.delay);
  }

  private typewrite() {
    let i = 0;
    this.typingInterval = setInterval(() => {
      if (i < this.text.length) {
        this.currentText += this.text.charAt(i);
        this.el.nativeElement.textContent = this.currentText;
        i++;
      } else {
        clearInterval(this.typingInterval);
        this.renderer.removeClass(this.el.nativeElement, 'typing');
      }
    }, this.speed);
  }

  ngOnDestroy() {
    clearInterval(this.typingInterval);
    clearInterval(this.cursorInterval);
  }
}