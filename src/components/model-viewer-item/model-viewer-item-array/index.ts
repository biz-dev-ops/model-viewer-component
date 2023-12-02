import { customElement } from "lit/decorators.js";
import { html } from "lit";
import { ItemSelected, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/button";
import "../../ui/popover";
import { ModelItemBuilder } from "../../../modules/model-item-builder";
import { ModelViewerItem } from "..";

@customElement('model-viewer-item-array')
export class ModelViewerItemArray extends ModelViewerItem {
    
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
                            <bdo-button direction="right" @clicked=${this.onClicked}>
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

    onClicked() {
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property: this.property, item: this.item } }));
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property: this.property, item: this.item.items } }));
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