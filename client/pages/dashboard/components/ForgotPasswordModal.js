import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import Spinner from '../../../common/components/Spinner'

const styleModal = {
	content : {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
};

class ForgotPasswordModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			newPW: "",
			repeatNewPW: "",
			currentPW: "",
			loading: false,
			error: {
				newPW: null,
				repeatNewPW: null,
				currentPW: null
			}
		}
	}

	render() {
		const { 
            newPW,
            repeatNewPW,
            currentPW,
			loading,
			error
		} = this.state;

		return (
			<Modal isOpen={this.props.isOpen} onAfterOpen={this.props.onAfterOpen} onRequestClose={this.props.onRequestClose} style={styleModal} contentLabel="Password Update" >
				<h2>Update Password</h2>
				<div className="account_recovery_form">
						<div className="title">
							<h2>Reset Your Password</h2>
						</div>
						<label>New Password:</label>
						<input
							type="password"
							name="password"
							value={newPW}
							disabled={loading}
						/>
						{error.newPW && <div className="error">{error.newPW}</div>}
						<label>Retype New Password:</label>
						<input
							type="password"
							name="repeatPW"
							value={repeatNewPW}
							disabled={loading}
						/>
						{error.repeatNewPW && <div className="error">{error.repeatNewPW}</div>}
						{error.currentPW && <div className="error">{error.currentPW}</div>}
						<div className="enter">
							<button type="button" className="resetPW " onClick={()=>{alert('done')}} disabled={loading}>{loading && <Spinner />}Reset</button>
						</div>
					</div>
					<button onClick={this.props.requestClose}>Close</button>
			</Modal>
		);
	}
}

export default ForgotPasswordModal;
