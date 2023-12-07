import { css } from "lit";

const modelViewerItemCss = css`
    :host {
      --item-line-color: var(--color-brand-base);

      --button-border-color: var(--item-line-color);
      --button-hover-color: var(--color-brand-a10);
      --button-font-size: var(--font-size-sm);
      --button-inline-size: 100%;
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
    
    .txt--property {
      font-weight: 600;
      text-align: start
    }

    .txt--required {
      color: var(--color-error);
    }
`;

export default modelViewerItemCss;