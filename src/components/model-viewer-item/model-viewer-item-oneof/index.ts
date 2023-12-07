import { customElement, property } from "lit/decorators.js";
import { TemplateResult, css, html } from "lit";
import { ItemSelected, ModelItem, ModelItemDecorator } from "../../../model-viewer.types";

import "../../ui/button";
import "../../ui/popover";
import { ModelViewerItem } from "..";

@customElement('model-viewer-item-one-of')
export class ModelViewerItemOneOf extends ModelViewerItem {
    @property({ type: Array }) items!: ModelItem[];

    override render() {
        return html`
            <div class="item item--one-of">
                <h2>
                    <span class="txt--property">${this.title}</span>
                </h2>

                <ul class="list--one-of">
                    ${this.items.map(item => html`
                            <li>
                                <bdo-button direction="right" @clicked="${() => { this._onClicked(item); }}">
                                    <span class="button-label">
                                    <span class="txt--property">${item.title}</span>
                                    ${item.description ? html`
                                            <bdo-popover>
                                                ${item.description.trim()}
                                            </bdo-popover>
                                        ` : null}
                                    </span>
                                </bdo-button>
                            </li>
                        `)}
                </ul>
            </div>
        `;
    }

    private _onClicked(item: ModelItem) {
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property: this.property, item } }));
    }

    static override get styles() {
        return [...super.styles, css`
            .list--one-of {
                list-style: none;
                padding-inline-start: 0;
                display: flex;
                flex-direction: column;
                row-gap: var(--space-sm);
            }
        
            .list--one-of {
                row-gap: var(--space-xxs);
            }
        
            .list--one-of li {
                display: flex;
                flex-direction: column;
                position: relative;
                row-gap: var(--space-xxs);
            }
        
            .list--one-of li:not(:last-child)::after {
                content: 'OR';
                font-size: var(--font-size-xs);
                text-align: center;
                display: block;
                color: var(--color-black-a40);
                font-weight: 600;
            }

            .button-label {
                display: flex;
                column-gap: var(--space-xs);
            }
        `];
    }

    static build(decorated: ModelItemDecorator, itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void): TemplateResult {
        if (!decorated.item.oneOf)
            return html``;

        return html`
            <model-viewer-item-one-of
                property=${decorated.property}
                title=${decorated.title}
                .items=${decorated.item.oneOf}
                .required=${decorated.required}
                @itemSelected=${itemSelectedDelegate}
            ></model-viewer-item-one-of>
      `;
    }
}