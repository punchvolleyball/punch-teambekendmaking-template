## Template for a Punch teambekendmaking Node.js application written in TypeScript connected to Firebase

To copy this template:

### Setup firebase
- Create a new firebase project.
- Create a realtime database and import `example-database.json`.
- Change the `databaseURL` in `FireBaseHelper.ts` to `https://<project-name>.firebaseio.com/`
- Add a webapp to firebase in the console
- Go to `settings --> Service accounts --> Firebase Admin SDK --> Generate new private key` to download your `serviceAccountKey.json`
- Paste the contents to `serviceAccountKey.json` in your project (note that this is .gitignored).

### Development

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Building a container

```bash
docker build .
```
