import { customElement } from "lit/decorators.js";
import { css, html } from "lit";
import { ItemSelected, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/button";
import "../../ui/popover";
import { ModelItemBuilder } from "../../../modules/model-item-builder";
import { ModelViewerItem } from "..";

@customElement('model-viewer-item-array')
export class ModelViewerItemArray extends ModelViewerItem {
    
    override render() {
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
                                ${this.item.description.trim()}
                            </bdo-popover>
                        ` : null
                    }
                </h3>
                
                <ul class="list--array">
                    <li>
                        <slot name="value">
                            <bdo-button direction="right" @clicked=${this._onClicked}>
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

    private _onClicked() {
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property: this.property, item: this.item } }));
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property: this.property, item: this.item.items } }));
    }

    static override get styles() {
        return [...super.styles, css`

            .item--array {
                border-radius: var(--radius-half);
                border: var(--line-thin) solid var(--item-line-color);
                padding: var(--space-sm);
                padding-block-end: 0;
                margin-block-end: calc(var(--space-xs) * -1);
                mask-image: linear-gradient(to top, transparent var(--space-sm), black var(--space-xl));
                -webkit-mask-image: linear-gradient(to top, transparent var(--space-sm), black var(--space-xl));
            }
            
            .list--array {
                list-style: none;
                padding-inline-start: 0;
                display: flex;
                flex-direction: column;
                row-gap: var(--space-sm);
            }

            .list--array li {
                position: relative;
            }
            
            .list--array li::before,
            .list--array li::after {
            content: '';
                position: absolute;
                inset-inline-start: calc(var(--space-sm) * -1);
                inset-block-start: calc(var(--space-sm) + var(--space-xxs));
            }

            .list--array li::before {
                background-color: var(--item-line-color);
                block-size: var(--line-thin);
                inline-size: var(--space-sm);
            }
            
            .list--array li::after {
                aspect-ratio: 1;
                background-color: var(--main-surface);
                block-size: .625rem;
                border-radius: var(--radius-circle);
                border: var(--line-thin) solid var(--item-line-color);
                transform: translateX(-.4375rem) translateY(-.25rem);
            }

            .list--array li:not(:first-child) {
                pointer-events: none;
            }
        `];
    }

    static build(decorated: ModelItemDecorator, itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, root: boolean): import("lit-html").TemplateResult {
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
                ${ModelItemBuilder.build(new ModelItemDecorator(decorated.item.items), itemSelectedDelegate, root)}
            </model-viewer-item-array>
        `;
    }
}