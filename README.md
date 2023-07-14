# Model Viewer for [md-docs](https://github.com/synionnl/md-docs-cli)

## Installation
`npm install --save @synion/model-viewer`

## Usage

- Add `model-viewer.js` to the webpage
- Add the model JSON to the global object `window.modelViewer `.
- Add the `<model-viewer></model-viewer>` to the page

## Attributes

### id

*Required*  
The id attribute identifies the property within the `window.modelViewer`. 


### name
*Optional*  
The name attribute is a human readable title fallback. Only used when the model doesn't provide a title.

## Example

```html
<script>
	window.modelViewer = window.modelViewer || {};
    window.modelViewer['trainset'] = {
    	...
    }
<script>
```

```html
<model-viewer id="trainset"></model-viewer>
```