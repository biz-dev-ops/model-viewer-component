import { css } from "lit";

const buttonCss = css`
    /* Reset */
    :host {
        all: unset;
        font-family: var(--font-family-base);
        font-size: var(--font-size-base);
        display: inline-block;
        line-height: var(--line-height-base);
        box-sizing: border-box;
        text-align: start;
    }

    :where(*, ::before, ::after) {
        box-sizing: border-box;
    }
    
    /* Component */
    :host {
        --_button-font-family: var(--button-font-family, var(--font-family-base));
        --_button-font-size: var(--button-font-size, var(--font-size-base));
        --_button-line-height: var(--button-line-height, var(--line-height-base));
        --button-hover-color: var(--color-brand-a10);
        --_button-padding-block: var(--button-padding-block, var(--button-padding, var(--space-sm)));
        --_button-padding-inline: var(--button-padding-inline, var(--button-padding, var(--space-sm)));
        --_button-inline-size: var(--button-inline-size, auto);
        --_button-border-color: var(--button-border-color, transparent);

        inline-size: var(--_button-inline-size);
    }

    button {
        align-items: center;
        background-color: transparent;
        border: var(--line-base) solid var(--_button-border-color);
        border-radius: var(--radius-half);
        column-gap: var(--space-xs);
        color: var(--button-text-color);
        cursor: pointer;
        display: flex;
        font-family: var(--_button-font-family);
        font-size: var(--_button-font-size);
        line-height: var(--_button-line-height);
        inline-size: var(--_button-inline-size);
        min-block-size: var(--space-lg);
        padding: var(--_button-padding-block) var(--_button-padding-inline);
        text-align: start;
        text-decoration: none;
        transition: all var(--duration-base);
    }

    button[disabled] {
        cursor: initial;
        pointer-event: none;
    }

    button span {
        flex: 1;
    }

    :is(button:not([disabled])):is(:active, :hover, :focus-visible) {
        background-color: var(--button-hover-color);
        color: var(--button-text-color-active);
    }

    /* Directional arrows */
    :host([direction="up"]) button::after,
    :host([direction="right"]) button::after,
    :host([direction="down"]) button::after,
    :host([direction="left"]) button::before {
      content: '';
      display: inline-block;
      border-color: currentColor;
      border-width:var(--line-thin) var(--line-thin) 0 0;
      border-style: solid;
      height: var(--space-xs);
      width: var(--space-xs);
      position: relative;
      top: calc(var(--space-xxs) / -2);
      justify-self: end;
      inset-block-start: .0625em;
      transition: transform var(--duration-base);
      transform-origin: 50% 50%;
      justify-self: flex-end;
    }
    
    :host([direction="up"]) button::after {
        inset-block-end: -.25em;
        transform: rotate(315deg);
    }
    
    :host([direction="right"]) button::after {
        transform: rotate(45deg);
        inset-inline-start: -.25em;
    }
    
    :host([direction="down"]) button::after {
        inset-block-start: -.25em;
        transform: rotate(135deg);
    }
    
    :host([direction="left"]) button::before {
        inset-inline-end: -.25em;
        transform: rotate(225deg);
    }
`;

export default buttonCss;