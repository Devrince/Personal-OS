# My OS

A personal operating system that runs in the browser. It has a welcome screen, a top bar with a clock, a bottom app bar, and draggable windows with three apps: Notes, a PDF reader, and a music player.

Built as part of the Hack Club **WebOS** jam batch for [Stardance](https://stardance.hackclub.com).

## Features

- **Splash screen** with a logo and an Enter button
- **Top bar** with a live clock and date
- **Bottom app bar** to open and close apps
- **Draggable windows** that come to the front when clicked
- **Notes:** write, select, and delete notes. Notes are saved in your browser, so they stay after you reload.
- **PDF reader:** open a PDF from your computer and flip through its pages
- **Music player:** play songs from your own computer, with play, pause, next, previous, and a playlist

## Built With

- HTML for structure
- CSS for styling
- JavaScript for behavior
- [pdf.js](https://mozilla.github.io/pdf.js/) for reading PDFs

## Run It Locally

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Double-click `index.html` to open it in your browser.

An internet connection is needed for the PDF reader, because it loads its library from the web.

## Run It Online

Once GitHub Pages is enabled for this repo, the live site is available at:

`https://devrince.github.io/Personal-OS/`

To turn it on: go to **Settings → Pages**, choose the `main` branch, and click **Save**.

## Project Structure

## Customizing

- Change the colors in the `:root` block of `style.css`.
- Replace the logo SVG in `index.html`.
- Add new apps by copying a window block in `index.html`, adding a button to the taskbar, and writing its logic in `script.js`.

## Roadmap

- [ ] Spotify integration
- [ ] PDF notes and highlights
- [ ] More apps
- [ ] Mobile layout

## Progress Log

Devlogs for this project are posted on Stardance.

## Author

Prince ([@Devrince](https://github.com/Devrince))
