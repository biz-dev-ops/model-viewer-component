import { css, html, TemplateResult } from "lit";
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

    static override get styles() {
        return [...super.styles, css`
             dt {
                color: rgba(0 0 0 / 50%);
                font-weight: 600;
            }

            dd {
                margin-inline-start: 0
            }

            dd + dt {
                margin-block-start: 1em;
            }
            
            .item--value {
                background-color: var(--color-black-a05);
                border-radius: var(--radius-half);
                padding: var(--space-sm);
            }

            .icon--type {
                margin-inline-start: auto;
                font-size: var(--font-size-xs);
                background-color: var(--main-surface);
                border-radius: var(--radius-pill);
                align-self: center;
                padding: var(--space-xxs) var(--space-xs);
            }

            .icon--type em {
                font-style: normal;
                font-weight: 400;
            }
        `];
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