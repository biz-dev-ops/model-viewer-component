import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModelItem } from "../../../model-viewer.types";
import "../../ui/popover/popover";
import modelViewerCss from "../../../model-viewer.css";

@customElement('model-viewer-item-value')
export class ModelViewerItemValue extends LitElement {
    @property({ type: Object }) item!: ModelItem;
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;
    @property({ type: Boolean }) required!: boolean;

    override render() {
        const poId = 'popover-' + Math.floor(Math.random() * Date.now()).toString(16);
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
    
        return properties.length ? html`<dl>${properties}</dl>` : '';

        return html`
            <div class="item item--value">
                <h3>
                    <span class="txt--property">
                        ${this.title || this.property}
                        ${this.required ? html`<span class="txt--required">*</span>`: ``}
                    </span>
                    ${
                        this.item.description ?
                        html`
                            <a
                            href="#${poId}"
                            class="popover-control popover-control--info"
                            popovertarget="${poId}"
                            >
                            <abbr title="info" >i</abbr>
                            </a>
                        ` : null
                    }

                    <span class="icon--type">
                        ${this.item.type}${this.item.format ? html`: <em>${this.item.format}</em>` : ''}
                    </span>
                </h3>

                ${properties}
            </div>

            ${this.item.description ? html`
                <bdo-popover popover id="${poId}">${this.item.description.trim()}</bdo-popover>
            ` : html``}
        `;
    }

    static override get styles() {
        return modelViewerCss;
    }
}