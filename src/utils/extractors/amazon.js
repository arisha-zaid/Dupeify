export function cleanTitle(title) {
  if (!title) return "";
  
  let cleaned = title;

  // 1. Remove text in parentheses or square brackets (e.g. "[Packaging May Vary]", "(Pack of 1)")
  cleaned = cleaned.replace(/\s*[\[\(][^\]\)]*[\]\)]\s*/gi, " ");

  // 2. Remove sizes like 100ml, 3.4 oz, 3.4oz, 3.4 Fl Oz, 3.4 fl. oz., etc.
  cleaned = cleaned.replace(/\b\d+(?:\.\d+)?\s*(?:ml|oz|fl\.?\s*oz\.?|gram|g|fl|ounces|ounce)\b/gi, "");

  // 3. Remove patterns like "100 ml / 3.4 fl oz" or variations with slashes/dashes
  cleaned = cleaned.replace(/\s*[\/\-]\s*/g, " ");

  // 4. Remove common boilerplate words or phrases:
  const boilerplateRegex = /\b(?:eau\s+de\s+(?:parfum|toilette|cologne)|parfum|toilette|cologne|edp|edt|spray|perfume|cologne|for\s+men|for\s+women|unisex|gift\s*set|pack\s+of\s+\d+|vaporisateur|natural\s+spray|original|authentic|fragrance|scent|bottle|pack|pcs|pieces)\b/gi;
  cleaned = cleaned.replace(boilerplateRegex, "");

  // 5. Clean up multiple spaces and trailing spaces/punctuation
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  cleaned = cleaned.replace(/^[,.\-\s]+|[,.\-\s]+$/g, "").trim();

  return cleaned || title;
}

export function extractAmazonProduct() {
  const rawTitle =
    document.querySelector("#productTitle")?.innerText?.trim() ||
    document.querySelector("#titleSection h1")?.innerText?.trim() ||
    document.querySelector("#title")?.innerText?.trim() ||
    document.title
      .replace(/\s*-\s*Amazon\.(com|in|co\.uk|ca)\s*$/i, "")
      .trim() ||
    "";

  const title = cleanTitle(rawTitle);

  const image =
    document.querySelector("#landingImage")?.src ||
    document.querySelector("img[data-old-hires]")?.getAttribute("data-old-hires") ||
    document.querySelector("img#imgBlkFront")?.src ||
    "";

  const aboutThisItem = Array.from(
    document.querySelectorAll(
      "#feature-bullets ul li span.a-list-item, #feature-bullets li, #productFactsDesktop .a-list-item"
    )
  )
    .map((el) => el.innerText?.trim())
    .filter(Boolean);

  const details = Array.from(
    document.querySelectorAll(
      ".prodDetTable tr, #detailBullets_feature_div li, #productDetails_techSpec_section_1 tr"
    )
  )
    .map((row) => row.innerText?.trim().replace(/\s+/g, " "))
    .filter(Boolean);

  return {
    title,
    rawTitle,
    image,
    aboutThisItem,
    details,
    url: window.location.href,
  };
}