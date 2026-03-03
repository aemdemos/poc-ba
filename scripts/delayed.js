/**
 * TypeSquare web font service integration for UD新ゴ fonts.
 * Loads Morisawa UD Shin Go R (body) and UD Shin Go DB (headings)
 * via TypeSquare CDN with dynamic character subsetting.
 */
function loadTypeSquareFonts() {
  const script = document.createElement('script');
  script.src = 'https://typesquare.com/accessor/script/typesquare.js?poHs51Pmtw8%3D';
  script.async = true;
  document.head.appendChild(script);
}

loadTypeSquareFonts();
