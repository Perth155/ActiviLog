import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import { fetch_activities, publish_post } from '../../api';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import Spinner from '../../common/components/Spinner';
import {notify} from 'react-notify-toast';
import TimePicker from 'react-times';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-times/css/classic/default.css';

class Publish extends React.Component {
	constructor(props) {
		super(props);

		const dateToday = moment().format();

		this.state = {
			title: "",
			description: "",
			date: dateToday,
			startTime: "07:00",
			endTime: "08:30",
			activity: "",
			discipline: "",
			location: "",
			notes: "",
			loading: false,
			saving: false,
			activities: null,
			error: {
				title: null,
				description: null,
				date: null,
				activity: null,
				discipline: null,
				location: null,
				notes: null,
				generic: null,
			}
		};

		this.loadActivities = this.loadActivities.bind(this);
		this.publish = this.publish.bind(this);
		this.changeField = this.changeField.bind(this);
		this.selectActivity = this.selectActivity.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.onStartTimeChange = this.onStartTimeChange.bind(this);
		this.onEndTimeChange = this.onEndTimeChange.bind(this);
	}

	componentDidMount() {
		this.loadActivities();
	}

	loadActivities() {
		this.setState({ loading: true });
		let self = this;
		fetch_activities(1, 10000).then(response => response.json()).then(function(result) {
			if (result.success) {
				let activities = [];
				result.result.map(function(result) {
					const values = {
						id: result._id,
						title: result.title,
					}
					return activities.push(values);
				});
				if (activities.length == 0) {
					activities = null;
				}
				Object.freeze(activities);
				self.setState({ loading: false, activities: activities });
			} else {
				self.props.history.push("/");
			}
		});
	}

