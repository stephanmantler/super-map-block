import { InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, PanelRow } from '@wordpress/components';
import { MapComponent } from '../components';

export const name = 'stepman/post-map-block';

export const settings = {
	title: 'Map Block',
	description: 'Embed a leaflet map element',
	icon: 'admin-site-alt3',
	category: 'layout',
	example: {},
	attributes: {
		width: {
			type: 'string',
			default: '80%',
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
	},
	edit: function( props ) {
		const {
			attributes: { width, height, mapLocation },
			className,
		} = props;

		const onChangeWidth = ( newValue ) => {
			props.setAttributes( { width: newValue } );
		};

		const onChangeHeight = ( newValue ) => {
			props.setAttributes( { height: newValue } );
		};
		
		const onMapChange = ( newValue ) => {
			props.setAttributes( { mapLocation: newValue } );
		}

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
				</PanelBody>
			</InspectorControls>,
		];

		const style = {
			width: props.attributes.width,
			height: props.attributes.height,
		};
		return (
			<>
				{ controls }
				<MapComponent
					accessToken={ window.stepmanMapboxAccessToken }
					style={ style }
					location = { props.attributes.mapLocation }
					onLocationChange = { onMapChange }
				/>
			</>
		);
	},
	save: function( props ) {
		const style = {
			width: props.attributes.width,
			height: props.attributes.height,
		};

		return (
			<MapComponent
				accessToken={ window.stepmanMapboxAccessToken }
				style={ style }
				location = { props.attributes.mapLocation }
			/>
		);
	},
};
