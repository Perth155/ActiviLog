import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import { fetch_single_user, edit_user, delete_user } from '../../api';
import {notify} from 'react-notify-toast';

import validateEmail from '../../common/utilities/validateEmail';
import Spinner from '../../common/components/Spinner';

class EditUser extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			id: "",
			fullName: "",
			email: "",
			header: "",
			loading: false,
			deleting: false,
			saving: false,
			error: {
				fullName: null,
				emailAddress: null,
				generic: null,
			}
		};

		this.loadUser = this.loadUser.bind(this);
		this.editUser = this.editUser.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	componentDidMount() {
		this.loadUser();
	}

	loadUser() {
		this.setState({ loading: true });
		const fullstr = document.location.pathname.toString();
    const tmpfullsre = fullstr.split("/");
    console.log(tmpfullsre);
    const id = tmpfullsre[3] ;
		let self = this;
		fetch_single_user(id).then(response => response.json()).then(function(result) {
			if (result.success) {
				self.setState({
					id: result.message.id,
					fullName: result.message.fullName,
				  email: result.message.email,
					header: result.message.fullName,
					loading: false
				});
			} else {
        console.log(result);
				self.props.history.push("/users");
			}
		});
	}

	deleteUser() {
		this.setState({ loading: true, deleting: true });
		const id = this.state.id;
		let self = this;
		delete_user(id).then(response => response.json()).then(function(result) {
			if (result.success) {
				self.props.history.push("/users");
			} else {
				this.setState({loading: false, deleting: false, error: {
					generic: "Error! This user could not succesfully be deleted :/. Please refresh the page and try again."
				}});
			}
		});
	}

	editUser() {
		this.setState({ loading: true, saving: true });
		let errors = this.state.error;
		errors.fullName = "";
		errors.emailAddress = "";
		errors.generic = "";

    console.log(this.state.fullName);
    console.log(this.state.email);
    console.log(this.state.fullName.trim());
		// Check fields are not empty
    // Check fields are not empty
		if (this.state.fullName.trim() == "") {
			errors.fullName = "Please add the Full Name of the new user.";
		} else {
			errors.fullName = "";
		}
		if (this.state.email.trim() == "") {
			errors.emailAddress = "Please enter an email address.";
		} else {
			errors.emailAddress = "";
		}
		if (validateEmail(this.state.email) == false) {
			errors.emailAddress = "Please enter a valid email address e.g. jane.citizen@activilog.example.com";
		} else {
			errors.emailAddress = "";
		}

		// Attempt save to database
		if (errors.fullName === "" && errors.emailAddress === "") {
			let self = this;
			edit_user(this.state.id, this.state.fullName, this.state.email).then(response => response.json()).then(function(result) {
				if (result.success == true) {
					notify.show('User has successfully been updated');
					self.props.history.push("/users");
				} else {
          notify.show('Sorry, something went wrong :/');
					self.setState({ loading: false, saving: false, error: {generic: "Sorry, something went wrong and we could not save your changes :/. Please refresh the page and try again."} });
				}
			});
		} else {
			this.setState({ loading: false, saving: false });
		}
		this.setState({error: errors});
	}

	changeField(evt) {
		this.setState({[evt.target.name]: evt.target.value});
	}

	render() {
		const {
			fullName,
			email,
			header,
			error,
			loading,
			saving,
			deleting,
		} = this.state;

		const {
			user,
		} = this.props;

		return <div className="page">
			<div className="box">
					<div className="title">
                  <p><img src={require('../../common/images/go_back.png')} onClick={() => this.props.history.push("/users")}/> &nbsp; Edit {header}'s Profile</p>
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
								placeholder="John Citizen"
							/>
							{error.fullName && <div className="error">{error.fullName}</div>}
						</div>
						<div className="input">
							<label>Email Address</label>
							<input
								type="text"
								name="email"
								value={email}
								onChange={this.changeField}
								disabled={loading}
								placeholder="john.citizen@activilog.example.com"
							/>
							{error.emailAddress && <div className="error">{error.emailAddress}</div>}
						</div>
						{error.generic && <div className="error">{error.generic}</div>}
						<div>
							<button type="button" className="submit width60 float-right" onClick={this.editUser} disabled={loading}>{saving && <Spinner />}Update User Info</button>
							<button type="button" className="register width30 float-left" onClick={this.deleteUser} disabled={loading}>{deleting && <Spinner />}Delete User</button>
						</div>
					</div>
			</div>
		</div>;
	};
};

EditUser.propTypes = {
	user: PropTypes.object,
};

export default withRouter(EditUser);
