import { LitElement, html } from "lit";
import { customElement, query } from "lit/decorators.js";
import popoverCss from "./popover.css";

@customElement("bdo-popover")
export class BdoPopover extends LitElement {
    
    @query(".popover-control--target")
    _popoverElement!: HTMLElement;

    override render() {
        return html`
             <button popovertarget="my-popover" class="popover-control popover-control--info" .onclick=${this._onClick.bind(this)}>
                <abbr title="info" >i</abbr>
            </button>
            <div id="my-popover" popover class="popover-control popover-control--target">
                <slot></slot>
            </div>
        `;
    }

    private _onClick(event:Event): void {
        event.stopPropagation();
        const button = event.target as HTMLButtonElement;


        if (button.getAttribute("aria-expanded") === "true") {
            button.setAttribute("aria-expanded", "false");
            (this._popoverElement as any).hidePopover();
            this._popoverElement.style.display = "none";
        } 
        else {
            button.setAttribute("aria-expanded", "true");
            (this._popoverElement as any).showPopover();
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
