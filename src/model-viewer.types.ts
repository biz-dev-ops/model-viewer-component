export type PathItem = {
    item: ModelItem;
    property: string;
    title: string;
    type: string | undefined;
};

export type ModelItem = {
    title: string;
    type: string;
    properties: {[key: string]: ModelItem};
    oneOf: ModelItem[];
    items: ModelItem;
    required: string[];
    description: string;
    [key: string]: any
}