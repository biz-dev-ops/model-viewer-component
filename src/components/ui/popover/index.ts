import { LitElement, html } from 'lit';
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';
import popoverCss from './popover.css';

@customElement('bdo-popover')
export class BdoPopover extends LitElement {
    @property({ type: String }) override id!: string;
    @property({ type: String }) uid: string = Math.floor(Math.random() * Date.now()).toString(16);

    @queryAssignedElements({slot: 'toggle', selector: 'button', flatten: true})
    _toggleElements!: Array<HTMLElement>;

    @query('[popover]')
    _popoverElement!: HTMLElement;

    @state()
    _toggleButton!: HTMLElement;

    supportsPopover(): boolean {
        return HTMLElement.prototype.hasOwnProperty("popover");
    }

    override firstUpdated(): void {
        if (this.supportsPopover()) {
            (this._popoverElement as any).popover = "auto";
            this._toggleElements.forEach((element) => {
                (element as any).popoverTarget = this._popoverElement.id;
                (element as any).popoverTargetAction = "toggle";
                element.setAttribute('aria-haspopup', 'true');
                element.setAttribute('aria-expanded', 'false');
            });
        }

        this._toggleElements.forEach((element) => {
            element.addEventListener('click', (event) => {
                event.stopPropagation();

                this._toggleButton = element;
                if (element.getAttribute('aria-expanded') === 'true') {
                    element.setAttribute('aria-expanded', 'false');

                    if (this.supportsPopover()) {
                        (this._popoverElement as any).hidePopover();
                    } else {
                        this._popoverElement.style.display = 'none';
                    }
                } else {
                    element.setAttribute('aria-expanded', 'true');

                    if (this.supportsPopover()) {
                        (this._popoverElement as any).showPopover();
                    } else {
                        this._popoverElement.style.display = 'block';
                        this._popoverElement.style.position = 'fixed';
                        this._popoverElement.style.zIndex = '999';
                    }
                    this.position();
                }
            });
        });
    }

    override render() {
        return html`
            <slot name="toggle"></slot>
            <div popover id="${this.id || this.uid}">
                <slot></slot>
            </div>
        `;
    }

    position = () => {
        const buttonPosition = this._toggleButton.getBoundingClientRect();
        const parent = this._toggleButton.closest('.button--object, .item');
        const parentPosition = parent?.getBoundingClientRect();
        const scrollTop =  document.documentElement.scrollTop || document.body.scrollTop;
    
        if (parentPosition) {
            this._popoverElement.style.left = `${parentPosition.left}px`;
            this._popoverElement.style.top = `${buttonPosition.bottom + scrollTop}px`;
            this._popoverElement.style.width = `${parentPosition.width}px`;
        }
    }
    
    static override get styles() {
        return popoverCss;
    }
}
