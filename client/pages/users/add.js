import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {create_account} from '../../api';

import Spinner from '../../common/components/Spinner';
import validateEmail from '../../common/utilities/validateEmail';

class AddUser extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fullName: "",
			emailAddress: "",
			password: "",
			loading: false,
			error: {
				email: null,
				password: null,
				fullName: null,
			}
		};

		this.addUser = this.addUser.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	addUser() {
		this.setState({ loading: true });
		let errors = this.state.error;
		errors.fullName = "";
		errors.emailAddress = "";
		errors.password = "";
		errors.generic = "";

		// Check fields are not empty
		if (this.state.fullName.trim() == "") {
			errors.fullName = "Please add the Full Name of the new user.";
		} else {
			errors.fullName = "";
		}
		if (this.state.emailAddress.trim() == "") {
			errors.emailAddress = "Please enter an email address.";
		} else {
			errors.emailAddress = "";
		}
		if (validateEmail(this.state.emailAddress) == false) {
			errors.emailAddress = "Please enter a valid email address e.g. jane.citizen@activilog.example.com";
		} else {
			errors.emailAddress = "";
		}

		// Attempt save to database
		if (errors.fullName == "" && errors.emailAddress == "") {
			let self = this;
			create_account(this.state.fullName, this.state.emailAddress, this.state.password).then(response => response.json()).then(function(result) {
				if (result.success == true) {
					self.setState({ loading: false });
					self.props.history.push("/users");
				} else {
					self.setState({ loading: false, error: {generic: result.message} });
				}
			});
		} else {
			this.setState({ loading: false });
		}
		this.setState({error: errors});
	}


	changeField(evt) {
		console.log(evt.target.value);

		this.setState({[evt.target.name]: evt.target.value});
	}

	render() {
		const {
			fullName,
			emailAddress,
			password,
			error,
			loading
		} = this.state;

		const {
			user,
		} = this.props;

		return <div className="page">
			<div className="box">
					<div className="title">
								<p><img src={require('../../common/images/go_back.png')} onClick={() => this.props.history.push("/users")}/> &nbsp; Add New User</p>
					</div>
					<div className="components">
						<div className="input">
							<label>Full Name</label>
							<input
								type="text"
								name="fullName"
								value={fullName}
								onChange={this.changeField}
								disabled={loading}
								placeholder="Jane Citizen"
							/>
							{error.fullName && <div className="error">{error.fullName}</div>}
						</div>
						<div className="input">
							<label>Email Address</label>
							<input
								type="text"
								name="emailAddress"
								value={emailAddress}
								onChange={this.changeField}
								disabled={loading}
								placeholder="jane.citizen@activilog.example.com"
							/>
							{error.emailAddress && <div className="error">{error.emailAddress}</div>}
						</div>
						<div className="input">
							<label>Password</label>
							<input
								type="password"
								name="password"
								value={password}
								onChange={this.changeField}
								disabled={loading}
							/>
							{error.password && <div className="error">{error.password}</div>}
						</div>
						{error.generic && <div className="error">{error.generic}</div>}
						<div>
							<button type="button" className="submit" onClick={this.addUser} disabled={loading}>{loading && <Spinner />}Save</button>
						</div>
					</div>
			</div>
		</div>;
	};
};

AddUser.propTypes = {
	user: PropTypes.object,
};

export default withRouter(AddUser);
