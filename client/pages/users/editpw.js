import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { fetch_single_user, reset_password } from '../../api';
import { notify } from 'react-notify-toast';

import validatePassword from '../../common/utilities/validatePassword';
import Spinner from '../../common/components/Spinner';

class EditUserPW extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			id: "",
			password: "",
      confpassword: "",
			header: "",
			loading: false,
			deleting: false,
			saving: false,
			error: {
				password: null,
				confirmPassword: null,
				generic: null,
			}
		};

		this.loadUser = this.loadUser.bind(this);
		this.editPassword = this.editPassword.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	componentDidMount() {
		this.loadUser();
	}

	loadUser() {
		this.setState({ loading: true });
		const fullstr = document.location.pathname.toString();
    const tmpfullsre = fullstr.split("/");
    const id = tmpfullsre[3] ;
		let self = this;
		fetch_single_user(id).then(response => response.json()).then(function(result) {
			if (result.success) {
				self.setState({
					id: result.message.id,
          password: "",
          confpassword: "",
					header: result.message.fullName,
					loading: false
				});
			} else {
				self.props.history.push("/users");
			}
		});
	}

	editPassword() {
		this.setState({ loading: true, saving: true });
		let errors = this.state.error;
		errors.password = "";
		errors.confirmPassword = "";
		errors.generic = "";

    // Check fields are not empty
		if (this.state.password.trim() == "") {
			errors.password = "Please enter a password.";
		} else {
			errors.password = "";
		}
		if (this.state.confpassword.trim() == "") {
			errors.confirmPassword = "Please retype the password.";
		} else {
			errors.confirmPassword = "";
		}
		if (validatePassword(this.state.password) == false) {
			errors.password = "Invalid password! Password to be of at least 8 characters including a number and an uppercase letter.";
		} else {
			errors.password = "";
		}
    if(this.state.password.trim() !== this.state.confpassword.trim())
    {
      errors.confirmPassword = "The two entered passwords don't match!"
    }

		// Attempt save to database
		if (errors.password === "" && errors.confirmPassword === "") {
			let self = this;
			reset_password(this.state.id, this.state.password).then(response => response.json()).then(function(result) {
				if (result.success == true) {
					notify.show('Password has been successfully updated');
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
			password,
			confpassword,
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
                  <p><img src={require('../../common/images/go_back.png')} onClick={() => this.props.history.push("/users")}/> &nbsp; Reset {header}'s Password</p>
          </div>
					<div className="components">
						<div className="input">
							<label>Password</label>
							<input
								name="password"
                type="password"
								value={password}
								onChange={this.changeField}
								disabled={loading}
							/>
							{error.password && <div className="error">{error.password}</div>}
						</div>
						<div className="input">
							<label>Confirm Password</label>
							<input
								type="password"
								name="confpassword"
								value={confpassword}
								onChange={this.changeField}
								disabled={loading}
							/>
							{error.confirmPassword && <div className="error">{error.confirmPassword}</div>}
						</div>
						{error.generic && <div className="error">{error.generic}</div>}
						<div>
							<button type="button" className="submit width60 float-right" onClick={this.editPassword} disabled={loading}>{saving && <Spinner />}Update User Info</button>
					</div>
          </div>
			</div>
		</div>;
	};
};

EditUserPW.propTypes = {
	user: PropTypes.object,
};

export default withRouter(EditUserPW);
