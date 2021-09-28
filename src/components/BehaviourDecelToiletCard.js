/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class BehaviourDecelToiletCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			time: props.time,
			riskType: props.riskType,
		};
	}
	render() {
		return (
			<TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => {
				if (this.props.onPress) {
					this.props.onPress();
				}
			}}>
				<Text style={styles.title}>{this.state.title}</Text>
				<View style={{ flexDirection: 'row', paddingTop: 10 }}>
					<Text style={{ color: '#63686E', fontSize: 13, fontWeight: '500' }}>
						{this.state.time}
					</Text>
					<Text
						style={{
							top: -7,
							paddingLeft: 10,
							fontSize: 18,
							fontWeight: '700',
							color:
								this.state.riskType === 'Independent Request'
									? '#4BAEA0'
									: 'red',
						}}>
						.</Text>
					<Text
						style={{
							paddingLeft: 10,
							color:
								this.state.riskType === 'Independent Request'
									? '#4BAEA0'
									: 'red',
							fontSize: 13,
							fontWeight: '500',
						}}>
						{this.state.riskType}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}
const styles = StyleSheet.create({
	card: {
		padding: 10,
		borderRadius: 4,
		margin: 3,
		flex: 1,
		borderColor: 'rgba(0, 0, 0, 0.05)',
		borderWidth: 0.5,

		shadowColor: '#ccc',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 2,
		shadowOpacity: 1.85,
		elevation: 3,

		backgroundColor: '#fff'
	},
	title: {
		color: '#45494E',
		fontSize: 16,
		fontWeight: '700',
	},
	risk: {
		paddingLeft: 10,
		color: '#63686E',
		fontSize: 13,
		fontWeight: '500',
	},
});
export default BehaviourDecelToiletCard;
