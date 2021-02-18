import { AfterContentInit, Directive, ElementRef } from "@angular/core";
import { createPopper } from '@popperjs/core';

@Directive({
    selector: '[dropdown]',
    exportAs: 'dropdown'
})
export class DropdownDirective implements AfterContentInit {
    ele: HTMLElement;
    constructor(eleRef: ElementRef) {
        this.ele = eleRef.nativeElement;
    }
    ngAfterContentInit() {
        const children = Array.from(this.ele.children as HTMLCollectionOf<HTMLElement>);
        const knob = children.find((child: HTMLElement) => child.classList.contains('dropdown-knob'));
        const content = children.find((child: HTMLElement) => child.classList.contains('dropdown-content'));
        const documentClick = (event) => {
            const elements = [knob, content];
            if (!elements.includes(event.target as HTMLElement) && !elements.some((e) => e.contains(event.target))) {
                this.ele.classList.remove('show');
                this.ele.appendChild(content);
                document.removeEventListener('click', documentClick);
            }
        }
        knob.addEventListener('click', () => {
            if (this.ele.classList.contains('show')) {
                this.ele.classList.remove('show');
                this.ele.appendChild(content);
            } else {
                this.ele.classList.add('show');
                if(this.ele.getAttribute('container') && this.ele.getAttribute('container') === 'body'){
                    const body = document.getElementsByTagName("BODY")[0];
                    body.appendChild(content);
                }
                createPopper(knob, content, { placement: 'bottom-start' });
                document.addEventListener('click', documentClick);
            }
        });
    }
}