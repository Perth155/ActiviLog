import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import { fetch_activity, edit_activity, delete_activity } from '../../api';

import SelectColor from './components/colors';
import Spinner from '../../common/components/Spinner';
import {notify} from 'react-notify-toast';

class EditActivity extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			id: "",
			title: "",
			description: "",
			color: "",
			header: "",
			loading: false,
			deleting: false,
			saving: false,
			error: {
				title: null,
				description: null,
				color: null,
				generic: null,
			}
		};

		this.loadActivity = this.loadActivity.bind(this);
		this.editActivity = this.editActivity.bind(this);
		this.deleteActivity = this.deleteActivity.bind(this);
		this.changeField = this.changeField.bind(this);
		this.selectColor = this.selectColor.bind(this);
	}

	componentDidMount() {
		this.loadActivity();
	}

	loadActivity() {
		this.setState({ loading: true });
		const id = document.location.pathname.toString().substr(17);
		let self = this;
		fetch_activity(id).then(response => response.json()).then(function(result) {
			if (result.success) {
				self.setState({
					id: result.message.id,
					title: result.message.title,
					description: result.message.description,
					color: result.message.color,
					header: result.message.title,
					loading: false
				});
			} else {
				self.props.history.push("/activities");
			}
		});
	}


	loadActivity() {
	this.setState({ loading: true });
	const id = document.location.pathname.toString().substr(17);
	let self = this;
	fetch_activity(id).then(response => response.json()).then(function(result) {
		if (result.success) {
			self.setState({
				id: result.message.id,
				title: result.message.title,
				description: result.message.description,
				color: result.message.color,
				header: result.message.title,
				loading: false
			});
		} else {
			self.props.history.push("/activities");
		}
	});
}

	deleteActivity() {
		this.setState({ loading: true, deleting: true });
		const id = this.state.id;
		let self = this;
		delete_activity(id).then(response => response.json()).then(function(result) {
			if (result.success) {
				self.props.history.push("/activities");
			} else {
				this.setState({loading: false, deleting: false, error: {
					generic: "Error. This activity could not succesfully be deleted. Please refresh the page and try again."
				}});
			}
		});
	}

	editActivity() {
		this.setState({ loading: true, saving: true });
		let errors = this.state.error;
		errors.title = "";
		errors.description = "";
		errors.color = "";
		errors.generic = "";

		// Check fields are not empty
		if (this.state.title.trim() == "") {
			errors.title = "Please add an activity title";
		} else {
			errors.title = "";
		}
		if (this.state.description.trim() == "") {
			errors.description = "Please enter a description for this activity";
		} else {
			errors.description = "";
		}
		if (this.state.color.trim() == "") {
			errors.color = "Please assign a color to this activity";
		} else {
			errors.color = "";
		}

		// Attempt save to database
		if (errors.title == "" && errors.description == "" && errors.color == "") {
			let self = this;
			edit_activity(this.state.id, this.state.title, this.state.description, this.state.color).then(response => response.json()).then(function(result) {
				if (result.success == true) {
					notify.show('Activity has successfully been updated');
					self.props.history.push("/activities");
				} else {
					self.setState({ loading: false, saving: false, error: {generic: "Sorry, something went wrong and we could not save your changes. Please refresh the page and try again."} });
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

	selectColor(val) {
		this.setState({color: val});
	}

	render() {
		const {
			title,
			description,
			color,
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
									<p><img src={require('../../common/images/go_back.png')} onClick={() => this.props.history.push("/activities")}/> &nbsp; Edit {header}</p>
					</div>
					<div className="components">
						<div className="input">
							<label>Title</label>
							<input
								type="text"
								name="title"
								value={title}
								onChange={this.changeField}
								disabled={loading}
								placeholder="Title of the Activity"
							/>
							{error.title && <div className="error">{error.title}</div>}
						</div>
						<div className="input">
							<label>Description</label>
							<input
								type="text"
								name="description"
								value={description}
								onChange={this.changeField}
								disabled={loading}
								placeholder="A short description of the Activity"
							/>
							{error.description && <div className="error">{error.description}</div>}
						</div>
						<div className="input">
							<SelectColor color={color} error={error.color} selectColor={this.selectColor} disabled={loading} />
						</div>
						{error.generic && <div className="error">{error.generic}</div>}
						<div>
							<button type="button" className="submit width60 float-right" onClick={this.editActivity} disabled={loading}>{saving && <Spinner />}Update Activity</button>
							<button type="button" className="register width30 float-left" onClick={this.deleteActivity} disabled={loading}>{deleting && <Spinner />}Delete Activity</button>
						</div>
					</div>
			</div>
		</div>;
	};
};

EditActivity.propTypes = {
	user: PropTypes.object,
};

export default withRouter(EditActivity);
