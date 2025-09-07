# How to work with these files

## Requirements

* Node/NPM
* Grunt CLI

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
### 1 - Start Gulp Process

Open a command line tool, change directory to the project and enter this command:

```
gulp
```

This will start the Gulp default task, build your assets, and launch a local development server with live reload.

You should see output indicating the server is running at http://localhost:8000

In a web browser, go to http://localhost:8000 to view the site.

**To stop server**: `ctl + c` on Windows and `cmd + c` on OSX. 

### 2 - Working with the Files

All your edits should be done in the `app` folder. Please do NOT edit anything in the `build` folder. Gulp will build these files for you every time there is a change in the `app` folder.

#### Working with Pug

This project uses a HTML preprocessor called Pug (https://pugjs.org/api/getting-started.html). It uses a template and includes based system and is separated out into 3 different section.

1. Layout
2. Pages
3. Partials

There are also multiple variables that are being passed through the template that controls certain elements and colors.

#### 3rd Party Javascript
JavaScript is auto compiled into bundles. This is done automatically. If the Gulp process is running, just adding a 3rd party plugin to the `lib` folder will cause an auto compile. You do **not** need to add it to the layout via a `script` tag.

---

## Additional Gulp Tasks

- **Build for production (no server):**
	```
	gulp build
	```

- **Lint SCSS styles:**
	```
	gulp lint:styles
	```
	This will check your SCSS for style issues using stylelint.

---

## Source Maps

Source maps for CSS and JS are generated automatically in the `build/assets/css` and `build/assets/js` folders to help with debugging.

---

## Troubleshooting

If you have permission errors with npm, try running your install/update commands with `sudo`.
