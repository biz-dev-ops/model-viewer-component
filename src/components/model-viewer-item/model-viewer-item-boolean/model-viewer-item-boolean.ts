import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModelItem } from "../../../model-viewer.types";
import modelViewerCss from "../../../model-viewer.css";

@customElement('model-viewer-item-boolean')
export class ModelViewerBoolean extends LitElement {
    @property({ type: Object }) item!: ModelItem;
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;

    override render() {
        return html`
            <details>
                <summary>${this.title || property } / type: ${this.item.type}</summary>
                <p>${this.item.description}</p>
                <pre>${JSON.stringify(this.item, null, 2)}</pre>
            </details>
      `;
    }

    static override get styles() {
        return modelViewerCss;
      }
}