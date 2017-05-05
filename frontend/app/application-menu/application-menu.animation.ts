import { trigger, state, style, animate, transition } from '@angular/core';

export const applicationMenuAnimations = [
  trigger('menuHoverState', [
    state('off', style({
      width: '50px',
      'border-top-right-radius': '0px',
      'border-bottom-right-radius': '0px'
    })),
    state('hovering',   style({
      width: '175px',
      'border-top-right-radius': '5px',
      'border-bottom-right-radius': '5px'
    })),
    transition('off => hovering', animate('200ms ease-out')),
    transition('hovering => off', animate('200ms ease-in'))
  ]),
  trigger('flyoutMenuOpenState', [
    state('off',   style({
      width: '0px'
    })),
    state('on', style({
      width: '155px'
    })),
    transition('on => off', animate('200ms ease-in')),
    transition('off => on', animate('200ms ease-out'))
  ])
];
