# Front/SaaS

A small library of interactive patterns for SaaS product teams. Try each component with a keyboard, switch between desktop and mobile widths, and copy a complete working example into your project.

| Pattern | What you can try |
| --- | --- |
| Member directory | Search names and roles, filter invited members, and see the visible count. |
| Plan calculator | Compare monthly and annual prices across seat counts. |
| First project | Create the first item in an empty workspace. |
| Setup checklist | Complete or undo steps and follow progress. |
| Usage meter | Preview normal, near-limit and full-capacity states. |
| Notification settings | Edit preferences, save them or discard an unsaved change. |

## Use a component

Choose a pattern and select **Copy HTML**. Paste the snippet into the body of an HTML document and open it in a browser. It includes its HTML, scoped CSS, JavaScript and MIT notice. The same source powers the preview and the code tab. No package installation, account, external assets or API keys are needed to run a copied snippet.

Each instance handles events inside its own root, so copies can coexist. Paste snippets as document source. Scripts added with `innerHTML` are not executed by browsers. For frameworks that control rendering, move the behavior into the component lifecycle. For sites with a strict script policy, move the script and styles to your approved asset pipeline. The examples use in-memory sample data; storage, checkout and backend actions should be wired to your application.

## Run the library

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The library is built with TypeScript, Vite, the browser Clipboard API and sandboxed iframes. `src/catalog.ts` binds each entry to its standalone example in `patterns/`. Common styling is included in every copy. `src/main.ts` implements search, hash navigation, viewport controls and clipboard feedback. The production output is `dist/`.

## Origin and license

The catalog, interface, shared CSS, icons, sample data and all six patterns were written for this library. It uses no code or imagery from the earlier private prototype. The source and the copied examples are available under the [MIT License](LICENSE). Keep the notice when redistributing the software or a substantial part of a snippet. Vite and TypeScript are build-time dependencies with their own licenses.
