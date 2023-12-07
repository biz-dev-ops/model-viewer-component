import { css } from "lit";

const modelViewerPathCss = css`
  :host {
    --item-line-color: var(--color-brand-base);

    --button-border-color: var(--item-line-color);
    --button-hover-color: var(--color-brand-a10);
    --button-font-size: var(--font-size-sm);
    --button-inline-size: 100%;
  }

  .list--path {
    --button-padding: var(--space-xs);

    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    list-style: none;
    margin: 0;
    padding-inline-start: 0;
  }

  .list--path li {
    display: flex;
    column-gap: var(--space-xs);
    align-items: center;
  }

  .list--path li:not(:last-child, .oneof)::after {
    content: ' /';
  }

  .list--path li.oneof .txt--property::after {
    content: ':';
  }

  .list--path li.oneof + .object button {
    margin-inline-start: calc(var(--space-xxs) * -1);
  }

  .list--path button {
    padding: var(--space-xs);
  }

  .list--path li > span {
    padding-block: calc(var(--line-base) + var(--button-padding));
  }
`;

export default modelViewerPathCss