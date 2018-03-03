import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { fetch_single_user, reset_usertype } from '../../../api';
import { notify } from 'react-notify-toast';

import Spinner from '../../../common/components/Spinner';

class EditUserUtype extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userType: "",
			header: "",
			loading: false,
			deleting: false,
			saving: false,
			error: {
				userType: null,
				generic: null,
			}
		};

		this.loadUser = this.loadUser.bind(this);
		this.editUtype = this.editUtype.bind(this);
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
          			userType: result.message.userType,
					header: result.message.fullName,
					loading: false
				});
			} else {
				self.props.history.push("/users");
			}
		});
	}

	editUtype() {
		this.setState({ loading: true, saving: true });
		let errors = this.state.error;
		errors.userType = "";
		errors.generic = "";

		if(this.state.userType === "3")
			var utypeval = 3;
		else
			var utypeval = 1;
		// Attempt save to database
		if (errors.generic === "") {
			let self = this;
			reset_usertype(this.state.id, this.state.userType).then(response => response.json()).then(function(result) {
				if (result.success == true) {
					notify.show('Privileges has been successfully updated');
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
			userType,
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
                  		<p><img src={require('../../../common/images/go_back.png')} onClick={() => this.props.history.push("/users")}/> &nbsp; Change {header}'s Privilege</p>
        	  		</div>
					<div className="components">
						<div className="input">
							<label>Privilege</label>
							{ this.state.userType === 3 && <select name="userType" onChange={this.changeField} disabled={loading}>
								<option value="3" selected>Regular User</option>
								<option value="1">Administrator</option>
							</select> }
							{ this.state.userType !== 3 && <select name="userType" onChange={this.changeField} disabled={loading}>
								<option value="3">Regular User</option>
								<option value="1" selected>Administrator</option>
							</select> }
						</div>
						{error.generic && <div className="error">{error.generic}</div>}
						<div>
						<button type="button" className="submit width60 float-right" onClick={this.editUtype} disabled={loading}>{saving && <Spinner />}Update Privilege</button>
					</div>
          </div>
			</div>
		</div>;
	};
};

EditUserUtype.propTypes = {
	user: PropTypes.object,
};

export default withRouter(EditUserUtype);
