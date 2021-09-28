import React, { Component } from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color from '../utility/Color';
import Button from './Button';

// @required props

// isVisible: booleaan
// modalHide : fn
// selectedItems : array
// items : array
// selectItems : fn

//note: use shortcircuiting where you will import this

class MultiSelectComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: true,
			selectedItems: this.props.selectedItems,
		};
	}

	componentDidMount() {
		console.log('componentDidMountmounted====>');
		this.setState({ selectedItems: this.props.selectedItems });
	}
	toggleResponse = item => {
		let { selectedItems } = this.state;
		if (selectedItems.includes(item.id)) {
			let newSelected = selectedItems.filter(el => el != item.id);
			this.setState({ selectedItems: newSelected });
		} else {
			let newSelected = [...selectedItems, item.id];
			this.setState({ selectedItems: newSelected });
		}
	};
	render() {
		let { isVisible, modalHide, items, selectItems } = this.props;
		let { selectedItems } = this.state;

		let listItem = items.map((item, index) => {
			let selected = selectedItems && selectedItems.includes(item.id);
			return (
				<TouchableOpacity
					style={styles.items}
					key={index + 'select'}
					onPress={() => this.toggleResponse(item)}>
					<Text
						style={
							selected ? { color: 'green', fontWeight: 'bold' } : { color: 'black' }
						}>
						{item.name}
					</Text>
					{selected && <FontAwesome5 name="check" />}
				</TouchableOpacity>
			);
		});

		return (
			<Overlay
				width={300}
				height={350}
				isVisible={isVisible}
				onBackdropPress={modalHide}>
				<View style={styles.container}>
					<Text style={{ fontSize: 16, color: Color.blackFont, textAlign: 'center', marginVertical: 5 }}>Select Items</Text>
					<View style={{ height: 1, backgroundColor: Color.gray, marginVertical: 5 }} />
					<ScrollView>{listItem}</ScrollView>

					<Button
						labelButton="Submit"
						style={{ marginTop: 10 }}
						onPress={() => {
							selectItems(selectedItems, this.props.selector);
						}}
					/>
				</View>
			</Overlay>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		borderBottomWidth: 0.3,
		borderBottomColor: 'grey',
	},
	textHeading: {
		fontSize: 20,
		padding: 10,
	},
	items: {
		padding: 5,
		paddingVertical: 10,
		marginVertical: 2,
		backgroundColor: '#f5f5ef',
		borderColor: 'grey',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
});

export default MultiSelectComponent;
