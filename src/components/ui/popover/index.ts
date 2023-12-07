import { LitElement, html } from "lit";
import { customElement, query } from "lit/decorators.js";
import popoverCss from "./popover.css";

@customElement("bdo-popover")
export class BdoPopover extends LitElement {
    
    @query("[popover]")
    _popoverElement!: HTMLElement;

    override render() {
        return html`
             <button popovertarget="popover-target" class="popover-control popover-control--info" @click=${this._onClick.bind(this)}>
                <abbr title="info" >i</abbr>
            </button>
            <div id="popover-target" popover>
                <slot></slot>
            </div>
        `;
    }

    private _onClick(event:Event): void {
        event.stopPropagation();
        const button = event.target as HTMLButtonElement;
        (this._popoverElement as any).togglePopover();

        if (button.getAttribute("aria-expanded") === "true") {
            button.setAttribute("aria-expanded", "false");
            this._popoverElement.style.display = "none";
        } 
        else {
            button.setAttribute("aria-expanded", "true");
            this._popoverElement.style.display = "block";
            this._popoverElement.style.position = "fixed";
            this._popoverElement.style.zIndex = "999";
            _position(button, this._popoverElement);
        }
    };
    
    static override get styles() {
        return popoverCss;
    }
}

const _position = (button: HTMLElement, popover:HTMLElement) => {
    const buttonPosition = button.getBoundingClientRect();
    const parent = button.closest(".button--object, .item");
    const parentPosition = parent?.getBoundingClientRect();
    const scrollTop =  document.documentElement.scrollTop || document.body.scrollTop;

    if (parentPosition) {
        popover.style.left = `${parentPosition.left}px`;
        popover.style.top = `${buttonPosition.bottom + scrollTop}px`;
        popover.style.width = `${parentPosition.width}px`;
    }
}
