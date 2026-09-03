# In Faith Birth Support

A warm, faith-centered website for a birth-support / doula practice offering
emotional and physical support to mothers **before, during, and after** birth.

- Multi-page site: **Home · About · Services · Book a Consultation**
- Services featured: **Labor & birth doula**, **Prenatal support**, **Postpartum care**
- A **booking / consultation request** flow that saves submissions locally
- Calming palette (sage · cream · dusty rose), elegant serif headings, soft homely shapes
- Fully responsive, accessible, with gentle scroll animations
- **Zero dependencies** — just Node.js. Nothing to `npm install`.

## Run it

```bash
cd "in-faith-birth-support"
npm start          # or: node server.js
```

Then open **http://localhost:4040**

Change the port with an env var if you like: `PORT=5000 node server.js`

## How the booking form works

The "Book a free consultation" form posts to `POST /api/consultation`. Each
request is appended to `data/consultations.json` (created automatically on the
first submission) and logged to the server console. There's no email account or
third-party service wired in, so nothing leaves your machine.

To receive submissions by email instead, replace the `saveConsultation` step in
[`server.js`](server.js) with a call to an email service (e.g. Nodemailer, Resend,
or a form provider like Formspree).

## Make it yours

Search-and-replace these placeholders with the real details:

| Placeholder | Where | Replace with |
| --- | --- | --- |
| `[Your Name]` | `public/about.html` | The doula's / founder's name |
| `hello@infaithbirthsupport.com` | all pages (footer + contact) | Real email |
| `(000) 000-0000` / `tel:+10000000000` | all pages | Real phone |
| `[Your City]` | all pages | Your service area |
| Social links (`href="#"`) | footers | Instagram / Facebook URLs |
| Prices in `public/services.html` | Services page | Your real pricing |
| Testimonials in `public/index.html` | Home page | Real client quotes (with permission) |

### Add real photos

The site currently uses tasteful illustrated placeholders (`.photo-ph`). To drop
in real photography, replace the `<div class="photo-ph">…</div>` blocks with an
`<img>` — for example:

```html
<img src="/images/hero-mother.jpg" alt="A mother holding her newborn" />
```

Put image files in `public/images/`. The hero and service frames are already
shaped and styled to crop photos nicely.

## Project structure

```
in-faith-birth-support/
├── server.js              # tiny zero-dep static server + /api/consultation
├── package.json
├── README.md
├── data/                  # consultations.json is written here at runtime
└── public/
    ├── index.html         # Home
    ├── about.html         # About / the doula's story
    ├── services.html      # Services, packages & FAQ
    ├── contact.html       # Booking / consultation request
    ├── 404.html
    ├── css/styles.css     # full design system
    └── js/main.js         # nav, scroll reveal, form handling
```

---

Made with love & prayer. 🤍
