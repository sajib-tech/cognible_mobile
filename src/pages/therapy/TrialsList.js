import {arrayOf} from 'prop-types';
import React, {Component} from 'react';
import {View} from 'react-native';
import Color from '../../utility/Color';

class TrialsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      dailyTrails,
      boxWidth,      
      sbtStepKey = '',
      targetList,
      currentTargetIndex,
    } = this.props;
    let object = [];

    if (!(sbtStepKey === ''))
      object = targetList[currentTargetIndex].node.sbt
        ? targetList[currentTargetIndex].node.sbt[sbtStepKey]
        : undefined;
    let colorList = new Array(dailyTrails).fill('');
    if (object && object.length > 0) {
      object.map((item, index) => {
        if (item.trial === 'CORRECT') {
          // colorList.push('#4BAEA0')
          colorList[index] = '#4BAEA0';
        }
        if (item.trial === 'ERROR') {
          colorList[index] = '#FF8080';

          // colorList[index].push('#FF8080')
        }
        if (item.trial === 'INCORRECT') {
          colorList[index] = '#FF8080';

          // colorList[index].push('#FF8080')
        }
        if (item.trial === 'PROMPT') {
          colorList[index] = '#FF9C52';

          // colorList[index].push('#FF9C52')
        }
      });
    }
    // console.log("colorList>>>",colorList);

    const trials = [];
    let i = 0;
    for (i = 0; i < dailyTrails; i++) {
      trials.push({
        height: '15px',
        flexDirection: 'row',
        borderColor: '#999999',
        borderWidth: 1,
        width: boxWidth,
        backgroundColor: colorList[i] ? colorList[i] : '',
        paddingLeft: 20,
        borderRadius: 2,
        marginRight: 5,
      });
    }
    // console.log("trials>>>",trials);
    // console.log("trials>>>",trials.map(i=>{
    //     console.log("ii>>>>",i);
    // }),object);
    return (
      <>
        <View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            {trials.map((i, index) => {
              // console.log("item>>",i.backgroundColor,colorList,index,i.backgroundColor!=='');
              if (index === dailyTrails) return;
              else {
                return (
                  <View
                    key={index.toString()}
                    style={{
                      height: 20,
                      flex: 1,
                      borderWidth: 1,
                      width: boxWidth,
                      borderRadius: 5,
                      marginLeft: 3,
                      backgroundColor:
                        i.backgroundColor === '' ? 'white' : i.backgroundColor,
                      borderColor: '#999999',
                    }}></View>
                );
              }
            })}
          </View>
          <View></View>
        </View>
      </>
    );
  }
}

export default TrialsList;
