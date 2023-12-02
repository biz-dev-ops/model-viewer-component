import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { ItemSelected, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/popover";
import { ModelViewerItem } from "..";

@customElement('model-viewer-item-value')
export class ModelViewerItemValue extends ModelViewerItem {

    override render() {
        const properties: TemplateResult[] = [];
    
        for (const property in this.item) {
            if (property !== 'description' && property !== 'title' && property !== 'type' && property !== 'format') {
              const value = Array.isArray(this.item[property]) ? this.item[property].join(", ") : this.item[property];
              properties.push(html`
                <dt>${property}</dt>
                <dd>${value}</dd>
              `);
            }
        }
    
        return html`
            <div class="item item--value">
                <h3>
                    <span class="txt--property">
                        ${this.title}
                        ${this.required ? html`<span class="txt--required">*</span>` : ``}
                    </span>
                    ${
                        this.item.description ?
                        html`
                            <bdo-popover>
                                <button slot="toggle" class="popover-control popover-control--info">
                                    <abbr title="info" >i</abbr>
                                </button>

                                ${this.item.description.trim()}
                            </bdo-popover>
                        ` : null
                    }

                    <span class="icon--type">
                        ${this.item.type}${this.item.format ? html`: <em>${this.item.format}</em>` : ''}
                    </span>
                </h3>

                ${properties}
            </div>
        `;
    }

    public static build(decorated: ModelItemDecorator, _itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void) : TemplateResult {
        if(decorated.item.type != 'string' && decorated.item.type != 'number' && decorated.item.type != 'integer')
            return html``;
            
        return html`
            <model-viewer-item-value
              property=${decorated.property}
              title=${decorated.title}
              .item=${decorated.item}
              .required=${decorated.required}
            ></model-viewer-item-value>
          `;
    }
}