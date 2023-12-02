import { TemplateResult } from "lit";
import { ItemSelected, ModelItemDecorator } from "../../model-viewer.types";
import { ModelViewerItemArray } from "../../components/model-viewer-item/model-viewer-item-array";
import { ModelViewerItemBoolean } from "../../components/model-viewer-item/model-viewer-item-boolean";
import { ModelViewerItemObject } from "../../components/model-viewer-item/model-viewer-item-object";
import { ModelViewerItemObjectProperties } from "../../components/model-viewer-item/model-viewer-item-object-properties";
import { ModelViewerItemOneOf } from "../../components/model-viewer-item/model-viewer-item-oneof";
import { ModelViewerItemValue } from "../../components/model-viewer-item/model-viewer-item-value";

const builders: ((decorated: ModelItemDecorator,  itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, root: boolean) => TemplateResult)[] = [
    ModelViewerItemArray.build,
    ModelViewerItemBoolean.build,
    ModelViewerItemObject.build,
    ModelViewerItemObjectProperties.build,
    ModelViewerItemOneOf.build,
    ModelViewerItemValue.build
];
export class ModelItemBuilder {
    
    static build(decorated: ModelItemDecorator,  itemSelectedDelegate: (event: CustomEvent<ItemSelected>) => void, root: boolean) : TemplateResult | TemplateResult[] {
        return builders.map(build => build(decorated, itemSelectedDelegate, root));
    }
}