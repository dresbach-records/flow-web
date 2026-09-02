# FLOW Web

A modern social network experience combining For You, Following, Stories, Shorts, Explore, Profiles, Messaging, Communities and content creation.

## Frontend

React + TypeScript + Vite. Frontend-only architecture with local mock persistence and service contracts prepared for future APIs.

## Development

```bash
npm install
npm run dev
npm run build
```

## Deployment

Designed for Vercel with Vite: build command `npm run build`, output directory `dist`.

## Product principles

- Home opens directly on For You.
- Social interactions are functional in local state.
- Login, registration and password recovery work locally without a real database.
- No backend is required for the current prototype.
- For You uses partial local mock ranking and interaction signals.
