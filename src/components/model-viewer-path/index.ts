import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModelItemDecorator, PathChanged } from "../../model-viewer.types";
import { ifDefined } from "lit/directives/if-defined.js";
import modelViewerPathCss from "./model-viewer-path.css";

@customElement('model-viewer-path')
export class ModelViewerPath extends LitElement {
    
    @property({ type: Array })
    path: ModelItemDecorator[] = [];

    override render() {
        return html`
            <nav>
                <ol class="list--path">
                    ${this.path.map((decorated: ModelItemDecorator, index) => this._renderPathItem(decorated, index))}
                </ol>
            </nav>
        `;
    }

    private _renderPathItem(decorated: ModelItemDecorator, index: number) {
        const item = html`<span class="txt--property">${decorated.title}</span>`;

        return html`
          <li class="${ifDefined(decorated.type()?.toLowerCase())}">
            ${decorated.type() !== 'array' ?
                html`
                <bdo-button class="button--path" .disabled="${index + 1 === this.path.length}" @clicked="${() => { this._onClick(index); }}">
                  ${item}
                </bdo-button>
            ` : item
            }
          </li>
        `
    }

    private _onClick(index: number) {
        this.dispatchEvent(new CustomEvent<PathChanged>('pathChanged', { detail: { index } }));
    }

    static override get styles() {
      return [ modelViewerPathCss ];
    }
}