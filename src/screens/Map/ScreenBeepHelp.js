import React from 'react';
import Api from '../../utils/api'
import mainLogo from "../../assets/images/ICON.png"
import { Link } from "react-router-dom";
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon, Polyline } from 'google-maps-react';
import qs from 'query-string'
import Utils from '../../utils/utils';
import { ToastContainer, toast } from 'react-toastify';


export class ScreenBeepHelp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			beeps: [],
			locations: [],
			beepToken: '',

			showingInfoWindow: false,
			activeMarker: {},
			selectedPlace: {},
			page: 1,
			loading: false,
			error: 0
		};
	}

	componentDidMount() {
		const beepToken = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).beep;
		this.setState({ beepToken: beepToken }, () => {
			this.fetchData();
		});

	}

	async fetchData() {
		try {
			let response = await Api.deviceBeepHelpList(this.state.beepToken);

			//Check for errors
			if (Utils.checkForErrors(this, response.data)) { return; }

			const beepsList = response.data.data;
			let beeps = [];
			let locations = [];
			beepsList.forEach(beep => {
				locations.push({ lat: parseFloat(beep.latitude), lng: parseFloat(beep.longitude) });
				if (beep.pressed_button === 1) {
					beeps.push({ lat: parseFloat(beep.latitude), lng: parseFloat(beep.longitude) })
				}
			});
			this.setState({ beeps: beeps, locations: locations });
			setInterval(function () { this.fetchLastPosition(); }.bind(this), 5000)
		} catch (err) {
			console.log(err);
			toast.error('Aconteceu algo inesperado, recarregue a pagina');
		}
	}

	async fetchLastPosition() {
		try {
			let response = await Api.deviceBeepHelpLast(this.state.beepToken);

			//Check for errors
			if (Utils.checkForErrors(this, response.data)) { return; }

			const beep = response.data.data;

			let location = { lat: parseFloat(beep.latitude), lng: parseFloat(beep.longitude) };
			this.setState(prevState => ({
				locations: [...prevState.locations, location]
			}))
		} catch (err) {
			console.log(err);
			toast.error('Aconteceu algo inesperado, recarregue a pagina');
		}
	}

	onMarkerClick = (props, marker, e) =>
		this.setState({
			selectedPlace: props,
			activeMarker: marker,
			showingInfoWindow: true
		});

	onMapClicked = (props) => {
		if (this.state.showingInfoWindow) {
			this.setState({
				showingInfoWindow: false,
				activeMarker: null
			})
		}
	};

	renderHeader() {
		return (
			<div className="header">
				<div className="header-abs-item">
					<img src={mainLogo} alt="SLC" />
				</div>
			</div>
		);
	}

	render() {
		const triangleCoords = this.state.locations;

		return (
			<Map google={this.props.google}
				style={{ width: '100%', height: '100%', position: 'relative' }}
				className={'map'}
				zoom={15}
				center={this.state.locations[this.state.locations.length - 1]}>
				<Polyline
					path={triangleCoords}
					strokeColor="#0000FF"
					strokeOpacity={0.8}
					strokeWeight={2} />
				{this.state.beeps.map((beep, index) => {
					return <Marker
						title={'beeped'}
						position={beep}>
					</Marker>
				})}
				<Marker
					title={'beeped'}
					position={this.state.locations[this.state.locations.length - 1]}>
				</Marker>

				{/* <Marker onClick={this.onMarkerClick}
					name={'Current location'}
					location={'Porto Alegre'} /> */}
				{/* <InfoWindow
					marker={this.state.activeMarker}
					visible={this.state.showingInfoWindow}>
					<div>
						<h3>{this.state.selectedPlace.location}</h3>
					</div>
				</InfoWindow> */}
			</Map>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: ('AIzaSyBUx-4cyrgTorSvpsRqI6Uwk3LZXZlCD5k')
})(ScreenBeepHelp)
