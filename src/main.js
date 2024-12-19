import { createElement, render } from "../micro-react";

const element = createElement(
  "h1",
  { id: "title", class: "hello", style: "color: red" },
  "hello world",
  createElement(
    "a",
    { href: "https:/bilibili.com", style: "color: yellow" },
    'bilibili'
  )
);

const container = document.querySelector("#root");
render(element, container);
console.log(element);
