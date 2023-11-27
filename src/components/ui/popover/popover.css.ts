import { css } from "lit";

const popoverCss = css`
    /* Reset */
    :host {
        font-family: var(--font-family-base);
        font-size: var(--font-size-base);
        line-height: var(--line-height-base);
        box-sizing: border-box;
        text-align: start;
    }

    :where(*, ::before, ::after) {
        box-sizing: border-box;
    }

    /* Component */
    :host {
        box-shadow: var(--drop-shadow-level2);
        border: 0;
        border-radius: var(--radius-base);
        inset: unset;
        margin-top: var(--space-xs);
        padding: var(--space-sm);
        position: absolute;
        transition: var(--duration-base);
    }

    :host::backdrop {
      background-color: rgba(0 0 0 / 5%);
        transition: var(--duration-base);
    }
`;

export default popoverCss;