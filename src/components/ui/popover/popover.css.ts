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
    button {
        cursor: pointer;
    }

    [popover] {
        box-shadow: var(--drop-shadow-level2);
        border: 0;
        border-radius: var(--radius-base);
        inset: unset;
        color: var(--color-text);
        font-family: var(--font-family-base);
        font-size: var(--font-size-sm);
        font-weight: initial;
        line-height: var(--line-height-base);
        margin-top: var(--space-xs);
        padding: var(--space-sm);
        position: absolute;
        pointer-events: none;
        transition: var(--duration-base);
    }

    [popover]::backdrop {
        pointer-events: none;
        background-color: rgba(0 0 0 / 5%);
        transition: var(--duration-base);
    }
`;

export default popoverCss;