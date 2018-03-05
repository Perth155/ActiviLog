import React from "react"
import PropTypes from "prop-types"
import { Redirect } from 'react-router-dom'
import validatePassword from '../../common/utilities/validatePassword'
import validateCharacters from '../../common/utilities/validateCharacters'
import { check_password_reset_token } from '../../api';
import { Link } from 'react-router-dom';
import swal from 'sweetalert'

import LoginFooter from '../../common/components/LoginFooter';
import Spinner from '../../common/components/Spinner';
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

    checkPageForValidity() {
		console.log(this.state.organizationName + '   ' + this.state.resetToken)
        if(this.state.organizationName && this.state.resetToken){
            check_password_reset_token(this.state.organizationName.toLowerCase(), this.state.resetToken.toLowerCase()).then(response => response.json()).then(function(result) {
                if (result.valid == false) {
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
                self.setState({ loading: false });
            });
        }
    }

	componentDidMount() {
        const resetTokenFromURL = (location.pathname).split('/')[3]
		const orgNameFromURL = (location.pathname).split('/')[2]
		console.log(resetTokenFromURL.toString() + '   ' +orgNameFromURL.toString() )
		this.setState({resetToken: resetTokenFromURL.toString()})
		this.setState({organizationName: orgNameFromURL.toString()})
		console.log('pre-- -- '+this.state.organizationName + '   ' + this.state.resetToken)
        this.checkPageForValidity()
	}

	changeField(evt) {
		if (evt.target.name == "password") {
			if (validatePassword(evt.target.value)) {
				this.setState({[evt.target.name]: evt.target.value});
				return;
			} else {
				return;
			}
		}
		this.setState({[evt.target.name]: evt.target.value});
	}

    updatePassword(pass) {

	}
	
	navigateHome() {
		//document.location.href='/login'
	}

	passwordReset() {
		this.setState({ loading: true });
		let errors = this.state.error;
		errors.password = ''
		errors.repeatPW = ''
		errors.pwReset =  ''

		if (validatePassword(this.state.password) == false) {
			errors.pw = 'Please enter a valid password. A valid password contains a minimum of 8 characters, at least a letter [A-Z,a-z], and a number.[0-9].';
		} else {
			errors.pw = ''
        }
        if(this.state.password !== this.state.repeatPW) {
            errors.repeatPW = 'The passwords do not match.'
        } else {
            errors.repeatPW = ''
        }
		
		
		if (errors.pwReset !== '' || errors.pwReset !== '' || errors.repeatPW == '') {
			this.setState({ loading: false });
			this.setState({error: errors});
			return;
		}
		const self = this;
        updatePassword(self.state.password);
        self.setState({ loading: false });
        self.setState({error: errors});
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
                { !validatedAccess  &&
                    <div className='account_recovery_form_fail'>
                        <div className='title'>
                            <h2>You Should Not Be Here</h2>
                        </div>
                        {error.pwReset && <div className="error">{error.pwReset}</div>}
                        <br/>Press the button below to go back home<br/>
                        <div className="enter">
							<button type="button" className="resetPW" onClick={this.navigateHome} disabled={loading}>{loading && <Spinner />}Home</button>
						</div>
                    </div>
                }
                { validatedAccess &&
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
							<button type="button" className="resetPW " onClick={this.updatePassword} disabled={loading}>{loading && <Spinner />}Reset</button>
						</div>
					</div>
                }
				</div>
			</div>
			<LoginFooter />
		</div>
	};
};

