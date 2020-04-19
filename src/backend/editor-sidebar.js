'use strict';

import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody, TextControl } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
// we should use this for i18n.
//import { __ } from '@wordpress/i18n';
import { MapComponent } from './components';

let PluginMetaFields = ( props ) => {
	return (
		<>
			<PanelBody opened={ true }>
				<MapComponent
					layers={ props.metaFieldValue }
					accessToken={ props.accessToken }
					style={ { width: '100%', height: '400px' } }
					onChange={ ( value ) => props.setMetaFieldValue( value ) }
				/>
				<TextControl
					label="Location data (for debugging)"
					value={ props.metaFieldValue }
					onChange={ ( value ) => props.setMetaFieldValue( value ) }
				/>
			</PanelBody>
		</>
	);
};

PluginMetaFields = withSelect( ( select ) => {
	return {
		metaFieldValue: select( 'core/editor' ).getEditedPostAttribute( 'meta' )
			.stepman_meta_geolocation,
	};
} )( PluginMetaFields );

PluginMetaFields = withDispatch( ( dispatch ) => {
	return {
		setMetaFieldValue: ( value ) => {
			dispatch( 'core/editor' ).editPost( {
				meta: { stepman_meta_geolocation: value },
			} );
		},
	};
} )( PluginMetaFields );

const MapSidebar = {
	register: ( accessToken ) => {
		registerPlugin( 'stepman-geo-location', {
			render() {
				return (
					<>
						<PluginSidebarMoreMenuItem
							target="stepman-geo-location"
							icon="admin-site-alt3"
						>
							Geolocation
						</PluginSidebarMoreMenuItem>
						<PluginSidebar
							name="stepman-geo-location"
							icon="admin-site-alt3"
							title="Geolocation"
						>
							<PluginMetaFields accessToken={ accessToken } />
						</PluginSidebar>
					</>
				);
			},
		} );
	},
};

export { MapSidebar };
