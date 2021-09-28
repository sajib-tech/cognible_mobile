import React, { Component } from 'react';

import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../utility/Color';
import Button from './Button';
import ParentRequest from '../constants/ParentRequest';

class PreferredItemView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			// description: props.description.trim()
		};
	}

	deletePItem() {
		Alert.alert(
			'Information',
			'Are you sure want to delete this item ?',
			[
				{ text: 'No', onPress: () => { }, style: 'cancel' },
				{
					text: 'Yes', onPress: () => {
						let variables = {
							id: this.props.itemId
						};
						ParentRequest.deletePrefItem(variables).then((result) => {
							Alert.alert("Information", "Delete Preferred Item successfully.");							

							setTimeout(() => {
								this.props.getData()

							}, 1000);
						}).catch((error) => {
							Alert.alert("Information", error.toString());
						});
					}
				},
			],
			{ cancelable: false }
		);

	}

	render() {
		return (
			<TouchableOpacity style={styles.preferredItemView} activeOpacity={0.9} onPress={() => {
				this.props.onPress();
			}}>
				<View style={styles.content}>
					<Text style={styles.preferredItemTitle}>{this.state.title}</Text>
					{/* <Text style={styles.preferredItemDescription}>
						{this.state.description}
					</Text> */}
				</View>
				<MaterialCommunityIcons name='lead-pencil' size={20} color={Color.gray} style={{marginRight:10}} />
				<MaterialCommunityIcons
                        name="delete"
                        size={20}
                        color={Color.gray}
						onPress={()=>{
							this.deletePItem()
						}}
                      />
			</TouchableOpacity>
		);
	}
}
const styles = StyleSheet.create({
	content: {
		flex: 1
	},
	preferredItemView: {
		borderRadius: 5,
		backgroundColor: '#ffffff',
		margin: 3,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
		paddingHorizontal: 16,
		paddingVertical: 8,
		flexDirection: 'row',
		alignItems: 'center'
	},
	preferredItemTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: Color.primary,
	},
	preferredItemDescription: {
		fontSize: 13,
		fontWeight: 'normal',
		color: 'rgba(95, 95, 95, 0.75)'
	}
});

export default PreferredItemView;
