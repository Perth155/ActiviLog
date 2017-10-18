import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import { fetch_users } from '../../api';

import InnerLoader from '../../common/components/InnerLoader';
import Pagination from '../../common/components/Pagination';

require('../../common/styles/style.css');

class Users extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			users: null,
			error: false,
			page: 1,
			pageItems: 10,
			totalResults: 0,
		};

		this.changePage = this.changePage.bind(this);
		this.loadUsers = this.loadUsers.bind(this);
	}

	componentDidMount() {
		this.loadUsers(this.state.page, this.state.pageItems);
	}

	changePage(direction) {
		if (direction == "forward") {
			const page = this.state.page + 1;
			this.loadUsers(page, this.state.pageItems);
		} else {
			const page = this.state.page - 1;
			this.loadUsers(page, this.state.pageItems);
		}
	}

	loadUsers(page, pageItems) {
		let self = this;
		this.setState({ loading: true });
		fetch_users(page, pageItems).then(response => response.json()).then(function(result) {
			if (result.success == true) {
				let users = [];
				result.result.map(function(result) {
					const values = {
						id: result._id,
						fullName: result.fullName,
						email: result.email,
						userType: result.userType,
					}
					return users.push(values);
				});
				if (users.length == 0) {
					users = null;
				}
				Object.freeze(users);
				self.setState({ loading: false, users: users, page: result.page, totalResults: result.total });
			} else {
				self.setState({ loading: false, users: null, error: true });
			}
		});
	}

	render() {
		const {
			loading,
			users,
			error,
		} = this.state;
		console.log(users);
		return <div className="page width80">
			<div className="header">User Accounts</div>
			{loading && <InnerLoader />}

			{!loading && error && <div className="text-align-center">
					<img src={require('../../common/images/info.png')} />
					<p>There was an error loading the user list :/. Please refresh the page and try again.</p>
			</div>}

			{!loading && !error && users == null && <div className="text-align-center">
					<img src={require('../../common/images/info.png')} />
					<p>You don't yet have users.. click the 'Add User' menu button to get started.</p>
			</div>}


			{!loading && !error && users !== null && <div>
				<table>
					<thead>
						<tr>
							<th style={{ "width": "30%" }}>Full Name</th>
							<th>Email Address</th>
							<th style={{ "width": "10%" }}>Action</th>
						</tr>
					</thead>
					<tbody>
						{!loading && users != null && users.map(res => {
							return <tr key={res.id}>
								<th style={{"fontWeight": "bold" }}>{res.fullName}</th>
								<th>{res.email}</th>
								{res.userType === 3 &&<th>
									<button type="button" style={{"background": "#4CAF50", "color" : "white", "textAlign": "center", "textDecoration": "none", "border":"none", "display": "inline-block", "fontSize": "18px", "cursor": "pointer"}} onClick={() => this.props.history.push("users/edit/" + res.id)}>
											<p> <img src={require('../../common/images/create-new-pencil-button.png')} /> Edit</p>
								  	</button>
								</th>}
								{res.userType !== 3 &&<th>
								</th>}
							</tr>
						})}
					</tbody>
			</table>
			<Pagination page={this.state.page} pageItems={this.state.pageItems} totalResults={this.state.totalResults} changePage={this.changePage} disabled={loading} />
			</div>}
		</div>
	};
};

Users.propTypes = {
	user: PropTypes.object,
};


export default withRouter(Users);
