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

    dt {
      color: rgba(0 0 0 / 50%);
      font-weight: 600;
    }

    dd {
      margin-inline-start: 0
    }

    dd + dt {
      margin-block-start: 1em;
    }

    .icon--type {
      margin-inline-start: auto;
      font-size: var(--font-size-xs);
      background-color: var(--main-surface);
      border-radius: var(--radius-pill);
      align-self: center;
      padding: var(--space-xxs) var(--space-xs);
    }

    .icon--type em {
      font-style: normal;
      font-weight: 400;
    }

    .button-label {
      display: flex;
      column-gap: var(--space-xs);
    }

    .popover-control--info {
      background-color: var(--color-white);
      align-self: center;
      border: var(--line-base) solid var(--button-background-base);
      border-radius: var(--radius-circle);
      block-size: var(--font-size-base);
      cursor: pointer
      font-size: var(--font-size-xs);
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      text-decoration: none;
    }

    .popover-control--info abbr[title] {
      border: 0;
      line-height: 1em;
      text-decoration: none;
      font-weight: 600;
    }

    .txt--property {
      font-weight: 600;
      text-align: start
    }

    .txt--required {
      color: var(--color-error);
    }

    .list--one-of,
    .list--array {
      list-style: none;
      padding-inline-start: 0;
      display: flex;
      flex-direction: column;
      row-gap: var(--space-sm);
    }

    .list--one-of {

      row-gap: var(--space-xxs);
    }

    .list--one-of li {
      display: flex;
      flex-direction: column;
      position: relative;
      row-gap: var(--space-xxs);
    }

    .list--one-of li:not(:last-child)::after {
      content: 'OR';
      font-size: var(--font-size-xs);
      text-align: center;
      display: block;
      color: var(--color-black-a40);
      font-weight: 600;
    }

    .list--array li {
      position: relative;
    }
    
    .list--array li::before,
    .list--array li::after {
      content: '';
      position: absolute;
      inset-inline-start: calc(var(--space-sm) * -1);
      inset-block-start: calc(var(--space-sm) + var(--space-xxs));
    }

    .list--array li::before {
      background-color: var(--item-line-color);
      block-size: var(--line-thin);
      inline-size: var(--space-sm);
    }
    
    .list--array li::after {
      aspect-ratio: 1;
      background-color: var(--main-surface);
      block-size: .625rem;
      border-radius: var(--radius-circle);
      border: var(--line-thin) solid var(--item-line-color);
      transform: translateX(-.4375rem) translateY(-.25rem);
    }

    .list--array li:not(:first-child) {
      pointer-events: none;
    }

    :is(button:not([disabled])):is(:active, :hover, :focus-visible) + [popover] {
      border-color: var(--button-background-active)
    }

    .items {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .item--value {
      background-color: var(--color-black-a05);
      border-radius: var(--radius-half);
      padding: var(--space-sm);
    }

    .item--array {
      border-radius: var(--radius-half);
      border: var(--line-thin) solid var(--item-line-color);
      padding: var(--space-sm);
      padding-block-end: 0;
      margin-block-end: calc(var(--space-xs) * -1);
      mask-image: linear-gradient(to top, transparent var(--space-sm), black var(--space-xl));
      -webkit-mask-image: linear-gradient(to top, transparent var(--space-sm), black var(--space-xl));
    }
`;

export default modelViewerItemCss;