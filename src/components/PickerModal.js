import React, {Component} from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import Color from '../utility/Color';
import Styles from '../utility/Style';
const {width, height} = Dimensions.get('window');

import SearchInput, {createFilter} from 'react-native-search-filter';
import NoData from './NoData';
let KEYS_TO_FILTERS = ['label', 'value', 'id'];
class PickerModal extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      modalLoading: false,
      modalPicker: false,
      selectedValue: '',
      search: '',
    };
  }

  componentDidMount() {
    let placeholder = this.props.placeholder;
    this.setState({search: ''});

    if (
      this.props.selectedValue &&
      this.props.data != null &&
      this.props.data.length != 0
    ) {
      this.chooseByValue(this.props.selectedValue);
    } else {
      this.setState({selectedValue: placeholder});
    }

    if (this.props.idKey && this.props.labelKey) {
      KEYS_TO_FILTERS = [this.props.idKey, this.props.labelKey];
    }
  }

  componentDidUpdate(prevProps) {
    // console.log(this.props.placeholder, {
    //     newVal: this.props.selectedValue,
    //     oldVal: prevProps.selectedValue,
    //     newDataLength: this.props.data.length,
    //     oldDataLength: prevProps.data.length,
    // })
    if (
      this.props.selectedValue != prevProps.selectedValue ||
      this.props.data.length != prevProps.data.length
    ) {
      this.chooseByValue(this.props.selectedValue);
    }
  }

  chooseByValue(newValue) {
    let data = this.props.data;

    if (data && data.length > 0) {
      data.forEach((item, key) => {
        let itemVal = this.getValue(item);
        // console.log("Itemval", itemVal, newValue);
        if (itemVal == newValue) {
          //console.log("OK Selected");
          this.selected(this.props.selectedValue, key, item);
          this.setState({selectedValue: this.getLabel(item)});
        }
      });
    }
  }

  getValue(item) {
    if (this.props.idKey != null) {
      return item[this.props.idKey];
    }
    return item.id;
  }

  getLabel(item) {
    if (this.props.labelKey != null) {
      return item[this.props.labelKey];
    }
    return item.label;
  }

  searchUpdated(term) {
    this.setState({search: term});
  }

  selected(id, index, item) {
    let selectedValue = this.getLabel(item);
    this.setState({modalPicker: false, selectedValue});
    this.props.onValueChange(id, index);
  }

  picker() {
    let {data} = this.props;

    let showSearchbar = false;
    if (data != null && data.length > 8) {
      showSearchbar = true;
    }

    let {selectedValue, modalPicker} = this.state;
    const filteredData = data.filter(
      createFilter(this.state.search, KEYS_TO_FILTERS),
    );
    filteredData.sort();

    // if (this.props.type == 'dropdown' && modalPicker) {
    //     let arrayOfText = [];

    //     console.log('selectedValue', selectedValue);

    //     filteredData.forEach((item, index) => {
    //         let label = this.getLabel(item);
    //         let selected = this.getValue(item) == selectedValue ? true : false;
    //         arrayOfText.push(
    //             <TouchableOpacity key={index}
    //                 activeOpacity={0.9}
    //                 onPress={() => this.selected(this.getValue(item), index, item)}
    //                 style={[styles.dropdownItem, { backgroundColor: selected ? Color.grayWhite : Color.white }]}>
    //                 <Text style={styles.dropdownText} key={index}>{label}</Text>
    //             </TouchableOpacity>
    //         );
    //     });

    //     return (
    //         <View style={styles.dropdownWrapper}>{arrayOfText}</View>
    //     );
    // }

    // if (this.props.type == 'dropdown' && modalPicker) {
    //     let arrayOfText = [];

    //     console.log('selectedValue', selectedValue);

    //     filteredData.forEach((item, index) => {
    //         let label = this.getLabel(item);
    //         let selected = this.getValue(item) == selectedValue ? true : false;
    //         arrayOfText.push(
    //             <TouchableOpacity key={index}
    //                 activeOpacity={0.9}
    //                 onPress={() => this.selected(this.getValue(item), index, item)}
    //                 style={[styles.dropdownItem, { backgroundColor: selected ? Color.grayWhite : Color.white }]}>
    //                 <Text style={styles.dropdownText} key={index}>{label}</Text>
    //             </TouchableOpacity>
    //         );
    //     });

    //     return (
    //         <View style={styles.dropdownWrapper}>{arrayOfText}</View>
    //     );
    // }

    // if (this.props.type == 'dropdown') {
    //     return (
    //         <View style={styles.dropdownWrapper}>
    //             {filteredData.map((item, index) => {
    //                 return (
    //                     <TouchableOpacity key={index}
    //                         activeOpacity={0.9}
    //                         onPress={() => this.selected(this.getValue(item), index, item)}
    //                         style={styles.dropdownItem}>
    //                         <Text style={styles.dropdownText}>{this.getLabel(item)}</Text>
    //                     </TouchableOpacity>
    //                 );
    //             })};
    //         </View>
    //     )
    // }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalPicker}
        onRequestClose={() => this.setState({modalPicker: false})}>
        <TouchableOpacity
          onPress={() => this.setState({modalPicker: false})}
          activeOpacity={1}
          style={styles.modalRoot}>
          <View style={styles.modalContent}>
            {showSearchbar && (
              <View style={styles.searchBarStyle}>
                <MaterialIcons name="search" size={24} color={Color.gray} />
                <View style={{flex: 1, height: 40}}>
                  <SearchInput
                    onChangeText={(term) => {
                      this.searchUpdated(term);
                    }}
                    style={styles.searchInput}
                    placeholder={'Search '}
                    // clearIcon
                  />
                </View>
              </View>
            )}
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              // style={{ flex:1, alignSelf:'center' }}
              keyboardShouldPersistTaps="handled">
              {filteredData.length == 0 && <NoData>No Data Available</NoData>}
              {filteredData.map((item, index) => {
                let styleModalItem = styles.modalItem;
                if (filteredData.length - 1 == index) {
                  styleModalItem = styles.modalItemNoBorder;
                }
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      this.selected(this.getValue(item), index, item)
                    }
                    style={styleModalItem}>
                    <Text style={styles.modalText}>{this.getLabel(item)}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
  openPicker() {
    if (this.props.data != null && this.props.data.length > 0) {
      this.setState({modalPicker: true});
    } else {
      this.setState({modalPicker: true});
    }
  }

  render() {
    let content = null;
    if (this.props.type == 'dropdown') {
      let inputData = this.props.data.map((item, index) => {
        return {
          // value: this.getValue(item),
          value: this.getLabel(item),
        };
      });

      content = (
        <View style={styles.dropdownWrp}>
          <Dropdown
            inputContainerStyle={[
              {
                borderBottomColor: 'transparent',
                borderBottomWidth: 10,
                height: 80,
              },
            ]}
            // pickerStyle={{ backgroundColor: "#fff", borderWidth: 0 }}
            // containerStyle={{ width: 'auto', flex: 1, borderWidth: 0, paddingBottom: 15 }}

            // disabledLineType='none'
            // label={this.props.label}
            value={this.state.selectedValue}
            data={inputData}
            onChangeText={(value, index, data) => {
              let item = this.props.data[index];
              //console.log("item", item);
              this.selected(this.getValue(item), index, item);
            }}
          />
        </View>
      );
    } else {
      content = (
        <TouchableOpacity
          onPress={() => this.openPicker()}
          activeOpacity={0.7}
          style={[styles.pickerWrapper, this.props.style]}>
          {this.props.iconLeft != null && (
            <MaterialCommunityIcons
              name={this.props.iconLeft}
              size={20}
              style={{marginRight: 4}}
              color={Color.primaryFont}
            />
          )}
          <Text style={[Styles.grayText, {flex: 1}, this.props.textStyle]}>
            {this.state.selectedValue}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            // style={{flex:1,}}
            color={Color.primaryFont}
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={[Styles.column, {marginVertical: 8}]}>
        {this.props.label != null && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[Styles.grayText, {flex: 1}]}>{this.props.label}</Text>
            {this.props.onAdded && (
              <TouchableOpacity
                onPress={() => {
                  this.props.onAdded();
                }}>
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color={Color.black}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        {this.props.error != '' && this.props.error != null && (
          <Text style={styles.errorText}>{this.props.error}</Text>
        )}
        {content}
        <View>{this.picker()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerWrapper: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: 'row',
  },
  searchInput: {
    width: '100%',
    marginTop: Platform.OS == 'ios' ? 10 : 0,
    marginLeft: 5,
    backgroundColor: Color.grayText,
    // backgroundColor: Color.white,
  },
  searchBarStyle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: Color.grayWhite,
    borderRadius: 5,
  },
  errorText: {
    color: Color.danger,
  },
  dropdownWrapper: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    top: -5,
    zIndex: 999999,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderColor: Color.gray,
    borderWidth: 1,
    borderTopWidth: 0,
    paddingVertical: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // backgroundColor: '#fff'
  },
  dropdownText: {
    // color: Color.black,
    // fontSize: 14
  },

  dropdownWrp: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 6,
    marginVertical: 4,
    justifyContent: 'center',
  },

  modalRoot: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    borderRadius: 5,
    backgroundColor: Color.white,
    padding: 10,
    maxHeight: height - 100,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  modalItemNoBorder: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  modalText: {
    color: Color.black,
  },
});

function mapStateToProps(state) {
  return {
    component: state.component,
  };
}
export default connect(mapStateToProps)(PickerModal);
