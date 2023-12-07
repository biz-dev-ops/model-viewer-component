import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import { ItemSelected, ModelItem } from "../../model-viewer.types";
import modelViewerItemCss from "./model-viewer-item.css";

export abstract class ModelViewerItem extends LitElement {
    @property({ type: Object }) item!: ModelItem;
    @property({ type: String }) property!: string;
    @property({ type: String }) override title!: string;
    @property({ type: Boolean }) required!: boolean;

    protected _handleItemSelection() {
        this.dispatchEvent(new CustomEvent<ItemSelected>('itemSelected', { detail: { property: this.property, item: this.item } }));
    }
    
    static override get styles() {
        return [ modelViewerItemCss ];
    }
}