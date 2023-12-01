import { customElement, property } from "lit/decorators.js";
import { LitElement, html } from "lit";
import modelViewerCss from "../../../model-viewer.css";
import { ModelItem } from "../../../model-viewer.types";
import "../../ui/button/button";

// array
@customElement('model-viewer-item-array')
export class ModelViewerItemArray extends LitElement {
    @property({ type: Object }) item!: ModelItem;
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;
    @property({ type: Boolean }) required!: boolean;
    
    override render() {
        const poId = 'popover-' + Math.floor(Math.random() * Date.now()).toString(16);

        return html`
            <div class="item item--array">
                <h3>
                    <span class="txt--property">
                        ${this.title || property} ${this.required ? html`<span class="txt--required">*</span>`: ``}
                    </span>
                    ${
                        this.item.description ?
                        html`
                            <button class="popover-control popover-control--info" popovertarget="${poId}">
                                <abbr title="info" >i</abbr>
                            </button>
                        ` : null
                    }
                </h3>
                
                <ul class="list--array">
                    <li>
                        <slot name="value">
                            <bdo-button direction="right" @clicked="${() => { this.handleItemSelection(this.property, this.item); }}">
                                <span class="txt--property">${this.item.items.title}</span>
                            </bdo-button>
                        </slot>
                    </li>
                </ul>

                ${this.item.description ? html`
                    <bdo-popover popover id="${poId}">${this.item.description.trim()}</bdo-popover>
                ` : html``}
            </div>
        `;
    }

    override updated(_changedProperties: Map<string, unknown>): void {
        // Duplicate array item
        const arrayList = this.shadowRoot?.querySelector('.list--array');
        const clone = arrayList?.querySelector('li')?.cloneNode(true);
        
        arrayList?.appendChild(clone as Node);
        
        // Disable button for cloned item
        const cloneButton = arrayList?.querySelector('li:not(:first-child) bdo-button');

        if (cloneButton) {
            cloneButton.setAttribute('disabled', 'disabled');
        }
    }

    getItemType(item: ModelItem) {
        if(item.type == 'object' || item.properties) {
          return 'object';
        } else if(item.type == 'string') {
          return 'string';
        } else if(item.type == 'number') {
          return 'number';
        } else if(item.type == 'integer') {
          return 'integer';
        } else if(item.type == 'boolean') {
          return 'boolean';
        } else if(item.type == 'array' || item.items) {
          return 'array';
        } else if(item.oneOf) {
          return 'oneOf';
        }
        return;
    }

    handleItemSelection(property: string, item: ModelItem) {
        const itemSelected = new CustomEvent('itemSelected', { detail: { property, item } });
        this.dispatchEvent(itemSelected);
    }
    
    static override get styles() {
        return modelViewerCss;
    }
}