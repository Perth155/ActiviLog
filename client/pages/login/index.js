import React from "react";
import PropTypes from "prop-types";
import { Redirect } from 'react-router-dom';
import validateCharacters from '../../common/utilities/validateCharacters';
import validateEmail from '../../common/utilities/validateEmail';
import { check_organization } from '../../api';
import { Link } from 'react-router-dom';

import LoginFooter from '../../common/components/LoginFooter';
import Spinner from '../../common/components/Spinner';
require('../../common/styles/style.css');

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			organizationName: "",
			organizationValid: false,
			emailAddress: "",
			password: "",
			forgotPassword: false,
			loading: false,
			register: false,
			loggedIn: false,
			error: {
				organization: null,
				email: null,
				password: null,
				login: null,
			}
		};

		this.changeField = this.changeField.bind(this);
		this.checkOrganization = this.checkOrganization.bind(this);
		this.login = this.login.bind(this);
		this.register = this.register.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
		this.resetPassword = this.resetPassword.bind(this);
	}

	changeField(evt) {
		if (evt.target.name == "organizationName") {
			if (validateCharacters(evt.target.value)) {
				this.setState({[evt.target.name]: evt.target.value});
				return;
			} else {
				return;
			}
		}

		this.setState({[evt.target.name]: evt.target.value});
	}

	checkOrganization() {
        this.setState({ loading: true });
        let self = this;
        let errors = this.state.error;
        check_organization(this.state.organizationName.toLowerCase()).then(response => response.json()).then(function(result) {
			if (result.valid == false) {
				errors.organization = result.msg;
                self.setState({
					error: errors,
					loading: false
                });
                return;
			} else {
                errors.organization = "";
                self.setState({
					error: errors,
                    organizationValid: true,
					loading: false
                });
                return;
            }
		}).catch(function(err) {
            self.setState({ loading: false });
		});
	}

	login() {
		this.setState({ loading: true });
		let errors = this.state.error;
		errors.login = "";
		errors.password = "";
		// Check Email is Valid
		if (validateEmail(this.state.emailAddress) == false) {
			errors.email = "Please enter a valid email address";
		} else {
			errors.email = "";
		}
		if (this.state.password.trim() == "") {
			errors.password = "Please enter a password";
		} else {
			errors.password = "";
		}
		if (errors.email == "" && errors.password == "") {
			const properties = {
				email: this.state.emailAddress,
				password: this.state.password,
				organizationName: this.state.organizationName.toLowerCase(),
			};
			this.props.login(properties);
			this.setState({ loading: false });
		} else {
			this.setState({ loading: false });
		}
		this.setState({error: errors});
	}

	register() {
		this.setState({ register: true });
	}

	forgotPassword() {
		this.setState({ forgotPassword: true });
	}

	resetPassword() {
		let errors = this.state.error;
		
		// Check Email is Valid
		if (validateEmail(this.state.emailAddress) == false) {
			errors.email = "Please enter a valid email address";
		} else {
			errors.email = "";
		}

		if (errors.email == "") {
			this.props.forgotPassword(this.state.emailAddress);
		}

		this.setState({error: errors});
	}

	render() {
		const { 
			organizationName,
			organizationValid,
			emailAddress,
			password,
			register,
			loggedIn,
			forgotPassword,
			error,
			loading
		} = this.state;

		const {
			loginError,
			forgotPasswordError,
		} = this.props;

		if (register) {
			const path = ("/register?" + this.state.organizationName).toString();
			return <Redirect to={path}/>;
		}

		if (loggedIn) {
			return <Redirect to='/'/>;
		}

		return <div id="authenticate" className="color-wrap">
			<div className="container">
				<div className="logo">
					<Link to={{pathname: '/'}}>
						<img src={require('../../common/images/logo_text.png')} />
					</Link>
				</div>
				<div className="modal">
					{organizationValid == false && !forgotPassword &&
					<div>
						<div className="organization_input">
							<div className="title">
								<h2>Welcome.</h2>
								<p>Enter your <strong>Organization Name</strong> to get started.</p>
							</div>
							<input
								type="text"
								name="organizationName"
								value={organizationName}
								onChange={this.changeField}
								placeholder={"Organization Name"}
								disabled={loading}
							/>
							<span className="address">@activilog</span>
						</div>
						{error.organization && <div className="error">{error.organization}</div>}
						<div>
							<button type="button" className="submit" onClick={this.checkOrganization} disabled={loading}>{loading && <Spinner />}Continue</button>
						</div>
					</div>}
					{organizationValid == true && !forgotPassword && <div className="loginform">
						<div className="title">
							<h2>Account Login</h2>
						</div>
						<label>Email Address:</label>
						<input
							type="text"
							name="emailAddress"
							value={emailAddress}
							onChange={this.changeField}
							disabled={loading}
						/>
						{error.email && <div className="error">{error.email}</div>}
						<label>Password:</label>
						<input
							type="password"
							name="password"
							value={password}
							onChange={this.changeField}
							disabled={loading}
						/>
						{error.password && <div className="error">{error.password}</div>}
						{loginError && <div className="error">{loginError}</div>}
						<div className="enter">
							<button type="button" className="submit width48 float-left" onClick={this.login} disabled={loading}>{loading && <Spinner />}Login</button>
							<button type="button" className="register width48 float-right" onClick={this.register} disabled={loading}>Register</button>
						</div>
						<p className="forgotPassword" />
					</div>}
					{forgotPassword && <div className="forgotform">
						<div className="title">
							<h2>Reset Password</h2>
							<p>Enter your email address to receive a reset link</p>
						</div>
						<input
							type="text"
							name="emailAddress"
							value={emailAddress}
							onChange={this.changeField}
							placeholder={"Email Address"}
							disabled={loading}
						/>
						{error.email && <div className="error">{error.email}</div>}
						{loginError && <div className="error">{loginError}</div>}
						<button type="button" className="reset" onClick={this.resetPassword} disabled={loading}>Reset Password</button>
					</div>}
				</div>
			</div>
			<LoginFooter />
		</div>;
	};
};

Login.propTypes = {
	route: PropTypes.object,
	login: PropTypes.func,
	loginError: PropTypes.string,
	forgotPassword: PropTypes.func,
	forgotPasswordError: PropTypes.string,
};

export default Login;
