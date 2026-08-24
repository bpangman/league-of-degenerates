# Banner photo sources

The three panels in `three-faces-of-tony.jpg` use archival photographs of the actual
historical figures. No image of any league member is used or altered.

| Panel | Subject | Photographer | License | Commons file |
|---|---|---|---|---|
| Josef Loffalin | Joseph Stalin | Ivan Shagin | Public domain | `Joseph Stalin official portrait.jpg` |
| Adolf Loffler | Adolf Hitler | Heinrich Hoffmann | CC0 | `Adolf Hitler 1933.jpg` |
| Tony Jong Un | Kim Jong Un | Alexei Nikolsky, Presidential Press and Information Office | CC BY 4.0 | `Kim Jong-un April 2019 (cropped).jpg` |

The CC BY 4.0 photo requires attribution, which is printed in the credit line at the
bottom of the banner image itself. Keep that line if you re-render.

The Hitler source is a period postcard. It is cropped to head and shoulders so the
swastika lapel pin and the German caption are excluded. If you re-crop, keep them out.

## Regenerating
    node _src/banner/bshot.js /abs/path/to/_src/banner/banner.html /abs/path/to/three-faces-of-tony.jpg
Renders at 1200x806 CSS pixels, 2x scale, JPEG q90.
