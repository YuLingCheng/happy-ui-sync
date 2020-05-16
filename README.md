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

Local Styles > Color Styles:

"Primary / 700"
"Primary / 300"
"Color Name / Variant"

The color name and variant must be separated by the following characters " / " (don't forget the space before and after)

#### Variables format in code

For now, this plugin only handles json format.

- All color names are camelcased.
- Colors are stored in rgb format (rgba is not supported yet)

```json
// colors.json
{
  "primary": {
    "300": "rgb(238,223,242)",
    "500": "rgb(219,165,245)",
    "700": "rgb(190,82,242)"
  },
  "secondary": {
    "300": "rgb(229,231,250)",
    "500": "rgb(165,175,251)",
    "700": "rgb(105,121,248)"
  },
  "warning": {
    "300": "rgb(255,232,218)",
    "500": "rgb(255,199,166)",
    "700": "rgb(255,162,107)"
  },
  "info": {
    "100": "rgb(213,233,250)",
    "500": "rgb(102,181,248)",
    "900": "rgb(0,132,244)"
  },
  "error": {
    "100": "rgb(251,228,232)",
    "500": "rgb(253,175,187)",
    "900": "rgb(255,100,124)"
  },
  "success": {
    "100": "rgb(213,242,234)",
    "500": "rgb(125,223,195)",
    "900": "rgb(0,196,140)"
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
