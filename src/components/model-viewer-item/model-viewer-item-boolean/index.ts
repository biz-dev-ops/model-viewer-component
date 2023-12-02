import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ItemSelected, ModelItem, ModelItemDecorator } from "../../../model-viewer.types";
import modelViewerCss from "../../../model-viewer.css";

@customElement('model-viewer-item-boolean')
export class ModelViewerItemBoolean extends LitElement {
  @property({ type: Object }) item!: ModelItem;
  @property({ type: String }) property!: string;
  @property({ type: String }) override title!: string;

  override render() {
    return html`
            <details>
                <summary>${this.title || property} / type: ${this.item.type}</summary>
                <p>${this.item.description}</p>
                <pre>${JSON.stringify(this.item, null, 2)}</pre>
            </details>
      `;
  }

  static override get styles() {
    return modelViewerCss;
  }

  public static build(decorated: ModelItemDecorator, _itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void) : TemplateResult {
    if (decorated.item.type != 'boolean')
      return html``;

    return html`
      <model-viewer-item-boolean
        property=${decorated.property}
        title=${decorated.title}
        .item=${decorated.item}
      >
      </model-viewer-item-boolean>
    `
  }
}