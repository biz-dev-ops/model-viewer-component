import { customElement, property } from "lit/decorators.js";
import { LitElement, TemplateResult, html } from "lit";
import modelViewerCss from "../../../model-viewer.css";
import { ItemSelected, ModelItem, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/button";
import { ModelItemBuilder } from "../../../modules/model-item-builder";

@customElement('model-viewer-item-object')
export class ModelViewerItemObject extends LitElement {
    @property({ type: Object }) item!: ModelItem;
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;
    @property({ type: Boolean }) required!: boolean;
    @property({ type: Boolean }) collapse!: boolean;

    override render() {
        if(this.collapse) {
            return html`
                <div class="item item--object">
                    <bdo-button type="button" direction="right" @clicked=${() => { this.handleItemSelection(this.property, this.item); }}>
                        <span class="txt--property">${this.title} ${this.required ? html`<span class="txt--required">*</span>`: ``}</span>
                    </bdo-button>
                </div>
            `;
        }
        else {
            return html`
                <div class="item item--object">
                    <h2>
                        <span class="txt--property">
                        ${this.title}
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
            `;
        }
    }

    handleItemSelection(property: string, item: ModelItem) {
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property, item } }));
    }

    static override get styles() {
        return modelViewerCss;
    }

    public static build(decorated: ModelItemDecorator, itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, collapse: boolean) : TemplateResult {
        if(decorated.item.type != 'object' && !decorated.item.properties)
            return html``;
            
        const properties = [];
        for (const property in decorated.item.properties) {
            const child = new ModelItemDecorator(decorated.item.properties[property], property, decorated.isChildRequired(property));
            properties.push(html`
                ${ModelItemBuilder.build(child, itemSelectedDelegate, true)}
            `);
        }

        return html`
            <model-viewer-item-object
                property=${decorated.property}
                title=${decorated.title}
                .item=${decorated.item}
                .required=${decorated.required}
                .collapse=${collapse}
                @itemSelected=${itemSelectedDelegate}
            >
                ${properties}
            </model-viewer-item-object>
        `;
    }
}