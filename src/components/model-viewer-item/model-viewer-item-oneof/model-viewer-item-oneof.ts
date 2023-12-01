import { customElement, property } from "lit/decorators.js";
import { LitElement, html } from "lit";
import modelViewerCss from "../../../model-viewer.css";
import { ModelItem } from "../../../model-viewer.types";

@customElement('model-viewer-item-one-of')
export class ModelViewerItemOneOf extends LitElement {
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;
    @property({ type: Array }) items!: ModelItem[];

    override render() {
        const oneOf = [];

        for (const item of this.items) {
            oneOf.push(html`
                <li>
                   <bdo-button direction="right" @clicked="${() => { this.handleItemSelection(item); }}">
                        <span class="button-label">
                        <span class="txt--property">${item.title}</span>
                        ${
                            item.description ?
                            html`
                                <bdo-popover>
                                    <button slot="toggle" class="popover-control popover-control--info">
                                        <abbr title="info" >i</abbr>
                                    </button>

                                    ${item.description.trim()}
                            ` : null
                        }
                        </span>
                    </bdo-button>
                </li>
            `);
        }

        return html`
            <div class="item item--one-of">
                <h2>
                <span class="txt--property">${this.title || property}</span>
                </h2>

                <ul class="list--one-of">
                    ${oneOf}
                </ul>
            </div>
        `;
    }
    
    handleItemSelection(item: ModelItem) {
        const itemSelected = new CustomEvent('itemSelected', { detail: { item } });
        this.dispatchEvent(itemSelected);
    }

    static override get styles() {
        return modelViewerCss;
    }
}