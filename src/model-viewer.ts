import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ModelItem, PathItem } from './model-viewer.types';
import resetStyles from './modules/resetStyles';

@customElement('model-viewer')
export class ModelViewer extends LitElement {
  static override get styles() {
    const styles =  css`
        :host {
          --item-line-color: var(--color-brand-base);
          --button-hover-color: var(--color-brand-a10);

          border: var(--line-base) solid var(--color-brand-a40);
          padding: var(--space-md);
          display: block;
          border-radius: var(--radius-base);
          font-size: var(--font-size-sm);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        :where(h1, h2, h3, h4, p, ul, ol, dl):first-child {
          margin-block-start: 0;
        }

        :where(h1, h2, h3, h4, p, ul, ol, dl):last-child {
          margin-block-end: 0;
        }

        h3 {
          column-gap: var(--space-xs);
          display: flex;
          font-size: var(--font-size-sm);
        }

        ul, ol {
          margin: 0;
        }

        dt {
          color: rgba(0 0 0 / 50%);
          font-weight: 600;
        }

        dd {
          margin-inline-start: 0
        }

        dd + dt {
          margin-block-start: 1em;
        }

        button {
          background-color: transparent;
          border: var(--line-base) solid var(--item-line-color);
          border-radius: var(--radius-half);
          color: var(--button-text-color);
          min-height: var(--space-lg);
          padding: var(--space-sm) var(--space-sm);
          text-decoration: none;
          transition: all var(--duration-base);
        }

        button[disabled] {
          pointer-event: none;
        }

        :is(button:not([disabled])):is(:active, :hover, :focus-visible) {
          background-color: var(--button-hover-color);
          color: var(--button-text-color-active);
        }

        .icon--type {
          margin-inline-start: auto;
          font-size: var(--font-size-xs);
          background-color: var(--main-surface);
          border-radius: var(--radius-pill);
          align-self: center;
          padding: var(--space-xxs) var(--space-xs);
        }

        .icon--type em {
          font-style: normal;
          font-weight: 400;
        }

        .button--object {
          align-items: center;
          display: flex;
          justify-content: space-between;
          column-gap: var(--space-xs);
          inline-size: 100%;
        }

        .button--object::after {
          content: "";
          display: inline-block;
          border-color: currentColor;
          border-width:var(--line-thin) var(--line-thin) 0 0;
          border-style: solid;
          height: var(--space-xs);
          width: var(--space-xs);
          position: relative;
          top: calc(var(--space-xxs) / -2);
          transform: rotate(45deg);
          justify-self: end;
          transition: transform var(--duration-base);
          transform-origin: 30% 70%;
          justify-self: flex-end;
        }

        .button-label {
          display: flex;
          column-gap: var(--space-xs);
        }

        .popover-control--info {
          background-color: var(--color-white);
          align-self: center;
          border: var(--line-base) solid var(--button-background-base);
          border-radius: var(--radius-circle);
          block-size: var(--font-size-base);
          font-size: var(--font-size-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1;
          text-decoration: none;
        }

        .popover-control--info abbr[title] {
          border: 0;
          line-height: 1em;
          text-decoration: none;
          font-weight: 600;
        }

        .txt--property {
          font-weight: 600;
        }

        .txt--required {
          color: var(--color-error);
        }

        .list--path {
          display: flex;
          gap: var(--space-xs);
          padding-inline-start: 0;
          list-style: none;
          align-items: center;
          flex-wrap: wrap
        }

        .list--path li {
          display: flex;
          column-gap: var(--space-xs);
          align-items: center;
        }

        .list--path li:not(:last-child, .oneof)::after {
          content: ' /';
        }

        .list--path li.oneof button::after {
          content: ':';
        }

        .list--path li.oneof + .object button {
          margin-inline-start: calc(var(--space-xxs) * -1);
        }

        .list--path button {
          padding: var(--space-xs);
        }

        .list--path li > span {
          padding-block: calc(var(--line-base) + var(--space-sm));
        }

        .list--one-of,
        .list--array {
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

        .list--array li {
          position: relative;
        }
        
        .list--array li::before,
        .list--array li::after {
          content: '';
          position: absolute;
          inset-inline-start: calc(var(--space-sm) * -1);
          inset-block-start: calc(var(--space-sm) + var(--space-xxs));
        }

        .list--array li::before {
          background-color: var(--item-line-color);
          block-size: var(--line-thin);
          inline-size: var(--space-sm);
        }
        
        .list--array li::after {
          aspect-ratio: 1;
          background-color: var(--main-surface);
          block-size: .625rem;
          border-radius: var(--radius-circle);
          border: var(--line-thin) solid var(--item-line-color);
          transform: translateX(-.4375rem) translateY(-.25rem);
        }

        [popover] {
          box-shadow: var(--drop-shadow-level2);
          border: 0;
          border-radius: var(--radius-base);
          inset: unset;
          margin-top: var(--space-xs);
          padding: var(--space-sm);
          position: absolute;
          transition: border var(--duration-base);
        }

        [popover]::backdrop {
          background-color: rgba(0 0 0 / 5%);
        }

        :is(button:not([disabled])):is(:active, :hover, :focus-visible) + [popover] {
          border-color: var(--button-background-active)
        }

        .items {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .item--value {
          background-color: var(--color-black-a05);
          border-radius: var(--radius-half);
          padding: var(--space-sm);
        }

        .item--array {
          border-radius: var(--radius-half);
          border: var(--line-thin) solid var(--item-line-color);
          padding: var(--space-sm);
          padding-block-end: 0;
          margin-block-end: calc(var(--space-xs) * -1);
          mask-image: linear-gradient(to top, transparent var(--space-sm), black var(--space-xl));
          -webkit-mask-image: linear-gradient(to top, transparent var(--space-sm), black var(--space-xl));
        }
    `;

    return [resetStyles, styles];
  }

