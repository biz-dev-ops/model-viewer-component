import { customElement, property } from "lit/decorators.js";
import { LitElement, TemplateResult, html } from "lit";
import modelViewerCss from "../../../model-viewer.css";
import { ItemSelected, ModelItem, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/button";
import "../../ui/popover";

@customElement('model-viewer-item-one-of')
export class ModelViewerItemOneOf extends LitElement {
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;
    @property({ type: Array }) items!: ModelItem[];

    override render() {
        return html`
            <div class="item item--one-of">
                <h2>
                <span class="txt--property">${this.title || property}</span>
                </h2>

                <ul class="list--one-of">
                    ${this.items.map(item =>
                        html`
                                <li>
                                   <bdo-button direction="right" @clicked="${() => { this.handleItemSelection(item); }}">
                                        <span class="button-label">
                                        <span class="txt--property">${item.title}</span>
                                        ${item.description ?
                                            html`
                                                <bdo-popover>
                                                    <button slot="toggle" class="popover-control popover-control--info">
                                                        <abbr title="info" >i</abbr>
                                                    </button>
                
                                                    ${item.description.trim()}
                                                </bdo-popover>
                                            ` : null
                                        }
                                        </span>
                                    </bdo-button>
                                </li>
                `   )}
                </ul>
            </div>
        `;
    }

    handleItemSelection(item: ModelItem) {
        const itemSelected = new CustomEvent<ItemSelected>('itemSelected', { detail: { property: this.property, item } });
        this.dispatchEvent(itemSelected);
    }

    static override get styles() {
        return modelViewerCss;
    }

    static build(decorated: ModelItemDecorator, itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void): TemplateResult {
        if(!decorated.item.oneOf)
            return html``;
        
        return html`
            <model-viewer-item-one-of
                property=${decorated.property}
                title=${decorated.title}
                .items=${decorated.item.oneOf}
                @itemSelected=${itemSelectedDelegate}
            ></model-viewer-item-one-of>
      `;
    }
}