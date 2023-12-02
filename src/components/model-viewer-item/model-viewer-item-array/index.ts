import { customElement, property } from "lit/decorators.js";
import { LitElement, html } from "lit";
import modelViewerCss from "../../../model-viewer.css";
import { ItemSelected, ModelItem, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/button";
import "../../ui/popover";
import { ModelItemBuilder } from "../../../modules/model-item-builder";

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
                        ${this.title} ${this.required ? html`<span class="txt--required">*</span>`: ``}
                    </span>
                    ${
                        this.item.description ?
                        html`
                            <bdo-popover>
                                <button slot="toggle" class="popover-control popover-control--info" popovertarget="${poId}">
                                    <abbr title="info" >i</abbr>
                                </button>

                                ${this.item.description.trim()}
                            </bdo-popover>
                        ` : null
                    }
                </h3>
                
                <ul class="list--array">
                    <li>
                        <slot name="value">
                            <bdo-button direction="right" @clicked="${() => { this.onClicked(this.property, this.item); }}">
                                <span class="txt--property">${this.item.items.title}</span>
                            </bdo-button>
                        </slot>
                    </li>
                </ul>
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

    onClicked(property: string, item: ModelItem) {
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property, item } }));
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property, item: item.items } }));
    }
    
    static override get styles() {
        return modelViewerCss;
    }

    static build(decorated: ModelItemDecorator, itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, collapse: boolean): import("lit-html").TemplateResult {
        if(decorated.item.type != "array" && !decorated.item.items)
            return html``;

        return html`
            <model-viewer-item-array
            property=${decorated.property}
            title=${decorated.title}
            .item=${decorated.item}
            .required=${decorated.required}
            @itemSelected=${itemSelectedDelegate}
            >
                ${ModelItemBuilder.build(new ModelItemDecorator(decorated.item.items), itemSelectedDelegate, collapse)}
            </model-viewer-item-array>
        `;
    }
}