import React, {Component} from 'react';

import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../redux/actions/index';
import store from '../redux/store';
import Button from './Button';
import {Row, Column} from './GridSystem';
import PickerModal from './PickerModal';
import Color from '../utility/Color';
import {getStr} from '../../locales/Locale';
import LoadingIndicator from './LoadingIndicator';
import ParentRequest from '../constants/ParentRequest';
import {colors} from 'react-select/src/theme';

class BehaviourTemplateCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isPress: false,
      environment:
        props.environments.length > 0
          ? props.environments[0].node.id
          : 'RW52aXJvbm1lbnRUeXBlOjI=',
      primaryKey: '',
      intensity: 'severe',
      frequency: 0,
      //	irt: 0,
      showTimer: '00:00',
      totalSeconds: 0,
      isPendingRes: false,
    };
  }

  componentDidMount() {
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
  }

  createDecelObect() {
    let vars = {
      templateId: this.props.id,
    };

    console.log(
      'create decel callled-453=0=5305=-405=-405=3-05=-50=3-50=304=50=4503=-50',
    );

    console.log('create decelrecord vars======-=---=-=-=-=-=-=-=-=-', vars);
    ParentRequest.createDecelRecord(vars)
      .then((res) => {
        console.log('ParentRequest.createDecelRecord', res);
        if (res.data.createDecel.details) {
          this.setState(
            {primaryKey: res.data.createDecel.details.id, isPress: true},
            () => {
              this.startTimer();
            },
          );
        }
      })
      .catch((err) => {});
  }

  startTimer() {
    let seconds = 0;
    this.timer = setInterval(() => {
      ++seconds;
      let sec = this.pad(seconds % 60);
      let min = this.pad(parseInt(seconds / 60));
      this.setState({
        showTimer: min + ':' + sec,
        totalSeconds: seconds,
      });
    }, 1000);
  }

  pad(val) {
    let valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    } else {
      return valString;
    }
  }

  callFrequencyUpdate(type) {
    let initialValue = this.state.frequency;
    let {primaryKey, totalSeconds} = this.state;

    if (initialValue > 0 || type === 'plus') {
      let queryParams = {
        pk: primaryKey,
        time: totalSeconds,
        count: type === 'plus' ? initialValue + 1 : initialValue - 1,
      };
      ParentRequest.updateDecelFrequency(queryParams)
        .then((res) => {
          if (res.data.updateDecelFrequency.details) {
            let freqLength =
              res.data.updateDecelFrequency.details.frequency.edges.length;
            this.setState({frequency: freqLength, isPendingRes: false});
          }
        })
        .catch((err) => {
          Alert.alert(
            'Information',
            'Cannot update frequency.\n' + err.toString(),
          );
        });
    }
  }

  handleSubmit() {
    let {primaryKey, environment, intensity, totalSeconds} = this.state;
    let queryParams = {
      pk: primaryKey,
      environment: environment,
      //	irt: irt,
      intensity: intensity,
      note: '',
      duration: totalSeconds * 1000, //showTimer
    };
    clearInterval(this.timer);
    this.setState({frequency: 0});
    this.setState({showTimer: '00:00'});
    ParentRequest.updateDecelRecord(queryParams)
      .then((data) => {
        Alert.alert(
          'Information',
          'Data Successfully Saved',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                if (!this.props.fromSession) {
                  this.props.navigation.goBack();
                }

                if (this.props.onSaved) {
                  this.props.onSaved();
                }
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((err) => {});
    this.setState({isPress: false});
  }

  render() {
    let {
      isLoading,
      isPress,
      showTimer,
      environment,
      intensity,
      frequency,
      irt,
    } = this.state;
    let {
      key,
      title,
      description,
      statusName,
      environments,
      measurments,
      id,
      data,
      studentId,
      fromSession,
      onSaved,
      onEdit,
      isActive,
    } = this.props;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (isPress) {
      let environmentPickerList = environments.map((el) => {
        return {
          id: el.node.id,
          label: el.node.name,
        };
      });

      return (
        <View style={styles.card}>
          <Text style={{width: '100%', fontSize: 24, textAlign: 'center'}}>
            {showTimer}
          </Text>
          <Row>
            <Column style={{justifyContent: 'center'}}>
      <Text style={styles.textLeft}>{getStr("TargetAllocate.Title")}</Text>
            </Column>
            <Column style={{alignItems: 'flex-end'}}>
              <Text style={styles.textLeft}>{title}</Text>
            </Column>
          </Row>
          <View style={{height: 10}} />
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("BegaviourData.Status")}</Text>
            </Column>
            <Column style={{alignItems: 'flex-end'}}>
              <Text style={styles.textLeft}>{statusName}</Text>
            </Column>
          </Row>
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("TargetAllocate.Environment")}</Text>
            </Column>
            <Column>
              <PickerModal
                placeholder=""
                selectedValue={environment}
                data={environmentPickerList}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({environment: itemValue});
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("NewChanges.Intensity")}</Text>
            </Column>
            <Column>
              <PickerModal
                placeholder=""
                selectedValue={intensity}
                data={[
                  {id: 'severe', label: getStr("NewChanges.Severe")},
                  {id: 'moderate', label: getStr("NewChanges.Moderate")},
                  {id: 'mild function', label: getStr("NewChanges.MildFunction")},
                ]}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({intensity: itemValue});
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column style={{justifyContent: 'center'}}>
              <Text style={styles.textLeft}>{getStr("NewChanges.Frequency")}</Text>
            </Column>
            <Column style={{alignItems: 'flex-end'}}>
              <Row>
                <Column>
                  <Button
                    theme="secondary"
                    labelButton={
                      <MaterialCommunityIcons
                        name="minus"
                        size={30}
                        color={Color.primary}
                      />
                    }
                    onPress={() => {
                      this.callFrequencyUpdate('minus');
                      frequency > 0
                        ? this.setState({frequency: frequency - 1})
                        : this.setState({frequency: 0});
                      this.setState({isPendingRes: true});
                    }}
                  />
                </Column>
                {this.state.isPendingRes ? (
                  <View style={[styles.counterText, {flex: 1}]}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : (
                  <Column>
                    <Text style={styles.counterText}>{frequency}</Text>
                  </Column>
                )}
                <Column>
                  <Button
                    theme="secondary"
                    labelButton={
                      <MaterialCommunityIcons
                        name="plus"
                        size={30}
                        color={Color.primary}
                      />
                    }
                    onPress={() => {
                      this.callFrequencyUpdate('plus');
                      this.setState({frequency: frequency + 1});
                      this.setState({isPendingRes: true});
                    }}
                  />
                </Column>
              </Row>
            </Column>
          </Row>

          <View style={{height: 10}} />

          {/* <Row>
						<Column style={{ justifyContent: 'center' }}>
							<Text style={styles.textLeft}>IRT</Text>
						</Column>
						<Column style={{ alignItems: 'flex-end' }}>
							<Row>
								<Column>
									<Button
										theme='secondary'
										labelButton={<MaterialCommunityIcons name='minus' size={30} color={Color.primary} />}
										onPress={() => (irt > 0 ? this.setState({ irt: irt - 1 }) : null)}
									/>
								</Column>
								<Column>
									<Text style={styles.counterText}>{irt}</Text>
								</Column>
								<Column>
									<Button
										theme='secondary'
										labelButton={<MaterialCommunityIcons name='plus' size={30} color={Color.primary} />}
										onPress={() => this.setState({ irt: irt + 1 })}
									/>
								</Column>
							</Row>
						</Column>
					</Row>

					<View style={{ height: 20 }} /> */}

          <Button
            labelButton={getStr("TargetAllocate.ClickToSubmit")}
            onPress={() => {
              this.handleSubmit();
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.title, {flex: 1}]}>{title}</Text>
          {isActive && (
            <TouchableOpacity
              onPress={() => {
                onEdit();
              }}>
              <MaterialCommunityIcons
                name="lead-pencil"
                size={20}
                color={Color.blackOpacity}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.description}>{description}</Text>

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Text style={{color: '#63686E', fontSize: 13, fontWeight: '500'}}>
            {statusName}
          </Text>
          <Text
            style={{
              top: -7,
              paddingLeft: 10,
              color: '#C4C4C4',
              fontSize: 18,
              fontWeight: '700',
            }}>
            .
          </Text>
          <Text style={styles.intensity}>
            {environments.length + ' ' + 'Environments'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity>
            <Text
              style={{
                width: '100%',
                textAlign: 'left',
                color: '#63686E',
                fontWeight: '500',
              }}>
              <FontAwesome5 name={'clock'} style={{paddingRight: 5}} />
              {' ' + getStr('BegaviourData.BehaviorGraph')}
            </Text>
          </TouchableOpacity>
          <Text style={{color: isActive ? 'green' : 'red'}}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          {isActive && (
            <Button
              labelButton="Deactivate"
              style={{flex: 1, margin: 5}}
              onPress={() => {
                this.props.onDeactivate();
              }}
            />
          )}
          {!isActive && (
            <Button
              labelButton="Activate"
              style={{flex: 1, margin: 5}}
              onPress={() => {
                this.props.onActivate();
              }}
            />
          )}
          {isActive && (
            <Button
              labelButton="Record Behaviour"
              style={{flex: 1, margin: 5}}
              onPress={() => {
                this.createDecelObect();
              }}
            />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.blackFont,
    marginRight: 17,
  },
  description: {
    paddingTop: 10,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 13,
    fontWeight: 'normal',
  },
  intensity: {
    paddingLeft: 10,
    color: '#63686E',
    fontSize: 13,
    fontWeight: '500',
  },
  highIntensity: {
    color: '#FF8080',
  },
  mediumIntensity: {
    color: '#FF9C52',
  },
  lowIntensity: {
    color: '#4BAEA0',
  },
  enviroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  pickerStyleEnviroment: {
    width: 200,
    marginTop: -15,
  },
  textLeft: {
    fontSize: 16,
  },
  counter: {
    flexDirection: 'row',
    marginRight: 17,
  },
  counterText: {
    fontSize: 18,
    color: Color.primary,
    textAlign: 'center',
    marginTop: 10,
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BehaviourTemplateCard);
