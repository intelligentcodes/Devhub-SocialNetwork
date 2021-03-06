import React, { PureComponent } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Icon, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
	FacebookShareButton,
	LinkedinShareButton,
	WhatsappShareButton,
	FacebookIcon,
	WhatsappIcon,
	LinkedinIcon
} from "react-share";
import { deletePost, addLike, removeLike } from "../../actions/postActions";
import CommentForm from "../Post/CommentForm";
import CommentFeed from "../Post/CommentFeed";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

class PostItem extends PureComponent {
	state = {
		liked: false
	};

	onDeleteClick = id => {
		this.props.deletePost(id);
	};

	onLikeClick = id => {
		this.setState({ liked: true });
		this.props.addLike(id);
	};
	onUnlikeClick = id => {
		this.setState({ liked: false });
		this.props.removeLike(id);
	};

	toggleShareButtons = () => {
		let btns = document.getElementById("sharebuttons");
		btns.classList.toggle("active");
	};

	findUserLike = likes => {
		const { auth } = this.props;
		if (likes.filter(like => like.user === auth.user.id).length > 0)
			this.setState({ liked: true });
		else this.setState({ liked: false });
	};

	render() {
		const { liked } = this.state;
		const { post, auth } = this.props;
		const Segment = styled.div`
			border-radius: 0.5rem;
			box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
			margin-bottom: 2rem;
			background-color: #fff;
			padding: 2rem;
			font-family: "Montserrat", sans-serif;
			box-sizing: border-box;
		`;

		this.findUserLike(post.likes);

		let shareUrl = `${window.location.origin}/post/${post._id}`;
		let title = post.text;
		return (
			<div>
				<Segment>
					<div>
						<div className="postitem-top">
							<Link to={`/profile/${post.handle}`}>
								<img src={post.avatar} alt={post.name} />
							</Link>
							<div className="postitem-top-right">
								<div>
									<Link to={`/profile/${post.handle}`}>
										<strong>{post.name}</strong>
									</Link>
									<p>{`${new Date(post.date).getDate()} ${
										months[new Date(post.date).getMonth()]
									}, ${new Date(post.date).getFullYear()}`}</p>
								</div>
								<div>
									{post.user === auth.user.id ? (
										<Icon
											title="Delete"
											link
											color="red"
											circular
											name="trash alternate"
											style={{ marginRight: "15px", cursor: "pointer" }}
											onClick={() => this.onDeleteClick(post._id)}
										/>
									) : null}
								</div>
							</div>
						</div>
						<br />
						<p className="postitem-text">{post.text}</p>

						<div className="postitem-bottom">
							<div>
								{!liked && (
									<Icon
										onClick={() => this.onLikeClick(post._id)}
										name="heart outline"
									/>
								)}
								{liked && (
									<Icon
										color="red"
										onClick={() => this.onUnlikeClick(post._id)}
										name="heart"
									/>
								)}
								{post.likes.length > 0 && post.likes.length}

								<Link to={`/post/${post._id}`}>
									<Icon name="comment outline" />
								</Link>
								<Icon
									name="share alternate"
									onClick={this.toggleShareButtons}
								/>
							</div>
							<div>
								<div id="sharebuttons">
									<FacebookShareButton
										style={{ marginRight: ".5rem" }}
										url={shareUrl}
										quote={title}
									>
										<FacebookIcon size={28} round />
									</FacebookShareButton>
									<WhatsappShareButton
										style={{ marginRight: ".5rem" }}
										url={shareUrl}
										title={title}
										separator=":: "
										className="Demo__some-network__share-button"
									>
										<WhatsappIcon size={28} round />
									</WhatsappShareButton>
									<LinkedinShareButton
										url={shareUrl}
										title={title}
										style={{ marginRight: ".5rem" }}
										windowWidth={750}
										windowHeight={600}
										className="Demo__some-network__share-button"
									>
										<LinkedinIcon size={28} round />
									</LinkedinShareButton>
								</div>
							</div>
						</div>
					</div>
					<Divider />
					<h5 style={{ marginTop: 0, fontSize: ".8rem" }}>Comments:</h5>
					<CommentFeed postId={post._id} comments={post.comments} />
					<br />
					<CommentForm postId={post._id} />
				</Segment>
			</div>
		);
	}
}

PostItem.defaultProps = {
	showActions: true
};

const mapStateToProps = ({ auth }) => {
	return { auth };
};

export default connect(
	mapStateToProps,
	{ deletePost, addLike, removeLike }
)(PostItem);
