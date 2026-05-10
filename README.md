# Tiny Interactive Prom Desk v2

This is a GitHub Pages friendly prom ask site.

## What changed in v2

- nicer phone-style layout
- intro screen
- Block Blast inspired mini-game
- cozy desk LEGO heart mini-game
- baseball and Uncrustables interactions
- final prom popup
- EmailJS hook when she clicks yes

## Files

Upload these to the root of your GitHub repo:

- `index.html`
- `style.css`
- `script.js`

## GitHub Pages

1. Create a GitHub repo.
2. Upload the three files.
3. Go to Settings.
4. Go to Pages.
5. Deploy from your main branch.
6. Test the Pages link on your phone.

## EmailJS Setup

1. Make an EmailJS account.
2. Connect your email service.
3. Create a template.
4. Add these template variables:
   - `{{to_name}}`
   - `{{answer}}`
   - `{{message}}`
   - `{{time}}`
5. In `script.js`, replace:
   - `YOUR_PUBLIC_KEY`
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`
6. Change:
   - `const EMAIL_ENABLED = false;`
   to:
   - `const EMAIL_ENABLED = true;`

## Suggested EmailJS Template

Subject:
Neele said yes :)

Body:
{{message}}

Answer: {{answer}}
Time: {{time}}

## Testing note

Leave `EMAIL_ENABLED` as `false` until the whole website looks right.
