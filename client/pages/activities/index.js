import React from "react";
import PropTypes from "prop-types";

import {withRouter} from "react-router-dom";
import { fetch_activities } from '../../api';

import InnerLoader from '../../common/components/InnerLoader';
import Pagination from '../../common/components/Pagination';

const path = '/activities'; //for testing

class Activities extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			activities: null,
			error: false,
			page: 1,
			pageItems: 10,
			totalResults: 0,
		};
		
		this.changePage = this.changePage.bind(this);
		this.loadActivities = this.loadActivities.bind(this);
	}

	componentDidMount() {
		this.loadActivities(this.state.page, this.state.pageItems);
	}

	changePage(direction) {
		if (direction == "forward") {
			const page = this.state.page + 1;
			this.loadActivities(page, this.state.pageItems);
		} else {
			const page = this.state.page - 1;
			this.loadActivities(page, this.state.pageItems);
		}
	}

	loadActivities(page, pageItems) {
		let self = this;
		this.setState({ loading: true });
		fetch_activities(page, pageItems).then(response => response.json()).then(function(result) {
			if (result.success == true) {
				let activities = [];
				result.result.map(function(result) {
					const values = {
						id: result._id,
						title: result.title,
						description: result.description,
						color: result.color,
					}
					return activities.push(values);
				});
				if (activities.length == 0) {
					activities = null;
				}
				Object.freeze(activities);
				self.setState({ loading: false, activities: activities, page: result.page, totalResults: result.total });
			} else {
				self.setState({ loading: false, activities: null, error: true });
			}
		});
	}
	
	render() {
		const {
			loading,
			activities,
			error,
		} = this.state;

		return <div className="page width80">
			<div className="header">Activities</div>
			{loading && <InnerLoader />}

			{!loading && error && <div className="text-align-center">
					<img src={require('../../common/images/info.png')} />
					<p>There was an error loading the activities list. Please refresh the page and try again.</p>
			</div>}

			{!loading && !error && activities == null && <div className="text-align-center">
					<img src={require('../../common/images/info.png')} />
					<p>You don't yet have any activities. click the 'Add Activity' menu button to get started.</p>
			</div>}

			{!loading && !error && activities !== null && <div>
				<table>
					<thead>
						<tr>
							<th style={{ "width": "30%" }}>Name</th>
							<th>Description</th> 
							<th style={{ "width": "10%" }}>Colour</th>
							<th style={{ "width": "10%" }}>Action</th>
						</tr>
					</thead>
					<tbody>
						{!loading && activities != null && activities.map(res => {
							return <tr key={res.id}>
								<th style={{"fontWeight": "bold" }}>{res.title}</th>
								<th>{res.description}</th>
								<th style={{"background": res.color }} />
								<th>
									<button type="button" style={{"background": "#4CAF50", "color" : "white", "textAlign": "center", "textDecoration": "none", "border":"none", "display": "inline-block", "fontSize": "18px", "cursor": "pointer"}} onClick={() => this.props.history.push("activities/edit/" + res.id)}>
											<p> <img src={require('../../common/images/create-new-pencil-button.png')} /> Edit</p>
								  	</button>
								</th>
							</tr>
						})}
					</tbody>
			</table>
			<Pagination page={this.state.page} pageItems={this.state.pageItems} totalResults={this.state.totalResults} changePage={this.changePage} disabled={loading} />
			</div>}
		</div>
	};
};

Activities.propTypes = {
	user: PropTypes.object,
};

export default withRouter(Activities);
