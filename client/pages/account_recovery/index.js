import React from "react"
import PropTypes from "prop-types"
import { Redirect } from 'react-router-dom'
import validatePassword from '../../common/utilities/validatePassword'
import validateCharacters from '../../common/utilities/validateCharacters'
import { check_password_reset_token, reset_forgotten_password } from '../../api';
import { Link } from 'react-router-dom';
import swal from 'sweetalert'

import LoginFooter from '../../common/components/LoginFooter';
import Spinner from '../../common/components/Spinner';
import InnerLoader from '../../common/components/InnerLoader';

require('../../common/styles/style.css');

export class AccountRecovery extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
            resetToken: "",
            password: "",
            repeatPW: "",
            validatedAccess: false,
            organizationName: null,
			loading: false,
			error: {
				password: null,
                repeatPW: null,
                pwReset: null
			}
        }
        
        this.changeField = this.changeField.bind(this)
        this.checkPageForValidity = this.checkPageForValidity.bind(this)
        this.passwordReset = this.passwordReset.bind(this)
		this.updatePassword = this.updatePassword.bind(this)
		this.navigateHome = this.navigateHome.bind(this)
	}

    checkPageForValidity(resToken, orgName) {
		let errors = this.state.error;
		const self = this;
		self.setState({ loading:true })
        if(orgName && resToken){
            check_password_reset_token(orgName.toLowerCase(), resToken.toLowerCase()).then(response => response.json()).then(function(result) {
                if (result.success == false) {
                    errors.pwReset = 'We could not reset your password at this stage, this could be because your Password Reset Token has expired.';
                    self.setState({
                        error: errors,
                        loading: false
                    });
                    return;
                } else {
                    errors.pwReset = "";
                    self.setState({
                        error: errors,
                        validatedAccess: true,
                        loading: false
                    });
                    return;
                }
            }).catch(function(err) {
				console.error(err)
                self.setState({ loading: false });
            });
        }
    }

	componentDidMount() {
        const resetTokenFromURL = (location.pathname).split('/')[3]
		const orgNameFromURL = (location.pathname).split('/')[2]
		this.checkPageForValidity(resetTokenFromURL, orgNameFromURL)
		this.setState({resetToken: resetTokenFromURL.toString(), organizationName: orgNameFromURL.toString()})
	}

	changeField(evt) {
		this.setState({[evt.target.name]: evt.target.value});
	}

	
	navigateHome() {
		document.location.href='/login'
	}


	updatePassword(cb) {
		let errors = this.state.error;
		const self = this;
		if(this.state.password) {
            reset_forgotten_password(this.state.organizationName.toLowerCase(), this.state.resetToken.toLowerCase(), this.state.password).then(response => response.json()).then(function(result) {
                if (!result.success) {
                    errors.pwReset = 'We could not reset your password at this stage, please try again later.';
                    self.setState({
                        error: errors,
                        loading: false
                    });
                    return;
                } else {
					errors.pwReset = "";
                    self.setState({
                        error: errors,
						loading: false
					});
                }
            }).catch(function(err) {
				console.error(err)
				self.setState({ loading: false });
				return;
			});
			cb()
		}
	}

	passwordReset() {
		this.setState({ loading: true });
		let errors = this.state.error;
		errors.password = ''
		errors.repeatPW = ''
		errors.pwReset =  ''
		if (validatePassword(this.state.password) === false) {
			errors.password = 'Please enter a valid password. A valid password contains a minimum of 8 characters, at least a letter [A-Z,a-z], and a number.[0-9].';
		} else {
			errors.password = ''
        }
        if(this.state.password !== this.state.repeatPW) {
            errors.repeatPW = 'The passwords do not match.'
        } else {
            errors.repeatPW = ''
        }
		
		
		if (errors.pwReset !== '' || errors.password !== '' || errors.repeatPW !== '') {
			this.setState({ loading: false });
			this.setState({error: errors});
		} else {
			this.updatePassword(() => {
				swal({
					icon: 'success',
					title: 'Password Reset Successfully',
					text: 'Your password has been successfully reset. Log in again to start using ActiviLog',
					closeOnConfirm: false
				})
				.then (() => {
					document.location.href = '/login';
				})
			});
		}
	}

	render() {
		const { 
            resetToken,
            password,
            repeatPW,
            validatedAccess,
            organizationName,
			loading,
			error
		} = this.state;

		const {
			registerError,
		} = this.props;


		return <div id="authenticate" className="color-wrap">
			<div className="container">
				<div className="logo">
					<Link to={{pathname: '/'}}>
						<img src={require('../../common/images/logo_text.png')} />
					</Link>
				</div>
				<div className="modal">
				{
					(loading && !validatedAccess) && <InnerLoader />
				}
                { (!loading && !validatedAccess)  &&
                    <div className='account_recovery_form_fail'>
                        <div className='title'>
                            <h2>Oops...</h2>
                        </div>
                        {error.pwReset && <div className="error">{error.pwReset}</div>}
                        <br/>Press the button below to go back home<br/>
                        <div className="enter">
							<button type="button" className="resetPW" onClick={this.navigateHome} disabled={loading}>{loading && <Spinner />}Home</button>
						</div>
                    </div>
                }
                { (!loading && validatedAccess) &&
					<div className="account_recovery_form">
						<div className="title">
							<h2>Reset Your Password</h2>
						</div>
						<label>New Password:</label>
						<input
							type="password"
							name="password"
							value={password}
							onChange={this.changeField}
							disabled={loading}
						/>
						{error.password && <div className="error">{error.password}</div>}
						<label>Retype New Password:</label>
						<input
							type="password"
							name="repeatPW"
							value={repeatPW}
							onChange={this.changeField}
							disabled={loading}
						/>
						{error.repeatPW && <div className="error">{error.repeatPW}</div>}
						{error.pwReset && <div className="error">{error.pwReset}</div>}
						<div className="enter">
							<button type="button" className="resetPW " onClick={this.passwordReset} disabled={loading}>{loading && <Spinner />}Reset</button>
						</div>
					</div>
                }
				</div>
			</div>
			<LoginFooter />
		</div>
	};
};

