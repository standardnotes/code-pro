# Code Pro for Standard Notes

Code Pro is a [derived editor](https://standardnotes.org/help/77/what-are-editors) for [Standard Notes](https://standardnotes.org), a free, [open-source](https://standardnotes.org/knowledge/5/what-is-free-and-open-source-software), and [end-to-end encrypted](https://standardnotes.org/knowledge/2/what-is-end-to-end-encryption) notes app.

Code Pro is a code editor powered by the [Monaco Editor](https://microsoft.github.io/monaco-editor/) (Visual Studio Code). It is meant for writing Markdown and 60 other programming languages.

Code Pro is not meant to be used on mobile devices.

## Features

- Syntax highlighting for Markdown and more than 60 other programming languages
  - Languages supported: abap, aes, apex, azcli, bat, c, cameligo, clojure, coffeescript, cpp, csharp, csp, css, dart, dockerfile, fsharp, go, graphql, handlebars, hcl, html, ini, java, javascript, json, julia, kotlin, less, lexon, lua, markdown, mips, msdax, mysql, objective-c, pascal, pascaligo, perl, pgsql, php, plaintext, postiats, powerquery, powershell, pug, python, r, razor, redis, redshift, restructuredtext, ruby, rust, sb, scala, scheme, scss, shell, sol, sql, st, swift, systemverilog, tcl, twig, typescript, vb, verilog, xml, yaml
- Autocompletion
- Intelligent autocompletion for CSS, JavaScript, JSON, Less, Handlebars, HTML, Razor, SCSS, and TypeScript
- Sophisticated search and replace
- Prettier formatting for CSS, GraphQL, Markdown, HTML, JavaScript, Less, TypeScript, Sass, and Yaml. Built-in formatting for JSON.
- Settings: language, font size, tab size (`2` or `4`), theme (light, dark, high contrast, or SN themed), and word wrap (`on`, `off`, and `bounded`)
- Per-note settings
- Buttons to save and load default settings

## Keyboard Shortcuts

Perform these shortcuts with the editor

| Action                                                          | Shortcut                                         |
| :-------------------------------------------------------------- | :----------------------------------------------- |
| Toggle word wrap between `on` and `off` (bounded is unaffected) | <kbd>Alt</kbd> + <kbd>Z</kbd>                    |
| Format code with Prettier^                                      | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> |
| Toggle Tab Key Moves Focus (vs tab spacing)                     | <kbd>Ctrl/⌘</kbd> + <kbd>M</kbd>                 |

^ For CSS, GraphQL, Markdown, HTML, JavaScript, Less, TypeScript, Sass, and Yaml. Some languages, such as JSON, have built-in formatters.

Each time the editor refreshes (e.g., toggling word wrap, formatting code), the editor remembers your position (line number and column) and centers it on the screen if it's not already in focus.

## Settings

The settings for each note are saved automatically after they are changed. Loading default settings will sync the note's settings with the default settings and save automatically.

### Themes

The Monaco Editor comes with three themes: `vs` (a white/light theme), `vs-dark` (a dark theme like the default theme for VS Code), and `hc-black` (a high contrast dark theme). There is also one more option: `sn-theme`. The `sn-theme` option takes either `vs` or `vs-dark` depending on your system theme and adjusts some of the colors (e.g., link colors) to match the theme. The `sn-theme` is still a work-in-progress.

## Development

**Prerequisites:** Install [Node.js](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/en/docs/install/), and [Git](https://github.com/git-guides/install-git) on your computer.

The general instructions setting up an environment to develop Standard Notes extensions can be found [here](https://docs.standardnotes.org/extensions/local-setup). You can also follow these instructions:

1. Fork the [repository](https://github.com/standardnotes/code-pro) on GitHub.
2. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) your fork of the repository.
3. Run `cd code-pro` to enter the `code-pro` directory.
4. Run `yarn install` to install the dependencies on your machine as they are described in `yarn.lock`.

### Testing in the browser

1. To run the app in development mode, run `yarn start` and visit http://localhost:3001. Press `ctrl/cmd + C` to exit development mode.

### Testing in the Standard Notes app

1.  Create an `ext.json` in the `public` directory. You have three options:
    1.  Use `sample.ext.json`.
    2.  Create `ext.json` as a copy of `sample.ext.json`.
    3.  Follow the instructions [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:3000/index.html"`.
2.  Install http-server using `sudo npm install -g http-server` then run `yarn server` to serve the `./build` directory at http://localhost:3000.
3.  To build the app, run `yarn build`.
4.  Install the editor into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app with `http://localhost:3000/sample.ext.json` or with your custom `ext.json`. Press `ctrl/cmd + C` to shut down the server.

### Deployment

1. To make the source code prettier, run `yarn pretty`.
2. To the deploy the build into the `gh-pages` branch of your repository on GitHub, run `yarn deploy-stable`.
3. To deploy the build into to the `dev` branch for testing, run `yarn deploy-dev`.
4. To deploy the built into the `build` branch for distributing, run `yarn deploy-build` for distributing builds.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
