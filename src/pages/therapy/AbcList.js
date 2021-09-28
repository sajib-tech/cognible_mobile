import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import store from '../../redux/store';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import ParentRequest from '../../constants/ParentRequest';
import NoData from '../../components/NoData';
import LoadingIndicator from '../../components/LoadingIndicator';
import moment from 'moment';
import Color from '../../utility/Color';
import {getStr} from '../../../locales/Locale';
import CalendarView from '../../components/CalendarView';

class AbcList extends Component {
  constructor(props) {
    super(props);

    this.params = this.props.route.params;

    this.state = {
      selectedDate: moment().format('YYYY-MM-DD'),
      isLoading: true,
      abcList: [],
      studentId: this.params.studentId,
    };
  }

  componentDidMount() {
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);

    this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  getData() {
    this.setState({isLoading: true});

    let variables = {
      date: this.state.selectedDate,
      studentId: this.state.studentId,
    };

    console.log('Vars', variables);

    ParentRequest.getAbcList(variables)
      .then((res) => {
        console.log('getAbcList', res);
        let abcList = res.data.getABC.edges;
        this.setState({isLoading: false, abcList});
      })
      .catch((err) => {
        this.setState({isLoading: false});
        Alert.alert('Information', err.toString());
      });
  }

  renderItem(item, index) {
    return (
      <TouchableOpacity
        style={styles.card}
        key={index}
        activeOpacity={0.9}
        onPress={() => {
          this.props.navigation.navigate('AbcDataScreen', {
            studentId: this.state.studentId,
            abcData: item,
            parent: this,
          });
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.badgeTitle, {flex: 1}]}>{getStr("TargetAllocate.Antecedent")} : </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="clock"
              size={15}
              color={Color.primary}
            />
            <Text style={{color: Color.primary}}>{item.node.time}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {item.node.antecedent.edges.map((antecedent, key) => {
            return (
              <View style={styles.cardBadge} key={index + '_a' + key}>
                <Text style={styles.cardBadgeText}>
                  {antecedent.node.antecedentName}
                </Text>
              </View>
            );
          })}

          {item.node.environments && (
            <>
              <View style={{flex: 1}} />
              <View
                style={[styles.cardBadge, {backgroundColor: Color.success}]}>
                <Text style={[styles.cardBadgeText, {color: Color.white}]}>
                  {item.node.environments?.name}
                </Text>
              </View>
            </>
          )}
        </View>
        <Text style={styles.badgeTitle}>{getStr("TargetAllocate.Behavior")} : </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {item.node.behavior.edges.map((behavior, bhvIdx) => {
            return (
              <View style={styles.cardBadge} key={index + '_b' + bhvIdx}>
                <Text style={styles.cardBadgeText}>
                  {behavior.node.behaviorName}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.badgeTitle}> : </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {item.node.consequences.edges.map((cons, bhvIdx) => {
            return (
              <View style={styles.cardBadge} key={index + '_c' + bhvIdx}>
                <Text style={styles.cardBadgeText}>
                  {cons.node.consequenceName}
                </Text>
              </View>
            );
          })}
        </View>
        {/* <Text style={styles.badgeTitle}>Environment : </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <View style={styles.cardBadge}>
                        <Text style={styles.cardBadgeText}>{item.node.environments?.name}</Text>
                    </View>
                </View> */}
      </TouchableOpacity>
    );
  }

  renderList() {
    let {isLoading, abcList, weeks} = this.state;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {abcList.length == 0 && <NoData>{getStr("TargetAllocate.NoABCDataAvailable")}</NoData>}
        {abcList.map((item, index) => {
          return this.renderItem(item, index);
        })}
      </ScrollView>
    );
  }

  renderNewButton() {
    return (
      <Button
        labelButton={getStr('NewChanges.NewABCData')}
        style={{marginBottom: 10}}
        onPress={() => {
          this.props.navigation.navigate('AbcDataScreen', {
            studentId: this.state.studentId,
            parent: this,
          });
        }}
      />
    );
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <NavigationHeader
          title={getStr('NewChanges.ABCData')}
          backPress={() => this.props.navigation.goBack()}
        />

        <Container>
          <CalendarView
            selectedDate={this.state.selectedDate}
            parentCallback={(selectedDate) => {
              this.setState({selectedDate}, () => {
                this.getData();
              });
            }}
          />

          {OrientationHelper.getDeviceOrientation() == 'portrait' &&
            this.renderList()}

          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <>
              <Row style={{flex: 1}}>
                <Column>
                  {this.renderList()}
                  {this.renderNewButton()}
                </Column>
              </Row>
            </>
          )}

          {OrientationHelper.getDeviceOrientation() == 'portrait' &&
            this.renderNewButton()}
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Color.white,
    margin: 3,
    marginBottom: 10,
  },
  cardBadge: {
    backgroundColor: Color.gray,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginBottom: 5,
    marginRight: 5,
  },
  cardBadgeText: {
    color: Color.black,
    fontSize: 14,
  },
  badgeTitle: {
    color: Color.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  authTokenPayload: getAuthTokenPayload(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AbcList);
