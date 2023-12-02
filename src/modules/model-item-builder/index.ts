import { TemplateResult } from "lit";
import { ItemSelected, ModelItemDecorator } from "../../model-viewer.types";
import { ModelViewerItemArray } from "../../components/model-viewer-item/model-viewer-item-array";
import { ModelViewerItemBoolean } from "../../components/model-viewer-item/model-viewer-item-boolean";
import { ModelViewerItemObject } from "../../components/model-viewer-item/model-viewer-item-object";
import { ModelViewerItemOneOf } from "../../components/model-viewer-item/model-viewer-item-oneof";
import { ModelViewerItemValue } from "../../components/model-viewer-item/model-viewer-item-value";

const builders: ((decorated: ModelItemDecorator,  itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, collapse: boolean) => TemplateResult)[] = [
    ModelViewerItemArray.build,
    ModelViewerItemBoolean.build,
    ModelViewerItemObject.build,
    ModelViewerItemOneOf.build,
    ModelViewerItemValue.build
];
export class ModelItemBuilder {
    
    static build(decorated: ModelItemDecorator,  itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, collapse: boolean) : TemplateResult | TemplateResult[] {
        return builders.map(build => build(decorated, itemSelectedDelegate, collapse));
    }
}