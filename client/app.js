import React from "react";
import PropTypes from "prop-types";
import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';

import { BrowserRouter, Switch } from 'react-router-dom';
import { ACCOUNT_TYPE } from "./common/config"
import RedirectRoute from "./pages/RedirectRoute"

// Load our components
import Header from "./common/components/Header"

import Dashboard from './pages/dashboard/';
import Login from './pages/login/';
import Register from './pages/register/';
import Publish from './pages/publish/';
import Records from './pages/records/';
import Activities from './pages/activities/';
import AddActivity from './pages/activities/add';
import EditActivity from './pages/activities/edit';
import Users from './pages/users/';
import AddUser from './pages/users/add';
import EditUser from './pages/users/edit'
import MissingPath from './pages/MissingPath';

import Loading from "./common/components/Loading";
import Notifications, {notify} from 'react-notify-toast';

import { login as userLogin, register, set_token, fetchUserData } from './api';
import { saveToken, getToken, clearToken } from './common/utilities/tokenStorage'

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {
				id: null,
				fullName: null,
				email: null,
				organisationId: null,
				userType: 0,
				loggedIn: false,
				token: null,
			},
			loading: false,
			error: {
				login: "",
				register: "",
				forgotPassword: "",
			}
		};

		this.loadUser = this.loadUser.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.register = this.register.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
	}

	componentWillMount() {
		this.loadUser();
	}

	loadUser() {
		const userData = {...this.state.user};

		// Get WebToken from Browser
		userData.token = getToken();
		if (userData.token == null) {
			return;
		}

		// Set endpoints to use token
		set_token(userData.token);

		// Load User data
		this.setState({loading: true});
		let self = this;
		const load = fetchUserData().then(function(response) {
			if (response.status == 200) {
				return response.json();
			} else {
			return false;
			}
		}).then(function(result) {
			if (result && result.success == true) {
				// Update User Profile Object
				userData.id = result.user.id;
				userData.fullName = result.user.fullName;
				userData.email = result.user.email;
				userData.organisationId = result.user.organisationId;
				userData.userType = result.user.userType;
				userData.loggedIn = true;

				self.setState({user: userData, loading: false});
			} else {
				clearToken();
				userData.token = null;

				self.setState({user: userData, loading: false,});
			}
		});
	}

	login(val) {
		const errorData = {...this.state.error};

		// Return if already a login token
		if (this.state.user.token != null) {
			errorData.login = "User is already logged in";
			this.setState({error: errorData});
			return;
		} else {
			errorData.login = "";
			this.setState({error: errorData});
		}

		let self = this;
		userLogin(val.email, val.password, val.organizationName).then(response => response.json()).then(function(result) {
			// Return fail message if login not successful
			if (result.success == false) {
				errorData.login = "Sorry, we could not log you in. Please check your username and password.";
				self.setState({error: errorData});
				return;
			}
			// Save the token in internal browser storage
			const tokenSaved = saveToken(result.token);
			if (tokenSaved == false) {
				errorData.login = "Sorry, we could not log you in. Please check your username and password.";
				self.setState({error: errorData});
				return;
			}
			// Fetch User Data
			document.location.href = "/";
		});
	}

	logout() {
		// Clear Tokens and Refresh the Page
		clearToken();
		document.location.href = "/";
	}

	forgotPassword() {

	}

	register(val) {
		const errorData = {...this.state.error};

		// Return if already a login token
		if (this.state.user.token != null) {
			errorData.login = "User is currently logged in";
			this.setState({error: errorData});
			return;
		} else {
			errorData.login = "";
			this.setState({error: errorData});
		}

		let self = this;
		register(val.fullName, val.email, val.password, val.organizationName).then(response => response.json()).then(function(result) {
			// Return fail message if login not successful
			if (result.success == false) {
				if (result.code != null && result.code == 11000) {
					errorData.register = "An account with this email address already exists.";
				} else {
					errorData.register = "Sorry, we could not create an account. Please refresh the page and try again.";
				}
				self.setState({error: errorData});
				return;
			}
			alert("Success! Your account has been created. You can now login.");
			document.location.href = "/login";
		});
	}

	render() {
		const {
			user,
			loading,
			error,
		} = this.state;

		if (loading == true) {
			return <Loading />;
		}

		return <BrowserRouter>
			<div>
				<Notifications />
				<Header user={user} logout={this.logout} />
				<Switch>
					<RedirectRoute
						exact path="/"
						user={user}
						role={[ACCOUNT_TYPE.USER, ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <Dashboard user={user} />}
					/>
					<RedirectRoute
						exact path="/login"
						user={user}
						role={[ACCOUNT_TYPE.UNREGISTERED]}
						render={(props) => <Login login={this.login} loginError={error.login} forgotPassword={this.forgotPassword} forgotPasswordError={error.forgotPassword} />}
					/>
					<RedirectRoute
						exact path="/register"
						user={user}
						role={[ACCOUNT_TYPE.UNREGISTERED]}
						render={(props) => <Register register={this.register} registerError={error.register} />}
					/>
					<RedirectRoute
						exact path="/publish"
						user={user}
						role={[ACCOUNT_TYPE.USER]}
						render={(props) => <Publish user={user} />}
					/>
					<RedirectRoute
						exact path="/edit/:id"
						user={user}
						role={[ACCOUNT_TYPE.USER]}
						render={(props) => <Publish user={user} />}
					/>
					<RedirectRoute
						exact path="/records"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <Records user={user} />}
					/>
					<RedirectRoute
						exact path="/records/edit/:id"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <Records user={user} />}
					/>
					<RedirectRoute
						exact path="/activities"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <Activities user={user} />}
					/>
					<RedirectRoute
						exact path="/activities/add"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <AddActivity user={user} />}
					/>
					<RedirectRoute
						exact path="/activities/edit/:id"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <EditActivity user={user} />}
					/>
					<RedirectRoute
						exact path="/users"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <Users user={user} />}
					/>
					<RedirectRoute
						exact path="/users/add"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <AddUser user={user} />}
					/>
					<RedirectRoute
						exact path="/users/edit/:id"
						user={user}
						role={[ACCOUNT_TYPE.ADMINISTRATOR]}
						render={(props) => <EditUser user={user} />}
					/>
					<RedirectRoute
						user={user}
						component={MissingPath}
					/>
				</Switch>
			</div>
		</BrowserRouter>
	}
};

export default App;
