/**
 * Create a distributable package.
 *
 * Bundle up everything needed to upload and install this plugin, and nothing more.
 *
 * @author Stephan Mantler <step@stepman.is>
 * @requires fs
 * @requires tar
 */

'use strict';

const fs = require('fs');
const tar = require('tar');

const output = 'super-map-block-'+process.env.npm_package_version+'.tgz';

if ( fs.existsSync( output ) ) {
	// will not clobber existing files.
	console.error( "Package file " + output + " exists. Delete or rename first." );
	process.exit(-1);
}

tar.c(
	{
		gzip: true,
		file: output,
		prefix: 'super-map-block',
	},
	['index.php','build/','LICENSE','README.txt', 'includes/','doc/' ]
).then( _ => { console.log( "Created package at " + output + " ." ) } );