export interface ModelItem {
    title: string;
    type: string;
    properties: {[key: string]: ModelItem};
    oneOf: ModelItem[];
    items: ModelItem;
    required: string[];
    description: string;
    [key: string]: any
    
}

export class ModelItemDecorator {
    item: ModelItem;
    title: string;
    property: string;
    required: boolean;

    constructor(item: ModelItem, property?: string, required?: boolean) {
        this.item = item;
        this.property = property || "";
        this.title = item.title || this.property;
        this.required = required || false;
    }

    isChildRequired(property: string) {
        return this.item.required?.includes(property);
    }

    type() : string {
        if(this.item.type == 'object' || this.item.properties) {
            return 'object';
          } else if(this.item.type == 'string') {
            return 'string';
          } else if(this.item.type == 'number') {
            return 'number';
          } else if(this.item.type == 'integer') {
            return 'integer';
          } else if(this.item.type == 'boolean') {
            return 'boolean';
          } else if(this.item.type == 'array' || this.item.items) {
            return 'array';
          } else if(this.item.oneOf) {
            return 'oneOf';
          }
      
          throw new Error("Unknow item type.");
    }
}

export interface ItemSelected {
  property: string;
  item: ModelItem;
}

export interface PathChanged {
  index: number
}