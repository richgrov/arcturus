# arcturus

The simple music player for simple people

# Setup

**Clone and install dependencies:**

```
git clone https://github.com/richgrov/arcturus
cd arcturus/
pnpm i
cd functions/ && pnpm i && cd ..
```

**Initialize Firebase**

If you already have a project:

`firebase use <project id>`

If you don't have a project:

- Sign in to <https://firebase.google.com/> and create a new project.
- This repository utilitizes Cloud Functions, so **you will need the Blaze plan**

**Setup project information**

If you haven't already, create a Web App for your Firebase project

Create `.env.local` file and include the following information from the web app config:

```
VITE_FIREBASE_PROJECT_ID=<project id>
VITE_FIREBASE_API_KEY=<project api key>
VITE_FIREBASE_STORAGE_BUCKET=<default project storage bucket>
```

# Testing and Deploying

**To test locally**

`pnpm run dev`

This will start Vite dev server, Firebase emulator, and recompile cloud functions. Note that while
the storage, Firestore, and functions emulators are used, the authentication emulator is **not**
used by default.

**Deploy**

`firebase deploy`
