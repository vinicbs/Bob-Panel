import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Routes from './utils/routes'
import Api from './utils/api'

//### SCREENS ###
import ScreenAuth from './screens/Auth/ScreenAuth'
import ScreenMain from './screens/Main/ScreenMain'

import './App.scss';
//import 'bootstrap/dist/css/bootstrap.css';

const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return (
		React.createElement(component, finalProps)
	);
};

const PropsRoute = ({ component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={routeProps => {
				return renderMergedProps(component, routeProps, rest);
			}} />
	);
};

const PrivateRoute = ({ component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props => {
				return (
					rest.logged ? (
						renderMergedProps(component, props, rest)
					) : (
							<Redirect to={{ pathname: Routes.login, state: { from: props.location } }} />
						)
				);
			}}
		/>
	);
}


class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			logged: false,

			userId: '',
			userEmail: '',
			userName: '',
			userToken: '',
			userPassword: '',
		}
	}

	componentDidMount() {
		const token = localStorage.getItem('userToken');
		var that = this;
		if (!token) { return; }
		let response = null;
		this.setState({ loading: true });
		response = Api.verifyToken(token);
		response.then(result => {
			if (result.data.success === false) {
				that.onUserLogout();
			} else {
				that.onUserLogin(result.data);
			}
		}, function (err) {
			that.onUserLogout();
		})
	}

	onUserLogin = async (data) => {
		await Api.setTokenInHeader(data.data.token);
		this.setState({
			logged: true,
		}, () => {
			this.setState({
				loading: false
			})
		});
	}

	onUserLogout = async () => {
		await Api.setTokenInHeader('');
		this.setState({
			loading: true
		}, () => {
			this.setState({
				logged: false
			})
		});
		this.setState({ loading: false });
	}

	render() {
		return (
			<div className="app" >
				<BrowserRouter>
					<div className="main">
						<PropsRoute
							path={Routes.login}
							component={ScreenAuth}
							onFormSubmit={this.onUserLogin}
							logged={this.state.logged}
							loading={this.state.loading} />
						<PrivateRoute
							exact path={Routes.main}
							component={ScreenMain}
							logged={this.state.logged}
						/>
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