  @property()
  override id!: string;
  name!: string;
  
  @state()
  path: PathItem[] = [];
  uid: number = 999;
  modelViewer: {[key: string]: ModelItem} = (window as any).modelViewer;

  override connectedCallback() {
    super.connectedCallback();
    this.setPath(this.id, this.modelViewer[this.id], this.name);
  }

  override render() {
    let required = false;

    if (this.path.length > 1) {
      const parentItem = this.path[this.path.length - 2].item;
      const property = this.path[this.path.length - 1].property;
      required = this.getRequired(parentItem, property)
    }

    const title = this.path[this.path.length - 1].property || this.path[this.path.length - 1].title;
    const item = this.path[this.path.length - 1].item;

    return html`
      <nav>
        <ol class="list--path">
          ${this.path.map((path: PathItem, index) => this.renderPathItem(path, index))}
        </ol>
      </nav>
      <main>  
        ${this.renderItem(title, item, required, true)}
      </main>
    `;
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
    return html`
      <li class="${ifDefined(path.type?.toLowerCase())}">
        ${
          path.type !== 'array' ?
          html`
            <button
              type="button"
              class="button--path"
              .disabled="${index + 1 === this.path.length}"
              @click="${() => { this.gotoPathItem(index); }}"
            >
              <span class="txt--property">${path.title}</span>
            </button>
          ` :
          html`<span class="txt--property">${path.title}</span>`
        }
      </li>
    `
  }

  renderItem(property: string, item: ModelItem, required = false, root = false) {
    const type = this.getItemType(item);
    switch(type) {
      case 'object':
        return this.renderObject(property, item, required, root);
      
      case 'string':
        return this.renderValue(property, item, required);
      
      case 'number':
        return this.renderValue(property, item, required);
      
      case 'integer':
        return this.renderValue(property, item, required);
      
      case 'boolean':
        return this.renderBoolean(property, item);
      
      case 'array':
        return this.renderArray(property, item, required);
      
      case 'oneOf':
        return this.renderOneOf(item.oneOf);
    }

    return;
  }
  
  renderObject(property: string, item: ModelItem, required: boolean, root: boolean): TemplateResult {
    const properties = [];
    for (const property in item.properties) {
      const requiredItem = this.getRequired(item, property);
      properties.push(html`
        ${this.renderItem(property, item.properties[property], requiredItem)}
      `);
    }

    return root ? 
      html`
        <div class="item item--object">
          ${
            property ?
            html`
              <h2>
                ${property}
                ${required ? html`<span class="txt--required">*</span>`: ``}
              </h2>
            ` : null
          }
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
          <button type="button" class="button--object" @click="${() => { this.selectObject(property, item); }}"><span class="txt--property">${property} ${required ? html`<span class="txt--required">*</span>`: ``}</span></button>
        </div>
      `;
  }

