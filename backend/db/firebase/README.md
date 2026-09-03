# FLOW Firebase Data Layer

Firebase is the persistence platform for the current FLOW architecture.

- Firebase Authentication: identity, login, verification and password recovery.
- Firestore: application and social data.
- Cloud Storage: media and documents.
- Cloud Messaging: notifications.
- App Check: abuse protection.

The backend remains the trust boundary for critical business rules, payments, rewards, moderation and marketplace operations.

Firestore collections are defined as TypeScript contracts under `schemas/` and indexed through `indexes/`.
