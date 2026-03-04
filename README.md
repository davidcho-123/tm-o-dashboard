# TM&O Dashboard - Ready to Deploy

This is a trimmed Next.js + TypeScript project packaged for you. The AI features (`generateOptimizedDailySchedule` and `parseNaturalDate`) are implemented as **local stubs** so the site runs without any API keys.

How to run locally:
1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

How to deploy to Vercel:
- Go to https://vercel.com/new
- Import this repository or drag-and-drop the project folder (or upload the zip).
- Vercel will run `npm install` and `npm run build` automatically.

Project name suggested: `tm-o-dashboard` (Vercel disallows `&` in names).

Notes:
- UI primitives are small local wrappers so the project runs without external UI libraries. Replace them with shadcn/ui components if you prefer the original library.
- If you want me to swap the stubs to call a real API (OpenAI or other), I can update the project to include backend endpoints next.
