# Happy UI Sync

This Figma plugin helps sync design and code.

Export local styles from your figma project to your project repository

## How to use

![Demo](doc/happy-ui-sync-demo.gif)

### Requirements

- A Github account with access to the repo you want to be able to edit
- [a personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for that github account

#### Formats to use for designers and devs

##### Local styles format in Figma

Define colors in "Local Styles > Color Styles"

Examples :

- "Primary / 700"
- "Primary / 300"
- "Primary / 100"
- "Color Name / Variant"

Rules :

- The color name and variant must be separated by the following characters " / " (don't forget the space before and after)
- Use Figma "Solid" type for colors

#### Variables format in code

For now, this plugin only handles json format.

- All color names are camelcased.
- Colors are stored in rgba format

```json
// colors.json
{
  "primary": {
    "300": "rgba(223, 242, 240, 1)",
    "500": "rgba(165, 240, 245, 1)",
    "700": "rgba(82, 203, 242, 0.58)"
  },
  "secondary": {
    "300": "rgba(229, 231, 250, 1)",
    "500": "rgba(165, 175, 251, 1)",
    "700": "rgba(105, 121, 248, 1)"
  },
  "gray": {
    "100": "rgba(255, 255, 255, 1)",
    "200": "rgba(247, 245, 249, 1)",
    "300": "rgba(235, 234, 237, 1)",
    "500": "rgba(207, 201, 214, 1)",
    "700": "rgba(62, 51, 85, 1)",
    "900": "rgba(25, 4, 29, 1)"
  },
  "error": {
    "100": "rgba(251, 228, 232, 1)",
    "500": "rgba(253, 175, 187, 1)",
    "900": "rgba(255, 100, 124, 1)"
  },
  "success": {
    "100": "rgba(213, 242, 234, 1)",
    "500": "rgba(125, 223, 195, 1)",
    "900": "rgba(0, 196, 140, 1)"
  }
}
```

## Installation & development

### 1) Build

To build the plugin

```
    yarn
    yarn build
```

### 2) Add the plugin to your Figma desktop app

Then open your Figma desktop app, in the menu, select "Plugin > Development > New Plugin".

In the "Create a plugin" console, choose "Link existing plugin" and select the manifest.json from this folder.

Then you can open the plugin from the Menu "Plugin > Development".

Use the "Open console" from "Plugin > Development" to debug

### Build the plugin in dev mode

```bash
    yarn
    yarn start
```

This starts a watch process so you can edit the code. The figma plugin installed will update automatically when you run it again.
