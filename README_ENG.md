# frontend-gulp

This project is for build automation using Gulp. The goal of the project is to simplify the development process by
automating tasks such as Sass file compilation, CSS minification, image optimization, JavaScript bundling, SVG sprite
creation, and more.

## Dependencies

### Installed dependencies

- **@fancyapps/ui**: A lightweight and modern plugin for displaying modals and lightboxes.
- **del**: A utility for removing files and directories.
- **esbuild**: A fast bundler and JavaScript minifier.
- **fluent-ffmpeg** is used for compressing video files, converting formats, and other video and audio processing tasks.
- **globby**: A library for working with file paths and patterns.
- **gulp-esbuild**: A Gulp plugin to use esbuild for bundling and minifying JavaScript.
- **imagemin**: A plugin for image optimization.
- **imagemin-webp**: A plugin for WebP support in Imagemin.
- **notyf**: A minimalist and customizable notification plugin.
- **swiper**: A modern and flexible slider for the web.
- **tippy.js**: A lightweight and customizable tooltip plugin.

### Зависимости для разработки

- **@types/cheerio**: TypeScript types for the Cheerio library.
- **@types/through2**: TypeScript types for the through2 library.
- **browser-sync**: A tool for automatically reloading the page in the browser during development.
- **cheerio**: A fast and flexible jQuery-like library for working with HTML.
- **cross-env**: A utility for setting environment variables in a cross-platform way.
- **gulp**: A task automation tool for the project.
- **gulp-cheerio**: A Gulp plugin for manipulating HTML using Cheerio.
- **gulp-clean-css**: A Gulp plugin for CSS minification.
- **gulp-file-include**: A Gulp plugin for including partial HTML files.
- **gulp-if**: A Gulp plugin for conditional stream processing.
- **gulp-plumber**: A Gulp plugin for preventing stream breaks on errors.
- **gulp-rename**: A Gulp plugin for renaming files.
- **gulp-sass**: A Gulp plugin for compiling Sass into CSS.
- **gulp-sourcemaps**: A Gulp plugin for generating source maps.
- **gulp-svg-sprite**: A Gulp plugin for creating SVG sprites.
- **gulp-svgmin**: A Gulp plugin for optimizing SVG files.
- **imagemin-mozjpeg**: A plugin for optimizing images in the MozJPEG format.
- **imagemin-pngquant**: A plugin for optimizing images in the PNG format.
- **imagemin-svgo**: A plugin for optimizing SVG images.
- **sass**: A CSS preprocessor that extends the functionality of standard CSS.
- **through2**: A wrapper for working with streams in Node.js.
- **depcheck**: A tool for finding unused dependencies in a project.

## Gulp Tasks

### `cleanTask`

This task cleans the output directories (e.g., dist/) before each build. It removes old and unnecessary files.

### `fontsTask`

A task that copies font files from the src/fonts/ directory to the corresponding output directory (dist/fonts/).

### `sassTask`

Compiles Sass files into CSS, minifies them, and generates source maps for debugging.

### `copyHtml`

Copies HTML files from the src/html/ folder to the output directory (dist/).

### `htmlWebpReplaceTask`

Replaces all images in HTML with <picture> elements, adding WebP images for modern browsers.

### `addPreloadToLCP`

Adds <link rel="preload"> tags to the HTML for critical resources (such as images and fonts), improving the Largest
Contentful Paint (LCP) metric.

### `optimizeImages`

Optimizes images (JPG, PNG, GIF, SVG) using tools like imagemin.

### `convertToWebp`

Converts supported image formats to the WebP format for better compression.

### `svgSpriteTask`

Generates an SVG sprite from all SVG files in the src/images/icon/ directory.

### `jsTask`

Bundles and minifies JavaScript files using esbuild. This task also generates source maps for debugging.

### `serveTask`

Launches a local development server and serves files from the dist/ directory. It includes live reloading using
BrowserSync.

### `videoTask`

This task handles the compression of .mp4 video files using the fluent-ffmpeg library. All videos from the src/video/
folder are processed, and if compression is successful, they are saved in the dist/video/ folder. In case of a
compression error, the video file is copied without modifications. The task also watches for changes in video files and
automatically processes any new or modified files.

### `reloadBrowser`

Reloads the browser when files change during development.

## Usage

1. Install dependencies:

```bash
npm install
```

2. To run the development task and start the server:

```bash
npm run dev
```

3. To build for production:

```bash
npm run build
```

4. To check the gulp tasks:

```bash
npm run test 
```

5. To remove unused dependencies:

```bash
npm run clean:deps 
```

## Versions used

Node.js: v22.14.0
npm: 11.3.0

## Contact Information

- **Email**: [vlad.filippov.tmn@gmail.com](mailto:vlad.filippov.tmn@gmail.com)
- **Telegram**: [@VladFilippov72](https://t.me/VladFilippov72)

## Donate

If you like this project and would like to support its development, you can make a donation:

- **Crypto Wallet**: TUMKgoGgtAPgrd7ra82RyeqyAipD1Aj16w
  Tether USD

Thank you for your support! 🙏