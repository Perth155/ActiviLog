import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { create_account } from '../../../api';

import Spinner from '../../../common/components/Spinner';
import validateEmail from '../../../common/utilities/validateEmail';

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
		this.setState({[evt.target.name]: evt.target.value});
	}

	render() {
		return (
			<div className="page">
				<div className="box">
						<div className="components">
							<div className="input">
								<label>We are sorry, this feature is currently unavailable due to email limits using Sendgrid. We are working on an alternative. </label>
							</div>
						</div>
				</div>
			</div>
		);
	};
};

AddUser.propTypes = {
	user: PropTypes.object,
};

export default withRouter(AddUser);
