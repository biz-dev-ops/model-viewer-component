import { LitElement, html } from 'lit-element';
import { customElement, property } from 'lit/decorators.js';
import popoverCss from './popover.css';

@customElement('bdo-popover')
export class BdoPopover extends LitElement {
    @property({ type: String }) override id!: string;

    override render() {
        return html`<slot></slot>`;
    }

    constructor() {
        super();
        this.addEventListener('toggle', this.toggle);
      }

    toggle(event: Event) {
        console.log('toggle', event);
    }

    // position = (control: HTMLElement, target: HTMLElement) => {
    //     const buttonPosition = control.getBoundingClientRect();
    //     const parent = control.closest('.button--object, .item');
    //     const parentPosition = parent?.getBoundingClientRect();
    //     const scrollTop =  document.documentElement.scrollTop || document.body.scrollTop;
    
    //     if (parentPosition) {
    //         target.style.left = `${parentPosition.left}px`;
    //         target.style.top = `${buttonPosition.bottom + scrollTop}px`;
    //         target.style.width = `${parentPosition.width}px`;
    //     }
    // }
    
    // const popoverShow = (event: any) => {
    //     const control = event.target;
    //     const targetId = control?.attributes.popovertarget.value;
    //     const target = this.renderRoot.querySelector(`#${targetId}`);
    
    //     if (target) {
    //         this.positionPopover(control, target as HTMLElement);
    //         try {
    //         (target as any).showPopover();
    //         }
    //         catch {}
    //     }
    // }
    
    // const popoverHide = (event: any) => {
    //     const targetId = event.target.attributes.popovertarget.value;
    //     const target = this.renderRoot.querySelector(`#${targetId}`);
    
    //     if (target) {
    //         try {
    //         (target as any).hidePopover();
    //         }
    //         catch {}
    //     }
    // }
    
    static override get styles() {
        return popoverCss;
    }
}
