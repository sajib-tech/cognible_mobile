import React, {Component} from 'react';

import {View, Text, FlatList, StyleSheet,TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class CogniableSelectDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOptionsOpened: false,
            selectedValue: '',
            selectedLabel: this.props.selectedLabel,
            data: this.props.data,
            mealData : [{label: "Breakfast1", value: "Breakfast"},
            {label: "Lunch1", value: "Lunch"},
            {label: "Dinner1", value: "Dinner"} ]
        };
        this.openOptions = this.openOptions.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }
    openOptions() {
        console.log(""+JSON.stringify(this.state)); 
        this.setState({isOptionsOpened: !this.state.isOptionsOpened});
    }
    selectOption(optionLabel, optionValue){
        console.log(""+optionValue); 
        this.setState({selectedLabel: optionValue});
        this.setState({selectedValue: optionValue});
        this.openOptions();
    }
    
    getOptions() {
         let options = [];
         let data = this.state.data;
         let values = Object.keys(data[0]);

         for(var i=0;i < data.length;i++){
             data[i]['name']=data[i][values[1]]
         }

         for(let x=0;x<data.length;x++) {
            options.push(
                <TouchableOpacity  onPress={() => this.selectOption(data[x].id, data[x].name)}>
                    <Text style={styles.selectOptionView} >{data[x].name}</Text>
                </TouchableOpacity>
            );
        }
        return options;
    }
    render() {
        return(
            <View style={{borderWidth: 1, borderRadius: 5, borderColor: '#D5D5D5', position: 'relative'}}>
                <TouchableOpacity  onPress={this.openOptions}>
                    <View style={styles.selectView}>
                        <Text style={styles.selectViewText}>{this.state.selectedLabel}</Text>
                        <FontAwesome5 name={'chevron-down'} style={styles.selectDownArrow} />
                    </View>
                </TouchableOpacity>

                { this.state.isOptionsOpened && (
                    <View style={styles.optionLayout}>
                        {
                            this.getOptions()
                        }
                    </View>
                )}
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    selectView: {
        flexDirection: 'row', 
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#D5D5D5', 
        padding: 15
    },
    optionLayout: {
        width: '100%',
        position: 'relative',
        zIndex: 999999,
        backgroundColor: '#FFFFFF'
    },
    selectViewText: {
        width: '95%',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16, 
        color: '#8F90A6'
    },
    selectDownArrow: {
        width: '5%',
        color: '#8F90A6', 
        fontSize: 16
    },
    selectOptionView: {
        borderWidth: 1, 
        // borderRadius: 5, 
        borderColor: '#D5D5D5', 
        padding: 15
    }
});
export default CogniableSelectDropdown;