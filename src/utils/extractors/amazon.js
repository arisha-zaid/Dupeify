export function extractAmazonProduct() {
  const title =
    document.querySelector("#productTitle")?.innerText?.trim() ||
    document.querySelector("#titleSection h1")?.innerText?.trim() ||
    document.querySelector("#title")?.innerText?.trim() ||
    document.title
      .replace(/\s*-\s*Amazon\.(com|in|co\.uk|ca)\s*$/i, "")
      .trim() ||
    "";

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
    image,
    aboutThisItem,
    details,
    url: window.location.href,
  };
}