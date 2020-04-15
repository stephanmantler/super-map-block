# stepman-geo-post
A wordpress plugin to provide geolocation to posts &amp; pages. There are of course already similar plugins out there, but this is a convenient project for me to become more familiar with modern development for the Gutenberg editor.

## Getting Started

This repository only contains the raw sources and requires a development environment to build the actual plugin. In addition to the source code, this plugin currently requires a [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/). Get this before you run the build process and paste it into `src/backend/components/index.js` (this will soon be replaced by a proper plugin configuration page in Wordpress).

Next, run `nppm install && npm run build` to build the actual plugin.

## License

This project is licensed under the GPL v3 License - see the accompanying [LICENSE](LICENSE) file.