import { extractAmazonProduct } from "../utils/extractors/amazon";

export const config = {
  matches: ["*://*.amazon.com/*", "*://*.amazon.in/*", "*://*.amazon.co.uk/*", "*://*.amazon.ca/*"]
};

const shouldWaitForDom = () =>
  !document.querySelector("#productTitle") &&
  !document.querySelector("#titleSection h1") &&
  !document.querySelector("#title");

const runAmazonContentScript = () => {
  const product = extractAmazonProduct();

  console.log("[Amazon content script]", product);

  if (chrome?.storage?.local) {
    chrome.storage.local.set({
      currentProduct: product,
    });
  }
};

const start = () => {
  if (!shouldWaitForDom()) {
    runAmazonContentScript();
    return;
  }

  let attempts = 0;

  const poll = () => {
    attempts += 1;

    if (!shouldWaitForDom() || attempts >= 5) {
      runAmazonContentScript();
      return;
    }

    setTimeout(poll, 800);
  };

  poll();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

export default function AmazonContent() {
  return null;
}