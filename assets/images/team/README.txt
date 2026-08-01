TEAM PHOTOS — drop-in instructions
===================================

The team page (team.html) is already wired to auto-load a photo for every
member. You do NOT need to touch any code. Just save each person's photo in
THIS folder using the exact filename below.

- Format:   .jpg
- Shape:    square works best (shown in a square/rounded frame, cropped with
            object-fit: cover). ~600x600px is plenty.
- If a file is missing, that member automatically falls back to their
  initials placeholder — nothing breaks.

FILENAMES (must match exactly, all lowercase):

  madhav-pradeep.jpg        Madhav Pradeep        (Director)
  anfas-nujum.jpg           Anfas Nujum           (Founder & Advisory)
  aadil.jpg                 Aadil                 (Advisory Board)
  devanarayanan-v-s.jpg     Devanarayanan V S     (Advisory Board)

  nizam.jpg                 Nizam                 (Tenlink · Senior)
  ghanashyam.jpg            Ghanashyam            (Tenlink · Senior)
  anandhu.jpg               Anandhu               (Tenlink)
  aman-fathima.jpg          Aman Fathima          (Tenlink)
  dani.jpg                  Dani                  (Tenlink)
  maria.jpg                 Maria                 (Tenlink)
  mishal.jpg                Mishal                (Tenlink)
  parvathy.jpg              Parvathy              (Tenlink)
  prabhav.jpg               Prabhav               (Tenlink)

  ikram.jpg                 Ikram                 (Tensci · Senior)
  vijay.jpg                 Vijay                 (Tensci · Senior)
  sahal-m-k.jpg             Sahal M K             (Tensci)
  sauda.jpg                 Sauda                 (Tensci)
  sinan.jpg                 Sinan                 (Tensci)

  shejin.jpg                Shejin                (Tenment · Senior)
  harigovind.jpg            Harigovind            (Tenment)
  abinav.jpg                Abinav                (Tenment)
  mahadevan-sanju.jpg       Mahadevan Sanju       (Tenment)

After adding files, just refresh the page — the photos appear automatically.


thumbs/ — small avatars for the home page
=========================================

The three vertical cards on the home page show 38px circular avatars. Those
read from thumbs/<same-filename>.jpg at 76x76 (2x for retina), NOT from the
full-size photos above — the nine full-size files together are ~1.9 MB, which
is far too much to ship for nine tiny circles. The thumbs total ~18 KB.

thumbs/CROPS.json records the face position and crop size used for each one,
as fractions of the source image:

  face_x / face_y          where the face centre sits (0-1)
  side_frac_of_height      square crop side, as a fraction of image height

If you replace a source photo, regenerate its thumb and adjust those numbers
until the face is centred — a plain centre crop puts the face off-frame for
most of these, since they're wide shots rather than headshots.

If a thumb is missing, the avatar falls back to the member's initials.
