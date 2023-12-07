import { customElement } from "lit/decorators.js";
import { TemplateResult, css, html } from "lit";
import { ItemSelected, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/button";
import { ModelItemBuilder } from "../../../modules/model-item-builder";
import { ModelViewerItem } from "..";

@customElement('model-viewer-item-object-properties')
export class ModelViewerItemObjectProperties extends ModelViewerItem {

    override render() {
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

    static override get styles() {
        return [...super.styles, css`
            .items {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
            }
        `];
    }

    public static build(decorated: ModelItemDecorator, itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, root: boolean) : TemplateResult {
        if(!isObject(decorated, root))
            return html``;
            
        const properties = [];
        for (const property in decorated.item.properties) {
            const child = new ModelItemDecorator(decorated.item.properties[property], property, decorated.isChildRequired(property));
            properties.push(html`
                ${ModelItemBuilder.build(child, itemSelectedDelegate, true)}
            `);
        }

        return html`
            <model-viewer-item-object-properties
                property=${decorated.property}
                title=${decorated.title}
                .item=${decorated.item}
                .required=${decorated.required}
            >
                ${properties}
            </model-viewer-item-object-properties>
        `;
    }
}

const isObject = (decorated: ModelItemDecorator, root: boolean) => {
    return (!root && (decorated.item.type === "object" || decorated.item.properties));
}