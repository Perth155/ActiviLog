import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import CommunicationVpnKey from 'material-ui/svg-icons/communication/vpn-key'
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app'
import FloatingActionButton  from 'material-ui/FloatingActionButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const styleUpdatePW = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
};

class Admin extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			user,
		} = this.props;

		return <div className="page">
			<div className="welcome">
				Welcome <strong>{user.fullName}</strong>
			</div>
			<div className="box">
				<div className="container">
					<div className="pill">
						<Link to={{pathname: '/records'}}>
							<img src="../../common/images/Records.png" alt="VIEW RECORDS"/> 
							<p>View Student Records</p>
						</Link>
					</div>
				</div>
				<div className="container">
					<div className="pill">
						<Link to={{pathname: '/activities'}}>
							<img src="../../common/images/Activities.png" alt="VIEW ACTIVITIES" /> 
							<p>View & Update Activities</p>
						</Link>
					</div>
				</div>
				<div className="container">
					<div className="pill">
						<Link to={{pathname: '/users'}}>
							<img src="../../common/images/User.png" alt="MANAGE ACCOUNTS"/> 
							<p>Create & Manage Users</p>
						</Link>
					</div>
				</div>
			</div>
			<div>
				{
					(() => { 
						if(window.screen.height > 568 && window.screen.width > 320) {
							return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
								<FloatingActionButton style={ styleUpdatePW } backgroundColor='#FF0000' href='/update_password'>
									<CommunicationVpnKey /> 
								</FloatingActionButton>
							</MuiThemeProvider>
						}
					}) ()
				}
			</div>
		</div>;
	};
};

Admin.propTypes = {
	user: PropTypes.object,
};

export default Admin;
