import { trigger, stagger, animate, style, group, query, transition } from '@angular/animations';

export const cardAnimation = trigger('cardAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(30px)' }),
      stagger(100, [
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
        style({ opacity: 1, transform: 'none' }))
      ])
    ], { optional: true })
  ])
]);