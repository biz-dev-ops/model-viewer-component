import { customElement, property } from "lit/decorators.js";
import { LitElement, html } from "lit";
import modelViewerCss from "../../../model-viewer.css";
import { ModelItem } from "../../../model-viewer.types";

@customElement('model-viewer-item-object')
export class ModelViewerItemObject extends LitElement {
    @property({ type: Object }) item!: ModelItem;
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;
    @property({ type: Boolean }) required!: boolean;
    @property({ type: Boolean }) root!: boolean;

    override render() {
        return this.root ? 
        html`
            <div class="item item--object">
                <h2>
                    <span class="txt--property">
                    ${this.title || this.property}
                    ${this.required ? html`<span class="txt--required">*</span>`: ``}
                    </span>
                </h2>
                
                ${
                    this.item.description ?
                    html`<p>${this.item.description}</p>` : null
                }
                
                <div class="items" slot="items">
                    <slot></slot>
                </div>
            </div>
        ` :
        html`
            <div class="item item--object">
                <bdo-button type="button" direction="right" @clicked="${() => { this.handleItemSelection(this.property, this.item); }}">
                    <span class="txt--property">${this.title || this.property} ${this.required ? html`<span class="txt--required">*</span>`: ``}</span>
                </bdo-button>
            </div>
        `;
    }

    handleItemSelection(property: string, item: ModelItem) {
        const itemSelected = new CustomEvent('itemSelected', { detail: { property, item } });
        this.dispatchEvent(itemSelected);
    }

    static override get styles() {
        return modelViewerCss;
    }
}