import React from "react";
import PropTypes from "prop-types";
import Collapsible from "react-collapsible";

import Loading from "../../../common/components/Loading";
import List from "../../../common/components/List";
import { fetchPosts } from '../../../api';

class User extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			postData: null,
			error: false,
		}
		
		this.loadPosts = this.loadPosts.bind(this);
	}
	
	componentDidMount() {
		this.loadPosts();		
	}
	
	loadPosts() {
		let self = this;
		this.setState({loading: true});
		
		//Get user post data
		fetchPosts(this.props.user.id).then(response => response.json()).then(function(result) {
			if (result.success == true) {
				let postData = [];
				
				result.posts.map(function(post) {
					
					const values = {
						title: post.title,
						desc: post.desc,
						startTime: new Date(post.startTime),
						endTime: new Date(post.endTime),
						date: new Date(post.startTime),
					}
					return postData.push(values);
				});
				if (postData.length == 0) {
					postData = null;
				}
				
				self.setState({postData: postData, loading: false});
			} else {				
				self.setState({loading: false, postData: null, error: true});
			}
		});
	}
	
	render() {
		const {
			loading,
			postData,
			error,
		} = this.state;  
		
		return <div className="page">
			<div className="welcome">
				Welcome <strong>{this.props.user.fullName}</strong>
			</div>
			
			{!loading && error && <div className="error">
				<img src={require('../../../common/images/info.png')} />
				<p>There was an error loading the posts. Please refresh the page and try again.</p>
			</div>}
			
			{!loading && !error && postData == null && <div>
				<img src={require('../../../common/images/info.png')} />
				<p>No posts were found. Click publish to get started</p>
			</div>}
			
			{!loading && !error && postData != null && <div>
				<List posts={this.state.postData} />
			</div>}
		</div>;
	};
};

User.propTypes = {
	user: PropTypes.object,
};

export default User;
