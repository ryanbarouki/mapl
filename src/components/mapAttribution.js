export function collapseMobileAttribution({ target: map }) {
  if (!window.matchMedia('(max-width: 700px)').matches) return;

  const attribution = map.getContainer().querySelector('details.maplibregl-compact-show');
  if (attribution) {
    attribution.open = false;
    attribution.classList.remove('maplibregl-compact-show');
  }
}
