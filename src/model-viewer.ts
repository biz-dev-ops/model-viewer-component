import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ModelItem, PathItem } from './model-viewer.types';
import modelViewerCss from './model-viewer.css';
import "./components/ui/button/button";
import "./components/ui/popover/popover";

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
  uid: number = 999;

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

  getUId(prefix: string): string | number {
    this.uid = this.uid + 1;
    return prefix ? `${prefix}-${this.uid}` : this.uid;
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
      case 'object':
        return this.renderObject(property, title, item, required, root);
      
      case 'string':
        return this.renderValue(property, title, item, required);
      
      case 'number':
        return this.renderValue(property, title, item, required);
      
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
          return this.renderObject(property, title, item, required, root);
        }
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

    return root ? 
      html`
        <div class="item item--object">
          <h2>
            <span class="txt--property">
              ${title || property}
              ${required ? html`<span class="txt--required">*</span>`: ``}
            <span>
          </h2>
          
          ${
            item.description ?
            html`<p>${item.description}</p>` : null
          }
          
          <div class="items">
            ${properties}
          </div>
        </div>
      ` :
      html`
        <div class="item item--object">
          <bdo-button type="button" direction="right" @clicked="${() => { this.selectObject(property, item); }}">
            <span class="txt--property">${title || property} ${required ? html`<span class="txt--required">*</span>`: ``}</span>
          </bdo-button>
        </div>
      `;
  }

  renderValue(property: string, title: string | undefined, item: ModelItem, required: boolean): TemplateResult {
    const properties = [];
    const uId = this.getUId('popover');
    for (const property in item) {
      if (property !== 'description' && property !== 'title' && property !== 'type' && property !== 'format') {
        const value = Array.isArray(item[property]) ? item[property].join(", ") : item[property];
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
            ${title || property}
            ${required ? html`<span class="txt--required">*</span>`: ``}
          </span>
          ${
            item.description ?
            html`
              <a
                href="#${uId}"
                class="popover-control popover-control--info"
                popovertarget="${uId}"
                @mouseenter="${this.popoverShow}" @mouseleave="${this.popoverHide}"
                @focus="${this.popoverShow}" @blur="${this.popoverHide}"
              >
                <abbr title="info" >i</abbr>
              </a>
            ` : null
          }

          <span class="icon--type">
            ${item.type}${item.format ? html`: <em>${item.format}</em>` : ''}
            </span>
        </h3>
        ${
          properties.length ?
          html`<dl>${properties}</dl>` :
          ''
        }
      </div>

      ${this.renderPopover(item.description, uId)}
    `
  }

  renderBoolean(property: string, title: string | undefined, item: ModelItem): TemplateResult {
    return html`
      <details>
        <summary>${title || property } / type: ${item.type}</summary>
        <p>${item.description}</p>
        <pre>${JSON.stringify(item, null, 2)}</pre>
      </details>
    `;
  }

  renderArray(property: string, title: string | undefined, item: ModelItem, required: boolean): TemplateResult {
    const uId = this.getUId('popover');
    const itemsItemType = this.getItemType(item.items);
    const itemsItemProperty = item.items.title || item.items.type;
    const itemsItemTypeIsValue = itemsItemType === 'string' || itemsItemType === 'number' || itemsItemType === 'integer';
    const renderValue = this.renderValue(item.items.type, item.items.title, item.items, this.getRequired(item.items, itemsItemProperty))

    return html`
      <div class="item item--array">
        <h3>
          <span class="txt--property">
            ${title || property} ${required ? html`<span class="txt--required">*</span>`: ``}
          </span>
          ${
            item.description ?
            html`
              <a
                href="#${uId}"
                class="popover-control popover-control--info"
                popovertarget="${uId}"
                @mouseenter="${this.popoverShow}" @mouseleave="${this.popoverHide}"
                @focus="${this.popoverShow}" @blur="${this.popoverHide}"
              >
                <abbr title="info" >i</abbr>
              </a>
            ` : null
          }
        </h3>
        
        <ul class="list--array">
          <li>
            ${!itemsItemTypeIsValue ?
              html`
                <bdo-button direction="right" @clicked="${() => { this.selectArrayItem(property, item); }}">
                  <span class="txt--property">${item.items.title}</span>
                </bdo-button>
              ` :
              renderValue
            }
          </li>
          <li>
            ${!itemsItemTypeIsValue ?
              html`
                <bdo-button direction="right" disabled>
                  <span class="txt--property">${item.items.title}</span>
                </bdo-button>
              ` :
              renderValue
            }
            
          </li>
        </ul>

        ${this.renderPopover(item.description, uId)}
    </div>
    `;
  }

  renderOneOf(property: string, title: string | undefined, items: ModelItem[]): TemplateResult {
    const oneOf = [];

    for (const item of items) {
      const uId = this.getUId('popover');

      oneOf.push(html`
        <li>
          <bdo-button direction="right" @clicked="${() => { this.selectOneOf(item); }}">
            <span class="button-label">
              <span class="txt--property">${item.title}</span>
              ${
                item.description ?
                html`
                  <a
                    href="#${uId}"
                    class="popover-control popover-control--info"
                    popovertarget="${uId}"
                    @mouseenter="${this.popoverShow}" @mouseleave="${this.popoverHide}"
                    @focus="${this.popoverShow}" @blur="${this.popoverHide}"
                    @click="${(event: Event) => event.stopPropagation()}"
                  >
                    <abbr title="info" >i</abbr>
                  </a>
                ` : null
              }
            </span>
          </bdo-button>
          ${this.renderPopover(item.description, uId)}
        </li>
        `);
    }

    return html`
      <div class="item item--one-of">
        <h2>
          <span class="txt--property">${title || property}</span>
        </h2>

        <ul class="list--one-of">
          ${oneOf}
        </ul>
      </div>
    `;
  }

  renderPopover(content: string, uId: string | number): TemplateResult | undefined {
    if (content) {
      return html`<bdo-popover popover id="${uId}">${content.trim()}</bdo-popover>`;
    }

    return;
  }

  selectOneOf(item: ModelItem) {
    this.setPath('', item);
  }

  selectObject(property: string, item: ModelItem) {
    this.setPath(property, item);
  }

  selectArrayItem(property: string, item: ModelItem) {
    // Add array path
    this.setPath(property, item);
    
    // Add item path
    this.setPath(property, item.items);
  }

  positionPopover(control: HTMLElement, target: HTMLElement) {
    const buttonPosition = control.getBoundingClientRect();
    const parent = control.closest('.button--object, .item');
    const parentPosition = parent?.getBoundingClientRect();
    const scrollTop =  document.documentElement.scrollTop || document.body.scrollTop;

    if (parentPosition) {
      target.style.left = `${parentPosition.left}px`;
      target.style.top = `${buttonPosition.bottom + scrollTop}px`;
      target.style.width = `${parentPosition.width}px`;
    }

  }

  popoverShow(event: any) {
    const control = event.target;
    const targetId = control?.attributes.popovertarget.value;
    const target = this.renderRoot.querySelector(`#${targetId}`);

    if (target) {
      this.positionPopover(control, target as HTMLElement);
      try {
        (target as any).showPopover();
      }
      catch {}
    }
  }

  popoverHide(event: any): void {
    const targetId = event.target.attributes.popovertarget.value;
    const target = this.renderRoot.querySelector(`#${targetId}`);

    if (target) {
      try {
        (target as any).hidePopover();
      }
      catch {}
    }
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
    return modelViewerCss;
  }
}