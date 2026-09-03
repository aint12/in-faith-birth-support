# In Faith Birth Support

A multi-page site for a doula practice — labor and birth support, prenatal care, and postpartum care — with a consultation request flow that captures inquiries without depending on a third-party form service.

Built to run on a single small server with nothing to install.

## Design decisions

**Zero dependencies.** `package.json` has no `dependencies` block. The server is Node's built-in `http` and `fs` modules — static file serving, MIME type resolution, and one POST endpoint. Nothing to `npm install`, no supply chain, no version drift on a site that will sit untouched for months at a time.

**Form submissions stay local.** `POST /api/consultation` appends each request to `data/consultations.json` and logs it. No Formspree, no Mailchimp, no third party holding client inquiries — which matters more than usual when the submissions are expectant mothers sharing due dates and health context. The handler is isolated so swapping in an email service is a single-function change.

**Design system in CSS custom properties.** The palette (sage, cream, dusty rose), type scale, and spacing live as variables at the top of `styles.css`. Restyling is one block, not a search across files.

**Progressive enhancement.** Scroll animations and nav behavior are additive — the site is fully readable and the form fully submittable with JavaScript disabled.

## Running it

```bash
npm start          # or: node server.js
```

Serves on port 4040. Override with `PORT=5000 node server.js`.

## Structure

```
server.js              # static server + POST /api/consultation
data/                  # consultations.json, created on first submission
public/
├── index.html         # home
├── about.html
├── services.html      # services, packages, FAQ
├── contact.html       # consultation request
├── 404.html
├── css/styles.css     # design system + all page styles
└── js/main.js         # nav, scroll reveal, form handling
```

## Scope and limits

- **Flat-file storage.** Appending JSON on each submission doesn't handle concurrent writes. Correct for the actual load; wrong past it.
- **No email notification.** Submissions land in a file and the server log — someone has to check. An email or SMS hook is the obvious next piece.
- **No admin view.** Reading submissions means reading the JSON.
- **Illustrated placeholders instead of photography.** The image frames are shaped and styled for real photos; the placeholders are stand-ins.
- **No tests.**
