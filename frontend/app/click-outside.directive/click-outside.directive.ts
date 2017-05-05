import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({ selector: '[clickOutside]' })

export class ClickOutsideDirective {
    constructor(private el: ElementRef) {
    }
    
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
}
