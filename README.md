# Front/SaaS

[Open the pattern library](https://front-saas-library.vercel.app).

Explore twelve interactive interface patterns for SaaS projects. Browse the four collections, open a card to try the live example and copy the HTML into your own page. Search works across all collections. Each pattern has its own visual treatment.

| Collection   | Patterns                                                 |
| ------------ | -------------------------------------------------------- |
| Data display | Activity pulse, member directory, release timeline       |
| Billing      | Plan calculator, invoice slip, storage allowance         |
| Onboarding   | First project, setup checklist, workspace tour           |
| Settings     | Notification settings, reading preferences, working days |

## Use an example

1. Open a card with a click, tap or Enter. Use **Mobile** to narrow the live preview and **Reset** to start again.
2. Select **Code** to inspect the source or **Copy HTML** to copy it. The same HTML, CSS and JavaScript power the card thumbnail and the interactive preview.
3. Paste the snippet into the body of a plain HTML document. Two copies on the same page operate independently. The examples use native controls, browser APIs and local sample data. The release timeline works with native HTML disclosure elements alone.

No library, remote assets, account or API key is required for a copied example. Paste as document source; scripts inserted through `innerHTML` do not execute. If your framework manages the DOM, connect the behavior in its component lifecycle. Supply your own persistence or billing backend for production use. Move inline styles and scripts to approved assets on sites with a restrictive content security policy.

## Run the catalog

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The catalog uses TypeScript and Vite. Each entry in `src/catalog.ts` combines markup from `patterns/`, shared styling in `patterns/base.css` and its matching file in `patterns/themes/`. The dialog and card previews run the examples in sandboxed frames. Direct links to patterns keep the original URL fragments. Deploy the compiled `dist/` directory.

## License

The code and examples are available under the [MIT License](LICENSE). Keep its notice when redistributing a substantial part of a snippet. The library interface uses the self-hosted Work Sans typeface under its [SIL Open Font License](public/fonts/OFL.txt). Copied patterns use system typefaces.
