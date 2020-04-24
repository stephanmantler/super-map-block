import { InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { MapComponent } from '../components';
import { withSelect } from '@wordpress/data';

export const name = 'stepman/post-map-block';

export const settings = {
	title: 'Map Block',
	description: 'Embed a leaflet map element',
	icon: 'admin-site-alt3',
	category: 'embed',
	example: {},
	attributes: {
		width: {
			type: 'string',
			default: '100%',
		},
		height: {
			type: 'string',
			default: '400px',
		},
		mapLocation: {
			type: 'object',
			default: {
				pointX: -17.8,
				pointY: 64.65,
				zoom: 10,
			},
		},
		showMetaShapes: {
			type: 'boolean',
			default: false,
		},
		allowInteraction: {
			type: 'boolean',
			default: true,
		},
		layers: {
			type: "string",
			default: "",
		}
	},
	edit: withSelect( ( select ) => {
		return { 
			layers: select( 'core/editor' ).getEditedPostAttribute( 'meta' )
			.stepman_meta_geolocation,
			};
		} )( ( props ) => {
		const {
			attributes: { width, height, mapLocation, allowInteraction, showMetaShapes },
			layers,
			className,
		} = props;

		if ( showMetaShapes ) {
			props.setAttributes( { layers: layers } );
		} else {
			props.setAttributes( { layers: "" } );
		}

		const onChangeWidth = ( newValue ) => {
			props.setAttributes( { width: newValue } );
		};

		const onChangeHeight = ( newValue ) => {
			props.setAttributes( { height: newValue } );
		};

		const onMapChange = ( newValue ) => {
			props.setAttributes( { mapLocation: newValue } );
		};

		const onToggleInteraction = ( newValue ) => {
			props.setAttributes( { allowInteraction: newValue } );
		};

		const onToggleShowMeta = ( newValue ) => {
			props.setAttributes( { showMetaShapes: newValue } );
		};

		const controls = [
			<InspectorControls key="stepman_map_controls">
				<PanelBody title="Map Settings">
					<PanelRow>
						<TextControl
							label="Width"
							value={ width }
							onChange={ onChangeWidth }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label="Height"
							value={ height }
							onChange={ onChangeHeight }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="allow pan & zoom"
							checked={ allowInteraction }
							onChange={ onToggleInteraction }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="show annotation shapes"
							checked={ showMetaShapes }
							onChange={ onToggleShowMeta }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
		];

		const style = {
			width: props.attributes.width,
			height: props.attributes.height,
		};

//		if( props.attributes.showMetaShapes ) {
//			layers = wp.data.select( 'core/editor' ).getEditedPostAttribute('meta').stepman_meta_geolocation;
//		}

		return (
			<>
				{ controls }
				<MapComponent
					accessToken={ window.stepmanMapboxAccessToken }
					style={ style }
					location={ props.attributes.mapLocation }
					onLocationChange={ onMapChange }
					allowInteraction={ props.attributes.allowInteraction }
					layers={ props.attributes.showMetaShapes ? layers : "" }
				/>
			</>
		);
		
	}),
	save: ( props ) => {
		const style = {
			width: props.attributes.width,
			height: props.attributes.height,
		};

//		if( props.attributes.showMetaShapes ) {
//			layers = wp.data.select( 'core/editor' ).getEditedPostAttribute('meta').stepman_meta_geolocation;
//		}

		return (
			<MapComponent
				accessToken={ window.stepmanMapboxAccessToken }
				style={ style }
				location={ props.attributes.mapLocation }
				allowInteraction={ props.attributes.allowInteraction }
				layers={ props.attributes.layers }
			/>
		);
	},
};
