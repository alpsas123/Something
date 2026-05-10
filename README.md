# Tiny Interactive Prom Desk

A phone-friendly interactive prom ask site with:
- cozy study desk theme
- LEGO heart mini interaction
- baseball and Uncrustables details
- reveal popup
- EmailJS support when she clicks yes

## Files

- `index.html`
- `style.css`
- `script.js`

## GitHub Pages

1. Create a new GitHub repository.
2. Upload these files into the main/root folder.
3. Go to repository Settings.
4. Go to Pages.
5. Set source to deploy from the main branch.
6. Open the GitHub Pages URL on your phone and test it.

## EmailJS Setup

EmailJS lets a static website send email without your own backend.

1. Make an EmailJS account.
2. Connect your email service.
3. Create an email template.
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

## Testing

Keep `EMAIL_ENABLED = false` while testing the design.

Turn it to `true` only after the site looks right and your EmailJS template is ready.