  renderValue(property: string, item: ModelItem, required: boolean): TemplateResult {
    const properties = [];
    const uId = this.getUId('popover');
    for (const property in item) {
      if (property !== 'description' && property !== 'title' && property !== 'type' && property !== 'format') {
        properties.push(html`
          <dt>${property}</dt>
          <dd>${item[property]}</dd>
        `);
      }
    }

    return html`
      <div class="item item--value">
        <h3>
          <span>
            ${property}
            ${required ? html`<span class="txt--required">*</span>`: ``}
          </span>
          ${
            item.description ?
            html`
              <a
                href="#${uId}"
                class="popover-control popover-control--info"
                popovertarget="${uId}"
                @mouseenter="${this.showPopover}" @mouseleave="${this.hidePopover}"
                @focus="${this.showPopover}" @blur="${this.hidePopover}"
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

  renderBoolean(property: string, item: ModelItem): TemplateResult {
    return html`
      <details>
        <summary>${property || item.title} / type: ${item.type}</summary>
        <p>${item.description}</p>
        <pre>${JSON.stringify(item, null, 2)}</pre>
      </details>
    `;
  }

  renderArray(property: string, item: ModelItem, required: boolean): TemplateResult {
    const uId = this.getUId('popover');
    const itemsItemType = this.getItemType(item.items);
    const itemsItemProperty = item.items.title || item.items.type;
    const itemsItemTypeIsValue = itemsItemType === 'string' || itemsItemType === 'number' || itemsItemType === 'integer';

    return html`
      <div class="item item--array">
        <h3>
          <span>
            ${item.title || property} ${required ? html`<span class="txt--required">*</span>`: ``}
          </span>
          ${
            item.description ?
            html`
              <a
                href="#${uId}"
                class="popover-control popover-control--info"
                popovertarget="${uId}"
                @mouseenter="${this.showPopover}" @mouseleave="${this.hidePopover}"
                @focus="${this.showPopover}" @blur="${this.hidePopover}"
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
            <button type="button" class="button--object" @click="${() => { this.selectArrayItem(property, item); }}">
              <span class="txt--property">${item.items.title}</span>
          </button>
              ` :
              this.renderValue(itemsItemProperty, item.items, this.getRequired(item.items, itemsItemProperty))
            }
          </li>
          <li>
            ${!itemsItemTypeIsValue ?
              html`
            <button type="button" class="button--object" disabled>
              <span class="txt--property">${item.items.title}</span>
          </button>
              ` :
              this.renderValue(itemsItemProperty, item.items, this.getRequired(item.items, itemsItemProperty))
            }
            
          </li>
        </ul>

        ${this.renderPopover(item.description, uId)}
    </div>
    `;
  }

  renderOneOf(items: ModelItem[]): TemplateResult {
    const oneOf = [];

    for (const item of items) {
      const uId = this.getUId('popover');

      oneOf.push(html`
        <li>
          <button type="button" class="button--object" @click="${() => { this.selectOneOf(item); }}">
            <span class="button-label">
              <span class="txt--property">${item.title}</span>
              ${
                item.description ?
                html`
                  <a
                    href="#${uId}"
                    class="popover-control popover-control--info"
                    popovertarget="${uId}"
                    @mouseenter="${this.showPopover}" @mouseleave="${this.hidePopover}"
                    @focus="${this.showPopover}" @blur="${this.hidePopover}"
                  >
                    <abbr title="info" >i</abbr>
                  </a>
                ` : null
              }
            </span>
          </button>
          ${this.renderPopover(item.description, uId)}
        </li>
        `);
    }

    return html`
      <div class="item item--one-of">
        <ul class="list--one-of">
          ${oneOf}
        </ul>
      </div>
    `;
  }

  renderPopover(content: string, uId: string | number): TemplateResult | undefined {
    if (content) {
      return html`<div id="${uId}" popover>${content.trim()}</div>`;
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

  showPopover(event: any) {
    const control = event.target;
    const targetId = control.attributes.popovertarget.value;
    const target = this.renderRoot.querySelector(`#${targetId}`);

    if (target) {
      this.positionPopover(control, target as HTMLElement);
      // @ts-ignore
      target.showPopover();
    }
  }

  hidePopover(event: any) {
    const targetId = event.target.attributes.popovertarget.value;
    const target = this.renderRoot.querySelector(`#${targetId}`);

    if (target) {
      // @ts-ignore
      target.hidePopover();
    }
  }

  setPath(property: string, item: ModelItem, name: string | undefined = undefined) {
    const type = this.getItemType(item);
    const title = name || item.title || property;
    this.path = [...this.path, {property, title, item, type}];
  }

  gotoPathItem(index: number) {
    this.path = this.path.slice(0, index + 1);
  }
}