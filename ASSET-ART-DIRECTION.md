# Campaign visual assets

## Direction and selection

Step 1 remains the visual master and was not edited. Its approved residence image informed two original generated photographs: a closer diagnostic exterior and an open-door continuation for Thank You. Both were inspected against the Step 1 image before selection.

The accepted treatment uses gray stone, dark walnut, restrained champagne practical lighting, navy dusk, and a quiet ivory interior. The images are illustrative campaign environments, not evidence of a client property or results. Architectural material and lighting continuity is intentional; generated details are not a claim of exact surveyed architectural continuity.

Only two photographic compositions were needed. No new logo, stock person, fake interface, baked label, or raster icon was added. Lead paths, nodes, framing and labels remain editable HTML, CSS and SVG. The imagegen skill guided reference-based generation and the acceptance check against Step 1. The original PNGs are excluded from this lightweight production package.

## Production files

| Asset | Dimensions | Bytes |
| --- | --- | --- |
| assets/images/real-estate/diagnostic/dusk-residence-diagnostic-1536.webp | 1536 x 1024 | 323774 |
| assets/images/real-estate/diagnostic/dusk-residence-diagnostic-960.webp | 960 x 640 | 149408 |
| assets/images/real-estate/diagnostic/dusk-residence-diagnostic-640.webp | 640 x 427 | 72194 |
| assets/images/real-estate/thank-you/open-door-next-chapter-1122.webp | 1122 x 1402 | 173786 |
| assets/images/real-estate/thank-you/open-door-next-chapter-640.webp | 640 x 800 | 70514 |

Responsive srcset selects smaller files for narrow screens. The diagnostic photograph uses a right-aligned cover crop to keep its doorway visible. Its registered source focal point is x=65%, y=52%; the SVG maps this through the rendered cover geometry. Thank You keeps the existing image treatment and motion code.

## Full generation prompt: diagnostic exterior

```text
Use case: photorealistic-natural.
Asset type: 3:2 landscape photograph for real-estate campaign diagnostic page, intended for later HTML labels.
Input image 1 is the exact residence and commissioned-shoot reference, not a generic style inspiration.
Primary request: Photograph this SAME residence from a slightly reframed viewpoint in the same dusk shoot. Preserve its gray ashlar stone facade and lighter stone entry portal, flat dark low roof lines, champagne warm interior, tall dark walnut front door with narrow black-framed glazing, warm sconces, native landscaping and slab stone approach. Architectural identity must remain clearly the same.
Composition: landscape 3:2, level architectural editorial camera, entrance focal center approximately 62 percent from left and 52 percent from top. Quiet shadowed landscape space on LEFT for later HTML labels; clear stone forecourt across lower third. A little closer than reference but keep entrance, upper story and contextual roof legible.
Lighting: restrained deep navy dusk sky with natural cloud detail; warm champagne interior and practical sconces. Photorealistic stone texture, real walnut grain, controlled highlights, believable shadows and exposure.
Constraints: one full-frame photograph, no text, no UI, no people, no icons, no graphic lines, no diagrams, no logos, no signage, no watermarks. No unrelated new house, no neon, no fake sky, no overprocessed HDR.
```

## Full generation prompt: Thank You doorway

```text
Use case: photorealistic-natural.
Asset type: portrait 4:5 campaign continuation photo for a real-estate confirmation page.
Input image 1 is the exact residence identity and same commissioned shoot reference. Input image 2 is only the closer doorway composition and ivory interior reference; do not include its keys or blank card.
Primary request: Create a new close architectural editorial photograph at the SAME residence's stone and walnut doorway, now opening toward a restrained ivory interior. Preserve the gray stone surround, dark walnut door, slim black-framed glazing, champagne lighting, and same architectural material language. It should feel like walking up to the entrance shown in image 1 during the same dusk session.
Composition: portrait 4:5. View from just outside the threshold, slightly oblique; open walnut door and its natural grain legible at right, restrained ivory hallway visible through the opening, a modest edge of deep navy dusk and landscaping visible at left. Clear welcoming spatial depth, straight architectural verticals.
Lighting: photorealistic controlled practical warm light, subdued champagne rather than orange, stone and wood surface texture, deep navy dusk at exterior edge, realistic exposure with no clipped highlights.
Constraints: one full-frame photograph, no people, no keys, no cards, no signage, no text, no UI, no logos, no watermarks, no icons or graphic overlays. No neon, no fake sky. Keep the architectural identity of image 1.
```
