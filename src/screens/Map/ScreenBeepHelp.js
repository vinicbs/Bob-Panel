import React from 'react';
import Api from '../../utils/api'
import mainLogo from "../../assets/images/ICON.png"
import { Link } from "react-router-dom";
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon, Polyline } from 'google-maps-react';
import qs from 'query-string'
import Utils from '../../utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import dateTime from 'date-and-time';
import './ScreenBeepHelp.scss';

export class ScreenBeepHelp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			beeps: [],
			locations: [],
			beepToken: '',

			showingInfoWindow: true,
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

			let beepsList = response.data.data;
			let locations = [];
			beepsList.forEach(beep => {
				locations.push({ lat: parseFloat(beep.latitude), lng: parseFloat(beep.longitude) });
				beep.location = { lat: parseFloat(beep.latitude), lng: parseFloat(beep.longitude) };
			});
			this.setState({ beeps: beepsList, locations: locations });
			console.log(this.state.beeps)
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

			let beep = response.data.data;
			let location = { lat: parseFloat(beep.latitude), lng: parseFloat(beep.longitude) };
			beep.location = { lat: parseFloat(beep.latitude), lng: parseFloat(beep.longitude) };
			this.setState(prevState => ({
				locations: [...prevState.locations, location],
				beeps: [...prevState.beeps, beep]
			}))
		} catch (err) {
			console.log(err);
			toast.error('Aconteceu algo inesperado, recarregue a pagina');
		}
	}

	onMarkerClick = (props, marker, e) => {
		console.log(props)
		this.setState({
			selectedPlace: props.beep,
			activeMarker: marker,
			showingInfoWindow: true
		});
	}

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
				<div className="header-abs-item logo left">
					<img src={mainLogo} alt="SLC" />
				</div>
				<div className="header-menu">
					<div className="header-item" title="botaodobem">
						Botão do Bem
          			</div>
				</div>
			</div>
		);
	}

	render() {
		const triangleCoords = this.state.locations;

		return (
			<div>
				{!this.props.logged ? this.renderHeader() : null}
				<Map google={this.props.google}
					style={{ width: '100%', height: '100%', position: 'relative' }}
					className={'map'}
					zoom={15}
					center={this.state.locations[0]}>
					<Polyline
						path={triangleCoords}
						strokeColor="#0000FF"
						strokeOpacity={0.8}
						strokeWeight={2} />
					{this.state.beeps.map((beep, index) => {
						if (beep.pressed_button === 1) {
							return (
								<Marker
									onClick={this.onMarkerClick}
									beep={beep}
									position={beep.location}>
								</Marker>
							)
						}
					})}
					{this.state.beeps.length > 0 ?
						<Marker
							onClick={this.onMarkerClick}
							beep={this.state.beeps[this.state.beeps.length - 1]}
							position={this.state.beeps[this.state.beeps.length - 1].location}>
						</Marker> : null}

					<InfoWindow
						marker={this.state.activeMarker}
						visible={this.state.showingInfoWindow}>
						<div className='marker-info-window'>
							<div>Velocidade: {this.state.selectedPlace.speed}km/h</div>
							<div>{dateTime.format(new Date(this.state.selectedPlace.created_at), 'YYYY/MM/DD HH:mm:ss')}</div>
						</div>
					</InfoWindow>
				</Map>
			</div>

		);
	}
}

export default GoogleApiWrapper({
	apiKey: (process.env.REACT_APP_GOOGLE)
})(ScreenBeepHelp)
