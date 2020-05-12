=== Super Map Block ===
Contributors: stepman
Tags: map,OpenStreetMap,OpenTopoMap,MapBox,leaflet.js,Gutenberg,GeoJSON
Donate link: http://www.stephanmantler.com/tipjar/
Requires at least: 5.2
Stable tag: trunk
Tested up to: 5.4
Requires PHP: 7.2
License: GPL-3.0-or-later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Provides flexible maps and universal geolocation support for posts and pages.

== Description ==

This WordPress plugin enables geolocation for posts & pages, supports GeoJSON uploads to the media library, and adds a Gutenberg block to display interactive maps. It supports [OpenStreetMap](http://openstreetmap.org), [OpenTopoMap](http://opentopomap.org) and [Mapbox](https://www.mapbox.com) base maps, and you can add custom WMTS raster source overlays and GeoJSON vector overlays from the media library.

= Post / Page Geolocation =

After installing and activating the plugin, there will be a new sidebar in your Gutenberg editor (look for the globe icon in the top right corner). If it does not show up directly, you can access it through the `More tools and options` section (three vertical dots) at `Plugins` -> `Geolocation`.

You can place as many polygons, circles and/or markers on the map as you see fit to represent your page or post.

= Embedding Maps =

The block can be found in the Embeds section, or just search for "Super Map Block". You can pan / zoom the map to a suitable location and this will be stored once you hit the save / update button. The sidebar gives you control over how much space the map block is allowed to take up (recommended settings are 100% width so that the map flexibly fills up its container), and a suitable vertical size in pixels.

Once placed, the side bar offers a number of options to customize map display and interaction.

* Base map source can be switched between OpenStreetMap, OpenTopoMap, Mapbox, and none (may be useful if you plan to only show a custom WMTS source).
* Interaction (pan/zoom) on the front end can be disabled (but remains enabled in the editor).
* You can optionally show any geolocation annotations you made for the post.
* You can specify a custom WMTS URL & attribution to display as a raster overlay above the base map.
* GeoJSON files from the media library can be added and will be shown as additional layers.

Adding multiple map blocks works as expected.

## GeoJSON media

This plugin also extends the WordPress media library to support GeoJSON files and display them in the map view.

== Installation ==

Install plugin as usual. To use Mapbox instead of OpenStreetMap or OpenTopoMap, you will need a [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/). After receiving your token, go to Plugins -> Super Map Box and paste the token in the appropriate text field.

== Screenshots ==

1. Embedding the map block
1. Page / post geolocation

== Frequently Asked Questions ==

= Can I change the order in which GeoJSON attachments are layered? =

This is currently defined by the sequence in which the attachments were selected.

= Can I change the color of my map annotations? =

You can do this manually by adding a `style` property to the generated GeoJSON in the text field below the map, eg. 

`...
{
  /* -- a red circle -- */
  "type": "Feature",   
  "properties" : {
    "radius": 100.0
    "style" : {
      "color": "#ff000"
    }
  },
  "geometry": {
    "type": "Point",
    "coordinates": [ -15.112295, 64.289798 ]
}
...`

An actual color picker / editor is planned for a future release.

== Changelog ==

= 1.0 =

* Initial release!