	publish() {
		this.setState({ loading: true, saving: true });
		let errors = this.state.error;
		errors.title = "";
		errors.description = "";
		errors.date = "";
		errors.activity = "";
		errors.discipline = "";

		// Check fields are not empty
		if (this.state.title.trim() == "") {
			errors.title = "Please add a title for this post";
		} else {
			errors.title = "";
		}
		if (this.state.description.trim() == "") {
			errors.description = "Please enter a description for this post";
		} else {
			errors.description = "";
		}
		if (this.state.date == "" || !moment(this.state.date).isValid()) {
			errors.date = "Please enter a valid date";
		} else {
			errors.date = "";
		}
		// Check the two times
		const beginningTime = moment(this.state.startTime, 'hh:mm');
		const endTime = moment(this.state.endTime, 'hh:mm');

		if (beginningTime.isBefore(endTime) == false) {
			errors.date = "Please ensure your start and end times are correct";
		} else {
			errors.date = "";
		}
		if (this.state.activities !== null && this.state.activity.trim() == "") {
			errors.activity = "Please select an activity from the menu";
		} else {
			errors.activity = "";
		}
		if (this.state.discipline.trim() == "") {
			errors.discipline = "Please enter a discipline";
		} else {
			errors.discipline = "";
		}

		// Attempt save to database
		if (errors.title == "" && errors.description == "" && errors.date == "" && errors.activity == "" && errors.discipline == "") {
			// Construct the final date objects
			const bt = moment(this.state.startTime, 'hh:mm');
			const et = moment(this.state.endTime, 'hh:mm');
			const startTime = moment(this.state.date).set('hours', bt.get('hours')).set('minutes', bt.get('minutes')).toISOString();
			const endTime = moment(this.state.date).set('hours', et.get('hours')).set('minutes', et.get('minutes')).toISOString();

			const properties = {
				title: this.state.title,
				description: this.state.description,
				activity: this.state.activity,
				discipline: this.state.discipline,
				location: this.state.location,
				startTime: startTime,
				endTime: endTime,
				notes: this.state.notes,
			}
		
			let self = this;
			publish_post(properties).then(response => response.json()).then(function(result) {
				if (result.success == true) {
					notify.show('Post has successfully been published');
					self.props.history.push("/");
				} else {
					self.setState({ loading: false, saving: false, error: {generic: "Sorry, something went wrong and we could not publish your post. Please refresh the page and try again."} });
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

	selectActivity(evt) {
		if (evt.target.value == "Select an activity from the drop-down list") {
			this.setState({activity: ""});
		} else {
			this.setState({activity: evt.target.value});
		}
	}

	handleDateChange(evt) {
		const dateString = evt.format();
		this.setState({date: dateString});
	}

	onStartTimeChange(time) {
		this.setState({startTime: time});
	}

	onEndTimeChange(time) {
		this.setState({endTime: time});
	}

	render() {
		const { 
			title,
			description,
			date,
			startTime,
			endTime,
			activity,
			discipline,
			location,
			notes,
			error,
			loading,
			saving,
			activities
		} = this.state;

		const {
			user,
		} = this.props;

		// Create a moment date object
		let momentObj = null;
		if (date != "") {
			let dateObj = new Date(date);
			momentObj = moment(dateObj);
		}

		let startmer = "AM";
		if (parseInt(startTime.substr(0, 2)) >= 12) {
			startmer = "PM"
		}

		let endmer = "AM";
		if (parseInt(endTime.substr(0, 2)) >= 12) {
			endmer = "PM"
		}

		return <div className="page">
			<div className="box">
					<div className="title">Add New Entry</div>
					<div className="components">
						<div className="input">
							<label>Title</label>
							<input
								type="text"
								name="title"
								value={title}
								onChange={this.changeField}
								disabled={loading}
								placeholder="Title of the event"
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
								placeholder="A short description of the event completed"
							/>
							{error.description && <div className="error">{error.description}</div>}
						</div>

						<div className="input">
							<div className="input width50">
								<label>Date</label>
								<DatePicker
									selected={momentObj}
									onChange={this.handleDateChange}
									disabled={loading}
									minDate={moment().add(-2, "days")}
									maxDate={moment()}
									placeholderText="Day of Month"
									className="date"
									dateFormat="DD/MM/YY"
								/>
							</div>
							<div style={{ "height": "75px" }}>
								<div className="width24 marginr14 float-left">
									<label>Start Time</label>
									<TimePicker
										withoutIcon={true}
										time={startTime}
										theme="classic"
										meridiem={startmer}
										onTimeChange={this.onStartTimeChange}
									/>
								</div>
								<div className="width24 float-left">
									<label>End Time</label>
									<TimePicker
										withoutIcon={true}
										time={endTime}
										theme="classic"
										meridiem={endmer}
										onTimeChange={this.onEndTimeChange}
									/>
								</div>
							</div>
							{error.date && <div className="error">{error.date}</div>}
						</div>
						{activities && <div className="input width50">
							<label>Activity</label>
							<select disabled={loading} onChange={this.selectActivity}>
								<option key={0} name={""}>
									Select an activity
								</option>
								{activities.map(function(result) {
									return <option key={result.id} value={result.id} name={result.id}>
										{result.title}
									</option>
								})}
							</select>
							{error.activity && <div className="error">{error.activity}</div>}
						</div>}
						<div className="input">
							<label>Discipline</label>
							<input
								type="text"
								className="width50"
								name="discipline"
								value={discipline}
								onChange={this.changeField}
								disabled={loading}
								placeholder="Discipline of the activity"
							/>
							{error.discipline && <div className="error">{error.discipline}</div>}
						</div>
						<div className="input">
							<label>Location</label>
							<input
								type="text"
								className="width50"
								name="location"
								value={location}
								onChange={this.changeField}
								disabled={loading}
								placeholder="Location of the activity. Venue, Building etc"
							/>
							{error.location && <div className="error">{error.location}</div>}
						</div>

						<div className="input">
							<label>Notes</label>
							<textarea
								name="notes"
								value={notes}
								onChange={this.changeField}
								disabled={loading}
								placeholder="Any notes or comments you would like to share"
							/>
							{error.notes && <div className="error">{error.notes}</div>}
						</div>

						{error.generic && <div className="error">{error.generic}</div>}
						<div>
							<button type="button" className="submit" onClick={this.publish} disabled={loading}>{saving && <Spinner />}Publish</button>
						</div>
					</div>
			</div>
		</div>;
	};
};

Publish.propTypes = {
	user: PropTypes.object,
};

export default withRouter(Publish);
