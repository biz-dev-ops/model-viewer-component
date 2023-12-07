import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import buttonCss from './button.css';

@customElement('bdo-button')
export class BdoButton extends LitElement {
    @property({ type: String })
    type: 'button' | 'submit' | 'reset' | 'menu' = 'button';

    @property({ type: String })
    direction!: 'up' | 'right' | 'down' | 'left';
        
    @property({ type: Boolean })
    disabled = false;

    override render() {
        return html`
            <button type="${this.type}" .disabled='${this.disabled}' @click="${this._onClick}">
                <span class="content">
                    <slot></slot>
                </span>
            </button>
        `;
    }

    private _onClick() {
        this.dispatchEvent(new CustomEvent('clicked'));
    }

    static override get styles() {
        return buttonCss;
    }
}