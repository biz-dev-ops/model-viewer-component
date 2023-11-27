import { LitElement, html } from 'lit-element';
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
            <button type="${this.type}" .disabled='${this.disabled}' @click="${this.emitClick}">
                <span class="content"><slot></slot></span>
            </button>
        `;
    }

    private emitClick() {
        this.dispatchEvent(new CustomEvent('clicked'));
    }

    static override get styles() {
        return buttonCss;
    }
}