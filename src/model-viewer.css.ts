import { css } from "lit";

const modelViewerCss =  css`
  :host {
    border: var(--line-base) solid var(--color-brand-a40);
    padding: var(--space-md);
    display: block;
    border-radius: var(--radius-base);
    font-size: var(--font-size-sm);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }
`;

export default modelViewerCss;