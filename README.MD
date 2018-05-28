# PMG Backend

## Cableado

- task runner: npm
- compiler: Typscript
- watcher: when .ts or view is modify > compile tsc (watching) and move files to dist folder > then nodemon reload the server.
  - server-side: nodemon with config file
  - compiler: tsc --watch with config file

## Enviromental variables

- NODE_ENV
- DOMAIN
- SESSION_SECRET
- SECRET_SESSION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- DEBUG
- MONGODB_LOCAL
- APP_SECRET: utilizado para firmar JWT

## Tecnologies

- Node.js
- Express
- Typescript
- MongoDB
- GraphQL
- AWS S3