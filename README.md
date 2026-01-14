# How to work with these files

## Requirements

* Node/NPM

## Getting Started
### 1 - Installing NPM

*Please skip this step if you already have NPM installed.*

Visit https://nodejs.org/en/ to download and install on your platform.

After install verify it worked by opening up a command line tool and enter this command:

```bash
npm -v
```

If you see a version number it has been installed correctly.

### 2 - Install Node Modules:

Open a command line tool, change directory to the project and enter this command:

```
npm install
```

## Get Working
### 1 - Start Vite Dev Server

Open a command line tool, change directory to the project and enter this command:

```
npm run dev
```

This will start the Vite dev server, build your assets, and launch a local development server with live reload.

You should see output indicating the server is running at http://localhost:8000

In a web browser, go to http://localhost:8000 to view the site.

**To stop server**: `ctl + c` on Windows and `cmd + c` on OSX. 

### 2 - Working with the Files

All your edits should be done in the `app` folder. Please do NOT edit anything in the `build` folder. Vite will build these files for you every time there is a change in the `app` folder.

#### Working with Pug

This project uses a HTML preprocessor called Pug (https://pugjs.org/api/getting-started.html). It uses a template and includes based system and is separated out into 3 different section.

1. Layout
2. Pages
3. Partials

There are also multiple variables that are being passed through the template that controls certain elements and colors.

#### 3rd Party Javascript
JavaScript is auto compiled into bundles. If the Vite process is running, adding a 3rd party plugin to the `app/assets/js/lib` folder will auto-include it in the build. You do **not** need to add it to the layout via a `script` tag.

---

## Additional Tasks

- **Build for production (no server):**
	```
	npm run build
	```

- **Lint SCSS styles:**
	```
	npm run lint:styles
	```
	This will check your SCSS for style issues using stylelint.

---

## Source Maps

Source maps for CSS and JS are generated automatically in the `build/assets/css` and `build/assets/js` folders to help with debugging.

---

## Troubleshooting

If you have permission errors with npm, try running your install/update commands with `sudo`.
