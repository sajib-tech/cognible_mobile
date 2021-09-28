import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import moment from 'moment';
import { client, getNotes } from '../../constants/therapist';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';

class NotesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notes: [],
			loadingNotes: true
		}
	}

	componentDidMount() {
		this.getResultData();
	}

	getResultData=()=> {
		const { master } = this.props.route.params;
		console.log("masterid>>",master);
		client.query({
			query: getNotes,
			variables: {
				id: master
			},
			fetchPolicy:'network-only'
		}).then(result => {
			console.log("noteslist>>>>",result.data);
			this.setState({
				notes: result.data.vbmappGetNotes.edges,
				loadingNotes: false
			})
		}).catch(err => console.log(">>>>",JSON.stringify(err)));
	}

	render() {
		const { testNo, master, student } = this.props.route.params;
		const { notes, loadingNotes } = this.state;
		return (
			<SafeAreaView style={styles.container}>
				<NavigationHeader
					backPress={() => this.props.navigation.goBack()}
					title="Notes"
				/>
				<Container>
					<ScrollView>
						{notes && notes.length === 0 && <Text style={{ margin: 10 }}>There are no notes for this assessment.</Text>}
						{loadingNotes && <ActivityIndicator />}
						{notes && notes.length > 0 && notes.map(note =>
							<View style={styles.noteContainer}>
								<View style={
									{
										flexDirection:'row',
										justifyContent:'space-between'
									}
								}>
									<Text>{moment(note.node.masterRecord.date).format('YYYY-MM-DD')}</Text>
									<Text>{note.node.area.areaName}</Text>
								</View>
								<Text style={styles.noteDetails}>{note.node.note}</Text>
							</View>
						)}
						<TouchableOpacity onPress={() => this.props.navigation.navigate('CreateNote', {
							testNo: testNo,
							master: master,
							student: student,
							parent:this
						})} style={styles.buttonFilled}>
							<Text style={styles.buttonText}>Create Note</Text>
						</TouchableOpacity>
					</ScrollView>
				</Container>
			</SafeAreaView>

		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Color.white
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	pageHeading: {
		fontSize: 24,
		fontWeight: '700',
		flex: 1,
		textAlign: 'center'
	},
	heading: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 10
	},
	noteContainer: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		padding: 20,
		marginVertical: 10
	},
	noteDetails: {
		marginTop: 20
	},
	buttonFilled: {
		padding: 20,
		borderRadius: 10,
		backgroundColor: '#3E7BFA',
		marginBottom: 40
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'center'
	}
})

export default NotesList;