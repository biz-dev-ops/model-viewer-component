import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ModelItem, PathItem } from './model-viewer.types';
import modelViewerCss from './model-viewer.css';
import "./components/ui/button/button";
import "./components/ui/popover/popover";
import "./components/model-viewer-item/model-viewer-item-boolean/model-viewer-item-boolean";
import "./components/model-viewer-item/model-viewer-item-value/model-viewer-item-value";
import "./components/model-viewer-item/model-viewer-item-oneof/model-viewer-item-oneof";
import "./components/model-viewer-item/model-viewer-item-object/model-viewer-item-object";
import "./components/model-viewer-item/model-viewer-item-array/model-viewer-item-array";

@customElement('model-viewer')
export class ModelViewer extends LitElement {
  @property() 
  name!: string

  @property({type: Object}) 
  model!: ModelItem

  @property({ attribute: "data-json" })
  dataJson!: string

  @state()
  path: PathItem[] = [];

  override render() {
    if(this.path.length === 0)
      return '';

    let required = false;

    if (this.path.length > 1) {
      const parentItem = this.path[this.path.length - 2].item;
      const property = this.path[this.path.length - 1].property;
      required = this.getRequired(parentItem, property)
    }

    const title = this.path[this.path.length - 1].title;
    const property = this.path[this.path.length - 1].property;
    const item = this.path[this.path.length - 1].item;

    return html`
      <nav>
        <ol class="list--path">
          ${this.path.map((path: PathItem, index) => this.renderPathItem(path, index))}
        </ol>
      </nav>
      <main>
        ${this.renderItem(property, title, item, required, true)}
      </main>
    `;
  }

  override update(changedProperties: Map<string, unknown>) {
    if(changedProperties.has("dataJson")) {
      this.path = [];
      this.model = JSON.parse(this.dataJson);
      this.setPath('', this.model, this.model?.title || this.name);
    }
    else if(changedProperties.has("model")) {
      this.path = [];
      this.setPath('', this.model, this.model?.title || this.name);
    }
    
    super.update(changedProperties);
  }

  override updated() {
    this.shadowRoot?.querySelector('nav')?.scrollIntoView();
  }

  getItemType(item: ModelItem) {
    if(item.type == 'object' || item.properties) {
      return 'object';
    } else if(item.type == 'string') {
      return 'string';
    } else if(item.type == 'number') {
      return 'number';
    } else if(item.type == 'integer') {
      return 'integer';
    } else if(item.type == 'boolean') {
      return 'boolean';
    } else if(item.type == 'array' || item.items) {
      return 'array';
    } else if(item.oneOf) {
      return 'oneOf';
    }
    return;
  }

  getRequired(item: ModelItem, property: string) {
    return item.required?.includes(property);
  }

  renderPathItem(path: PathItem, index: number) {
    const item = html`<span class="txt--property">${path.title}</span>`;
    
    return html`
      <li class="${ifDefined(path.type?.toLowerCase())}">
        ${
          path.type !== 'array' ?
          html`
            <bdo-button
              class="button--path"
              .disabled="${index + 1 === this.path.length}"
              @clicked="${() => { this.gotoPathItem(index); }}"
            >
              ${item}
            </bdo-button>
          ` :
          item
        }
      </li>
    `
  }
  
  renderItem(property: string, title: string | undefined, item: ModelItem, required = false, root = false) {
    const type = this.getItemType(item);
    switch(type) {
      case 'string':
        case 'number':
          case 'integer':
        return this.renderValue(property, title, item, required);
      
      case 'boolean':
        return this.renderBoolean(property, title, item);
      
      case 'array':
        return this.renderArray(property, title, item, required);
      
      case 'oneOf':
        if (root) {
          return this.renderOneOf(property, title, item.oneOf);
        } else {
          break;
        }

      // Object is default
      default:
        return this.renderObject(property, title, item, required, root);
    }

    return;
  }
  
  renderObject(property: string, title: string | undefined, item: ModelItem, required: boolean, root: boolean): TemplateResult {
    const properties = [];
    for (const property in item.properties) {
      const requiredItem = this.getRequired(item, property);
      const propertyItem = item.properties[property];
      properties.push(html`
        ${this.renderItem(property, propertyItem.title, propertyItem, requiredItem)}
      `);
    }

    return html`
      <model-viewer-item-object
        property="${property}"
        title="${title as string}"
        .item="${item}"
        .required="${required}"
        .root="${root}"
        @itemSelected=${(event: CustomEvent) => this.setPath(event.detail.property, event.detail.item)}
      >
          ${html`${properties}`}
      </model-viewer-item-object>
    `
  }

  renderValue(property: string, title: string | undefined, item: ModelItem, required: boolean): TemplateResult {
    return html`
      <model-viewer-item-value
        property="${property}"
        title="${title as string}"
        .item="${item}"
        .required="${required}"
      ></model-viewer-item-value>
    `;
  }

  renderBoolean(property: string, title: string | undefined, item: ModelItem): TemplateResult {
    return html`
      <model-viewer-item-boolean
        property="${property}"
        title="${title as string}"
        .item="${item}"
      >
      </model-viewer-item-boolean>
    `;
  }

  renderArray(property: string, title: string | undefined, item: ModelItem, required: boolean): TemplateResult {
    const itemsItemType = this.getItemType(item.items);
    const itemsItemProperty = item.items.title || item.items.type;
    let itemsItemTypeIsValue = itemsItemType === 'string' || itemsItemType === 'number' || itemsItemType === 'integer';

    return html`
      <model-viewer-item-array
        property="${property}"
        title="${title as string}"
        .item="${item}"
        .required="${required}"
        @itemSelected=${(event: CustomEvent) => this.setArrayAndItemPath(event.detail.property, event.detail.item)}
      >
        ${
          itemsItemTypeIsValue ?
          html`
            <model-viewer-item-value
              slot="value"
              property="${item.items.type}"
              title="${item.items.title as string}"
              .item="${item.items}"
              .required="${this.getRequired(item.items, itemsItemProperty)}"
            ></model-viewer-item-value>
          ` :
          html``
        }
      </model-viewer-item-array>`;
  }

  renderOneOf(property: string, title: string | undefined, items: ModelItem[]): TemplateResult {
    return html`
      <model-viewer-item-one-of
        property="${property}"
        title="${title as string}"
        .items="${items}"
        @itemSelected=${(event: CustomEvent) => this.setPath('', event.detail.item)}
      ></model-viewer-item-one-of>
    `;
  }

  setArrayAndItemPath(property: string, item: ModelItem) {
    // Add array path
    this.setPath(property, item);
    
    // Add item path
    this.setPath(property, item.items);
  }

  setPath(property: string, item: ModelItem, name: string | undefined = undefined) {
    if(item === undefined) {
      return;
    }

    const type = this.getItemType(item);
    const title = name || item.title || property;
    this.path = [...this.path, {property, title, item, type}];
  }

  gotoPathItem(index: number) {
    this.path = this.path.slice(0, index + 1);
  }

  static override get styles() {
    const hostCSS = css`
      :host {
          border: var(--line-base) solid var(--color-brand-a40);
          padding: var(--space-md);
          display: block;
          border-radius: var(--radius-base);
          font-size: var(--font-size-sm);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          }
  `;
  
    return [hostCSS, modelViewerCss];
  }
}