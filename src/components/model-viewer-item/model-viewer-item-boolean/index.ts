import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { ItemSelected, ModelItemDecorator } from "../../../model-viewer.types";
import { ModelViewerItem } from "..";

@customElement('model-viewer-item-boolean')
export class ModelViewerItemBoolean extends ModelViewerItem {

  override render() {
    return html`
        <details>
            <summary>${this.title} / type: ${this.item.type}</summary>
            <p>${this.item.description}</p>
            <pre>${JSON.stringify(this.item, null, 2)}</pre>
        </details>
      `;
  }

  public static build(decorated: ModelItemDecorator, _itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void): TemplateResult {
    if (decorated.item.type != 'boolean')
      return html``;

    return html`
      <model-viewer-item-boolean
        property=${decorated.property}
        title=${decorated.title}
        .item=${decorated.item}
        .required=${decorated.required}
      >
      </model-viewer-item-boolean>
    `
  }
}