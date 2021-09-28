import React, { Component } from 'react';

import { Text, View, Image, StyleSheet, TouchableOpacity, Modal, Platform, Share, ScrollView, Dimensions, Alert, TextInput as OldTextInput } from 'react-native';
import Color from '../utility/Color';
import CardView from "react-native-cardview";
import Icon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ParentRequest from '../constants/ParentRequest';
import Snackbar from "react-native-snackbar";

import store from '../redux/store';
import { Container, Column, Row } from './GridSystem';
import Button from './Button';
import TextInput from './TextInput';
import NavigationHeader from './NavigationHeader';
import ImageHelper from '../helpers/ImageHelper';
import moment from 'moment';

const {
	height, width,
} = Dimensions.get('window');

class CommunityCard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			commentData: '',
			comments: [],
			idBlog: '',
			countLikes: this.props.likesCount,
			countComments: this.props.commentsCount,
			title: this.props.title,
			description: this.props.description,


			showEditPage: false,
			commentText: '',
			currentCommentData: null,
			isUpdateComment: false,
			isSavingComment: false,
			isViewAllComment: false,
		}
	}

	componentDidMount() {
		// console.log("Props", this.props);
	}

	addComment(idBlog) {
		this.setState({ isSavingComment: true });
		let variables = {
			pk: this.props.idBlog,
			user: store.getState().user.id,
			comment: this.state.commentData
		};
		console.log('variables', variables)
		ParentRequest.addComments(variables).then(dataResult => {
			console.log("Add Commnetes", dataResult);
			console.log('status', dataResult.data.communityLikesComments.status)

			if (dataResult.data.communityLikesComments.status) {
				let comments = dataResult.data.communityLikesComments.details.comments.edges;

				this.setState({ comments, commentData: '', countComments: comments.length, isSavingComment: false });
			} else {
				alert(dataResult.data.communityLikesComments.message)
				this.setState({ commentData: '', isSavingComment: false });
			}
			if (this.props.onRefresh != null) {
				this.props.onRefresh();
			}
		}).catch(error => {
			Alert.alert("Information", error.toString());
			console.log(error, error.response);
			this.setState({ isSavingComment: false });
		});
	}

	updateComment(comment) {
		this.setState({ commentText: comment.node.comment, currentCommentData: comment, showEditPage: true });
	}

	updateCommentProcess() {
		this.setState({ isUpdateComment: true });

		let variables = {
			pk: this.state.currentCommentData.node.id,
			comment: this.state.commentText
		};

		console.log("Vars", variables);

		ParentRequest.updateComment(variables).then(dataResult => {
			Alert.alert("Information", "Comment Updated");
			this.setState({ isUpdateComment: false });
			if (this.props.onRefresh != null) {
				this.props.onRefresh();
			}
		}).catch(error => {
			Alert.alert("Information", "Cannot Update comment");
			console.log(JSON.parse(JSON.stringify(error)));
			this.setState({ isUpdateComment: false });
		});
	}

	deleteComment(id, commentId) {
		Alert.alert(
			'Information',
			'Are you sure you want to delete this comment?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes', onPress: () => {
						let variables = {
							pk: id,
							comment: commentId
						};
						ParentRequest.deleteComment(variables).then(dataResult => {
							Alert.alert("Information", "Comment Deleted");
							this.setState({ modalVisible: false });
							if (this.props.onRefresh != null) {
								this.props.onRefresh();
							}
						}).catch(error => {
							Alert.alert("Information", "Cannot delete comment");
							console.log(error, error.response);
							this.setState({ isLoading: false });
						});
					}
				},
			],
			{ cancelable: false }
		);
	}

	snackBar(title) {
		Snackbar.show({
			title: title,
			duration: Snackbar.LENGTH_LONG,
			position: "top",
			backgroundColor: Color.success,
			color: Color.white,
		});
	}

	likeBlog(idBlog, countLikes) {
		let variables = {
			pk: idBlog,
			user: store.getState().user.id,
		};
		console.log('variables', JSON.stringify(store.getState().user))
		ParentRequest.likeBlog(variables).then(dataResult => {
			console.log("Add Commnetes", dataResult);
			console.log('status', dataResult.data.communityLikesComments.status)
			if (dataResult.data.communityLikesComments.status) {
				this.setState({ countLikes: countLikes + 1 })
				this.snackBar(dataResult.data.communityLikesComments.message)
			} else {
				this.snackBar(dataResult.data.communityLikesComments.message)
			}
		}).catch(error => {
			console.log(error, error.response);
			this.setState({ isLoading: false });
		});
	}

	async share() {
		const result = await Share.share({
			message: this.props.title + "\n" + this.props.descr,
		});
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				// shared with activity type of result.activityType
			} else {
				// shared
			}
		} else if (result.action === Share.dismissedAction) {
			// dismissed
		}
	}

	deleteGroup(groupId) {
		let variables = {
			pk: groupId,
		};
		console.log('variables', JSON.stringify(variables))
		ParentRequest.deleteGroup(variables).then(dataResult => {
			console.log("Add Commnetes", JSON.stringify(dataResult));
		}).catch(error => {
			console.log('responseee', JSON.stringify(error.response))
			console.log(error, error.response);
			this.setState({ isLoading: false });
		});
	}

	goBack() {
		this.setState({ modalVisible: false })
	}

	renderModal() {
		let userId = store.getState().user.id;
		return (
			<Modal
				animationType="slide"
				onRequestClose={() => {
					this.setState({ modalVisible: false });
					if (this.props.onRefresh != null) {
						this.props.onRefresh();
					}
				}}
				transparent
				visible={this.state.modalVisible}
			>
				<View style={{ backgroundColor: Color.white, flex: 1, }}>
					<NavigationHeader
						title='Comments'
						backPress={() => {
							this.setState({ modalVisible: false });
							if (this.props.onRefresh != null) {
								this.props.onRefresh();
							}
						}}
					/>

					<Container>
						<ScrollView keyboardShouldPersistTaps='never'>
							{this.state.comments.map((comment, key) => {
								return (
									<View style={[styles.commentWrapper, { flexDirection: 'row' }]} key={key}>
										<View style={{ flex: 1 }}>
											<Text style={styles.commentUser}>{comment.node.user.name}</Text>
											<Text style={styles.commentText}>{comment.node.comment}</Text>
										</View>
										{comment.node.user.id == userId && (
											<>
												<TouchableOpacity style={styles.deleteButton} onPress={() => {
													this.updateComment(comment);
												}}>
													<MaterialCommunityIcons name='pencil' size={20} color={Color.primary} />
												</TouchableOpacity>

												<View style={{ width: 10 }} />

												<TouchableOpacity style={styles.deleteButton} onPress={() => {
													this.deleteComment(this.props.idBlog, comment.node.id);
												}}>
													<MaterialCommunityIcons name='trash-can' size={20} color={Color.danger} />
												</TouchableOpacity>
											</>
										)}
									</View>
								);
							})}
						</ScrollView>
						<Row style={{ paddingBottom: 10 }}>
							<Column style={{ flex: 3 }}>
								<AutoGrowingTextInput style={styles.commentNewText}
									placeholder={'Write a comment...'}
									value={this.state.commentData}
									placeholderTextColor="black"
									underlineColorAndroid="transparent"
									onChangeText={text => this.setState({ commentData: text })}
								/>
							</Column>
							<Column style={{ flex: 1 }}>
								<Button labelButton='Send'
									style={{ height: 30 }}
									onPress={() => {
										this.addComment(this.props.idBlog);
									}} />
							</Column>
						</Row>
					</Container>
				</View>

				{this.state.showEditPage && (
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => {
							this.setState({ showEditPage: false });
						}}
						style={{
							width: '100%', height: '100%', position: 'absolute',
							backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
						}}>
						<TouchableOpacity activeOpacity={1} style={{
							width: 300, borderRadius: 6,
							backgroundColor: Color.white, padding: 10
						}}>
							<TextInput onChangeText={(commentText) => { this.setState({ commentText }) }}
								value={this.state.commentText}
								autoFocus={true}
								label='Comment'
							/>
							<Button labelButton='Update Comment'
								isLoading={this.state.isUpdateComment}
								onPress={() => {
									this.updateCommentProcess();
								}} />
						</TouchableOpacity>
					</TouchableOpacity>
				)}
			</Modal>
		);
	}

	render() {
		let userId = store.getState().user.id;
		return (
			<View style={styles.cardBlock}>
				<View style={styles.header} >
					<Image style={styles.groupIcon} source={this.props.cardIcon ? this.props.cardIcon : { uri: ImageHelper.getImage('') }} />

					<View style={styles.titleBlock}>
						<Text style={styles.title} >{this.props.title}</Text>
						<Text style={styles.count}>{this.props.countText}</Text>
						{this.props.time != null && <Text style={styles.count}>{moment(this.props.time).format("MMM DD, YYYY, HH:mm")}</Text>}
					</View>

					{this.props.statusName == 'group' &&
						<>
							{this.props.showUpdateButton && (
								<>
									<TouchableOpacity
										onPress={() => {
											this.props.onDeletePress();
										}}>
										<MaterialCommunityIcons name='trash-can' size={20} color={Color.primary} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											this.props.onEditPress();
										}}>
										<MaterialCommunityIcons name='pencil' size={20} color={Color.primary} />
									</TouchableOpacity>
								</>
							)}
							<TouchableOpacity
								onPress={() => {
									this.props.onAddPress();
								}}>

								<MaterialCommunityIcons name='plus' size={20} color={Color.primary} />
							</TouchableOpacity>
						</>
					}
				</View>
				{/* numberOfLines={3} ellipsizeMode='tail' */}
				<Text style={styles.descr}>
					{this.props.descr}
				</Text>
				{this.props.cardType && this.props.cardType === 'latest' && (
					<>
						<View style={styles.footer} >
							<TouchableOpacity onPress={() => {
								this.setState({ idBlog: this.props.idBlog })
								this.likeBlog(this.props.idBlog, this.props.likesCount);
								console.log('this.props.comments', this.props.comments)
							}} activeOpacity={0.8}
							>
								<View style={styles.favorite}>
									<MaterialCommunityIcons name='heart-outline' size={16} color={Color.blackFont} />
									<Text style={styles.favCount}>{this.state.countLikes}</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {
								this.setState({ modalVisible: true, comments: this.props.comments, idBlog: this.props.idBlog })
								console.log('this.props.comments', this.props.comments)
							}} activeOpacity={0.8}
							>
								<View style={styles.chat}>
									<MaterialCommunityIcons name='message-outline' size={16} color={Color.blackFont} />
									<Text style={styles.chatCount}>{this.state.countComments}</Text>
								</View>
							</TouchableOpacity>
							<View style={{ flex: 1 }} />
							<TouchableOpacity style={styles.share} onPress={() => {
								this.share();
							}}>
								<MaterialCommunityIcons name='share-variant' size={16} color={Color.blackFont} />
							</TouchableOpacity>
						</View>

						{this.props.comments.length != 0 && <View style={{ height: 1, backgroundColor: Color.gray, marginVertical: 10 }} />}

						{this.props.comments.map((comment, key) => {
							if (this.state.isViewAllComment || key < 5) {
								return (
									<View key={key} style={{ flexDirection: 'row' }}>
										<View style={styles.inlineCommentAvatar}>
											<Text style={styles.inlineCommentAvatarText}>{comment.node.user.name.substr(0, 1).toUpperCase()}</Text>
										</View>
										<View style={styles.inlineCommentWrapper}>
											<Text style={styles.inlineCommentTitle}>{comment.node.user.name}</Text>
											<Text style={styles.inlineCommentText}>{comment.node.comment}</Text>
										</View>
										<View style={{ width: 80, flexDirection: 'row' }}>
											{comment.node.user.id == userId && (
												<>
													<TouchableOpacity style={styles.deleteButtonSmall} onPress={() => {
														this.updateComment(comment);
													}}>
														<MaterialCommunityIcons name='pencil' size={20} color={Color.primary} />
													</TouchableOpacity>

													<TouchableOpacity style={styles.deleteButtonSmall} onPress={() => {
														this.deleteComment(this.props.idBlog, comment.node.id);
													}}>
														<MaterialCommunityIcons name='trash-can' size={20} color={Color.danger} />
													</TouchableOpacity>
												</>
											)}
										</View>
									</View>
								);
							}
							return null;
						})}

						{(!this.state.isViewAllComment && this.props.comments.length > 5) && <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
							<TouchableOpacity style={styles.buttonViewAll} onPress={() => {
								// this.setState({ isViewAllComment: true })
								if (this.props.onViewMore) {
									this.props.onViewMore();
								}
							}}>
								<Text style={{ color: Color.white }}>View All Comment</Text>
							</TouchableOpacity>
						</View>}

						<View style={{ height: 1, backgroundColor: Color.gray, marginVertical: 10 }} />

						<Row style={{ paddingBottom: 10 }}>
							<Column style={{ flex: 3 }}>
								<AutoGrowingTextInput style={styles.commentNewText}
									placeholder={'Write a comment...'}
									value={this.state.commentData}
									placeholderTextColor="black"
									underlineColorAndroid="transparent"
									onChangeText={text => this.setState({ commentData: text })}
								/>
							</Column>
							<Column style={{ flex: 1 }}>
								<Button
									style={{ height: 35 }}
									isLoading={this.state.isSavingComment}
									labelButton='Post'
									onPress={() => {
										this.addComment(this.state.idBlog);
									}} />
							</Column>
						</Row>
					</>
				)}
				{/* {this.renderModal()} */}

				<Modal
					animationType="fade"
					onRequestClose={() => {
						this.setState({ showEditPage: false });
					}}
					transparent
					visible={this.state.showEditPage}
				>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => {
							this.setState({ showEditPage: false });
						}}
						style={{
							width: '100%', height: '100%', position: 'absolute',
							backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center'
						}}>
						<TouchableOpacity activeOpacity={1} style={{
							width: 300, borderRadius: 6,
							backgroundColor: Color.white, padding: 10
						}}>
							<TextInput onChangeText={(commentText) => { this.setState({ commentText }) }}
								value={this.state.commentText}
								autoFocus={true}
								label='Comment'
							/>
							<Button labelButton='Update Comment'
								isLoading={this.state.isUpdateComment}
								onPress={() => {
									this.updateCommentProcess();
								}} />
						</TouchableOpacity>
					</TouchableOpacity>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cardBlock: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 10,
		margin: 3,
		marginBottom: 12,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
		backgroundColor: '#fff'
	},
	commentWrapper: {
		backgroundColor: Color.primary,
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 10,
		margin: 5,
		marginTop: 10
	},
	commentUser: {
		color: Color.white,
		fontSize: 13,
		fontWeight: 'bold',
		opacity: 0.8
	},
	commentText: {
		color: Color.white,
		fontSize: 15,
	},
	commentNewText: {
		borderRadius: 5,

	},
	buttonViewAll: {
		backgroundColor: Color.primary,
		borderRadius: 5,
		paddingHorizontal: 8,
		paddingVertical: 5
	},

	header: {
		flexDirection: 'row'
	},
	groupIcon: {
		width: 44, height: 44, borderRadius: 4
	},
	plus: {
		width: 20, height: 20
	},
	status: {
		color: '#FF9C52',
		fontSize: 13
	},
	titleBlock: {
		marginLeft: 9,
		flex: 1
	},
	title: {
		color: Color.blackFont,
		fontSize: 15,
	},
	count: {
		color: Color.grayDarkFill,
		fontSize: 10,
	},
	descr: {
		color: '#63686E',
		fontSize: 13,
		marginTop: 5
	},
	footer: {
		flexDirection: 'row',
		marginTop: 5
	},
	favorite: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	chat: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10
	},
	favIcon: {
		width: 18, height: 15
	},
	favCount: {
		marginLeft: 5,
		color: Color.blackFont,
		fontSize: 15
	},
	chatIcon: {
		width: 18, height: 16
	},
	chatCount: {
		marginLeft: 7,
		color: Color.blackFont,
		fontSize: 16
	},
	shareIcon: {
		width: 18, height: 18
	},
	deleteButtonSmall: {
		width: 30,
		height: 30,
		borderRadius: 5,
		backgroundColor: Color.white,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
        borderColor: Color.gray,
        marginLeft: 10
	},
	deleteButton: {
		width: 50,
		height: 50,
		borderRadius: 5,
		backgroundColor: Color.white,
		justifyContent: 'center',
		alignItems: 'center',
	},

	/** Inline Comment */
	inlineCommentAvatar: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: Color.primaryTransparent,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 7
	},
	inlineCommentAvatarText: {

	},
	inlineCommentWrapper: {
		backgroundColor: Color.gray,
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 7,
		marginBottom: 5,
		flex: 1
	},
	inlineCommentTitle: {
		fontSize: 13,
		fontWeight: 'bold',
		color: Color.blackFont
	},
	inlineCommentText: {
		fontSize: 15,
		color: Color.blackFont
	}
});

export default CommunityCard;