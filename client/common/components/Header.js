import React from "react";
import PropTypes from "prop-types";

import { Route } from 'react-router';
import { Link, Switch } from 'react-router-dom';

import { ACCOUNT_TYPE } from "../config";

import Search from "./Search"

require('../styles/header.css');

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			user,
			logout
		} = this.props;

		if (user.loggedIn == false || user.userType == ACCOUNT_TYPE.UNREGISTERED || user.userType == null) {
			return null;
		}

		const path = document.location.pathname.toString();

		const isAdmin = user.userType == ACCOUNT_TYPE.ADMINISTRATOR;
		const isSupervisor = user.userType == ACCOUNT_TYPE.SUPERVISOR;
		const isUser = user.userType == ACCOUNT_TYPE.USER;

		if(isUser) {
			return <div id={"header"}>
			<div>
				<ul>
					<div className="logo"><Link to={{pathname: '/'}}>
						<img src={require('../images/logo_text_small.png')} />
					</Link></div>
					<li>
						<Link to={{pathname: '/'}} className={path == "/" ? "active" : ""}>
							<img src={require('../images/menu_home.png')} />
							<span>Home</span>
						</Link>
					</li>
					<li>
						<Link to={{pathname: '/publish'}} className={path.includes("/publish") ? "active" : ""}>
							<img src={require('../images/menu_add.png')} />
							<span>Publish</span>
						</Link>
					</li>
					<li className={"logout-button"}>
						<a onClick={this.props.logout}>
							<img src={require('../images/menu_logout.png')} />
							<span>Logout</span>
						</a>
					</li>
				</ul>
			</div>
			</div>;
		}
		if(isAdmin || isSupervisor) {
			return <div>
				<div id={"header"}>
					<div>
						<ul>
							<div className="logo"><Link to={{pathname: '/'}}>
								<img src={require('../images/logo_text_small.png')} />
							</Link></div>
							<li>
								<Link to={{pathname: '/'}} className={path == "/" ? "active" : ""}>
									<img src={require('../images/menu_home.png')} />
									<span>Home</span>
								</Link>
							</li>
							<li>
								<Link to={{pathname: '/records'}} className={path.includes("/records") ? "active" : ""}>
									<img src={require('../images/menu_records.png')} />
									<span>Records</span>
								</Link>
							</li>
							<li>
								<Link to={{pathname: '/activities'}} className={path.includes("/activities") ? "active" : ""}>
									<img src={require('../images/menu_activities.png')} />
									<span>Activities</span>
								</Link>
							</li>
							<li>
								<Link to={{pathname: '/users'}} className={path.includes("/users") ? "active" : ""}>
									<img src={require('../images/menu_accounts.png')} />
									<span>Accounts</span>
								</Link>
							</li>
							<li className={"logout-button"}>
								<a onClick={this.props.logout}>
									<img src={require('../images/menu_logout.png')} />
									<span>Logout</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<Switch>
					<Route path="/records" render={() =>
						<div id={"sub-header"}>
							<ul>
								<li>
									<a>
										<span>Export Records (.csv)</span>
									</a>
								</li>
								<li>
									<a>
										<span>Export Records (.xlsx)</span>
									</a>
								</li>
								<Search />
							</ul>
						</div>
					}/>
					<Route path="/activities" render={() =>
						<div id={"sub-header"}>
							<ul>
								<li>
									<Link to={{pathname: '/activities'}} className={path == "/activities" ? "active" : ""}>
										<span>All Activities</span>
									</Link>
								</li>
								<li>
									<Link to={{pathname: '/activities/add'}} className={path == "/activities/add" ? "active" : ""}>
										<span><img src={require('../images/round-add-button.png')} />  Add Activity</span>
									</Link>
								</li>
							</ul>
						</div>
					}/>
					<Route path="/users" render={() =>
						<div id={"sub-header"}>
							<ul>
								<li>
									<Link to={{pathname: '/users'}} className={path == "/users" ? "active" : ""}>
										<span>All Accounts</span>
									</Link>
								</li>
								<li>
									<Link to={{pathname: '/users/add'}} className={path == "/users/add" ? "active" : ""}>
										<span> <img src={require('../images/add-user-button.png')}/> Add Account</span>
									</Link>
								</li>
							</ul>
						</div>
					}/>
				</Switch>
			</div>;
		}
	};
};

Header.propTypes = {
	user: PropTypes.object,
	logout: PropTypes.func,
	path: PropTypes.object,
};

export default Header;
