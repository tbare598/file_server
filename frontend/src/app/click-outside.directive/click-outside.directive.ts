import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({ selector: '[appClickOutside]' })

export class ClickOutsideDirective {

    @Output()
    public clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        if (!targetElement) {
            return;
        }

        const clickedInside = this.el.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(null);
        }
    }

    constructor(private el: ElementRef) {
    }
}
