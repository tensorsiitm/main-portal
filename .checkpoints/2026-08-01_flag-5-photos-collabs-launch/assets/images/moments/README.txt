MOMENTS PHOTOS - drop-in instructions
=====================================

The Moments strip shows one slide per <img> listed in index.html. There are
currently 18 slides, using these files:

  moment-01.jpg ... moment-11.jpg
  moment-13.jpg, moment-14.jpg
  moment-16.jpg ... moment-20.jpg

The numbering has gaps (12 and 15 were removed) and that is fine - the numbers
are just filenames, not positions. What matters is that every file here has a
matching <img> in the Moments section of index.html, and vice versa.

Notes:
- Format: .jpg  (lowercase, zero-padded: moment-01, not moment-1, and .jpg
  rather than .jpeg, so the whole set stays consistent)
- Any shape works - each is auto-cropped to a uniform slide (object-fit: cover)
- IMPORTANT: resize before adding. Phone photos are ~4000px / several MB each
  and will make the page slow. Export to about 1200-1600px on the long edge
  (~200-400 KB). That is plenty sharp for the strip.
- The order is randomised on every page load, so you do not need to sequence
  them.

TO SWAP A PHOTO
- Replacing one in place (same filename): just overwrite the file. No code
  change needed.
- Adding or removing one: the slide list in index.html has to change to match,
  otherwise a removed file leaves a broken <img> and an added file is never
  shown. Search index.html for "assets/images/moments/".

STILL OVERSIZED
moment-11, 13, 14, 16, 17 and 18 are still 4160px / 0.3-0.9 MB originals.
They work, but they are far larger than the strip needs and are the bulk of
this folder's weight. Worth re-exporting at ~1600px when convenient.
