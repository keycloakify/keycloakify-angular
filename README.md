<p align="center">
    <img src="https://github.com/user-attachments/assets/f469232b-5193-4bcd-91c4-6228d48dbe7e">  
</p>
<p align="center">
    <i>🔏 Angular Component Library for Keycloakify 🔏</i>
    <br>
    <br>
    <a href="https://github.com/keycloakify/keycloakify-angular/actions">
      <img src="https://github.com/keycloakify/keycloakify/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://www.npmjs.com/package/@keycloakify/angular">
      <img src="https://img.shields.io/npm/dm/@keycloakify/angular">
    </a>
    <a href="https://github.com/keycloakify/keycloakify/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@keycloakify/angular">
    </a>
    <p align="center">
      Check out our discord server!<br/>
      <a href="https://discord.gg/mJdYJSdcm4">
        <img src="https://dcbadge.limes.pink/api/server/kYFZG7fQmn"/>
      </a>
    </p>
    <p align="center">
        <a href="https://www.keycloakify.dev">Home</a>
        -
        <a href="https://docs.keycloakify.dev">Documentation</a>
        -
        <a href="https://storybook.keycloakify.dev">Storybook</a>
        -
        <a href="https://github.com/keycloakify/keycloakify-starter-angular">Starter project</a>
        -
        <a href="https://github.com/keycloakify/keycloakify-starter-angular-vite">Starter project (Vite)</a>
    </p>
</p>

## Using the library

```bash
npm install keycloakify @keycloakify/angular
```

or using yarn:

```bash
yarn add keycloakify @keycloakify/angular
```

## Developing the library

If you want to make changes to the library make sure to follow these steps to setup your local environment.

### In the library:

1. Run `ng build` (preferably in watch mode)
2. `cd dist`
3. `npm link`

### In the starter:

1. You need to make configurations in `angular.json`:
    - **Firstly**, make sure that `preserveSymlinks` is set to `true`:
        ```json
        "preserveSymlinks": true
        ```
    - **Secondly**, disable caching under `cli`:
        ```json
        "cli": {
          "cache": {
            "enabled": false
          }
        }
        ```
2. Run `npm link @keycloakify/keycloakify-angular`
3. `ng serve`

You are good to go 🚀
