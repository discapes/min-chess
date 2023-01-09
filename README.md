# minchess

This app uses a fork of Stockfish (https://github.com/hi-ogawa/Stockfish) that compiles to WebAssembly with Emscripten.
Readymade binaries are in the npm package `stockfish-nnue.wasm`, and the `postinstall` npm script copies `stockfish.wasm`, `stockfish.worker.js` and `stockfish.js` from there into `static/`. Then, after including `stockfish.js` in the html, we can use the global function `Stockfish()` which initializes the engine.

Two headers required for stuff like SharedArrayBuffer and web workers are set in vercel.json (and vite.config.ts for development).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
