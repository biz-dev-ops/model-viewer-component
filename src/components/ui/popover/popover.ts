import { LitElement, html } from 'lit-element';
import { customElement } from 'lit/decorators.js';
import popoverCss from './popover.css';

@customElement('bdo-popover')
export class BdoPopover extends LitElement {
    override render() {
        return html`<slot></slot>`;
    }

    static override get styles() {
        return popoverCss;
    }
}