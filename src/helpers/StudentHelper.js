import store from '../redux/store';
import _ from 'lodash';

export default {
	getStudentId() {
		let student = store.getState().user.student;
		return student.id;
	},
	getStudentName() {
		let student = store.getState().user.student;
		return _.trim(student.firstname);
	},
	getLanguageName(language) {
		if (language === 'English') {
			return 'en';
		} else if (language === 'Marathi') {
			return 'ma';
		} else if (language === 'Hindi') {
			return 'ind';
		} else if (language === 'Bengali') {
			return 'ba';
		} else if (language === 'Kannada') {
			return 'ka';
		} else if (language === 'Telugu') {
			return 'tel';
		} else if (language === 'Odiya') {
			return 'od';
		} else if (language === 'Malayalam') {
			return 'mal';
		} else {
			return 'en';
		}
	},
};
