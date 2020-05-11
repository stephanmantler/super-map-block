'use strict';

import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody, TextControl } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { MapComponent } from './components';

let PluginMetaFields = ( props ) => {
	return (
		<>
			<PanelBody opened={ true }>
				<MapComponent
					layers={ props.metaFieldValue }
					accessToken={ props.accessToken }
					allowEdit={ true }
					style={ { width: '100%', height: '400px' } }
					onChange={ ( value ) => props.setMetaFieldValue( value ) }
				/>
				<TextControl
					label={ __("Location data (for debugging)", 'super-map-block') }
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
							title={ __("Geolocation", 'super-map-block') }
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
