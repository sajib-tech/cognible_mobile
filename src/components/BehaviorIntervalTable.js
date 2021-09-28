import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import {Button, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import * as Progress from 'react-native-progress';

const BehaviorIntervalTable = (props) => {
  console.log('table props>>>', props);
  const chunkSize = 5;
  const tableTitle = ['Title', 'Title2', 'Title3', 'Title4'];
  const tableHead = ['Intervals'];
  const [currentTable, setCurrentTable] = useState(props.currentTable);
  const [intervals, setIntervals] = useState(
    parseInt(props.observationTime / props.intervalLength, 10),
  );
  const [checkboxesStatus, setCheckboxesStatus] = useState(
    Array(intervals).fill(false),
  );
  
  const [observationTime, setObservationTime] = useState(props.observationTime);
  const [intervalLength, setIntervalLength] = useState(props.intervalLength);
  const [percent, setPercent] = useState(0);

  

  // console.log("outside checkboxes>>>",checkboxesStatus);

  useEffect(() => {
    setPercent(props.percent);
  }, [props.percent]);

  useEffect(() => {
    if (props.observationTime && props.intervalLength) {
    setIntervals(parseInt(props.observationTime / props.intervalLength, 10));
    }
  }, [props.observationTime, props.intervalLength]);

  useEffect(() => {
    setCurrentTable(props.currentTable);
  }, [props.currentTable]);

  // useEffect(() => {
  //   if (props.observationTime && props.intervalLength) {
  //     setIntervals(props.observationTime / props.intervalLength);
  //   }
  // }, [props.observationTime, props.intervalLength]);

  useEffect(() => {
    if (observationTime && intervalLength) {
      setIntervals(observationTime / intervalLength);
    }
  }, [observationTime, intervalLength]);

  useEffect(() => {
    if (checkboxesStatus) {
      console.log('check 1>>', checkboxesStatus);
      props.updateCheckboxes(checkboxesStatus);
    }
  }, checkboxesStatus);
  
  useEffect(() => {
    console.log('inside effect>>>',props.checkboxesStatus);
    setCheckboxesStatus(props.checkboxesStatus);
  }, [props.checkboxesStatus]);

  useEffect(() => {
    setCheckboxesStatus(Array(intervals).fill(false));
  }, [props.resetFlag]);

  useEffect(() => {
    // alert(props.hitCheckbox);
    hitCheckbox(props.hitCheckbox);
  }, [props.hitCheckbox]);

  const hitCheckbox = (intervals) => {
    setCheckboxesStatus(
      checkboxesStatus.map((element, index) => {
        for (let i = 0; i < intervals.length; i++) {
          if (index === intervals[i] - 1) {
            return true;
          }
        }
        return element;
      }),
    );
  };

  //   const tableTitle = ['Date', 'O or X'];

  const getCheckbox = (i) => {
    // console.log(i, '<------------');
    // console.log(checkboxesStatus);
    return (
      <CheckBox
        key={i.toString()}
        center
        checked={checkboxesStatus[i]}
        onPress={() => {
          setCheckboxesStatus(
            checkboxesStatus.map((element, ind) => {
              if (ind == i) {
                if (!checkboxesStatus[i]) {
                  props.changeFrequency(true);
                } else {
                  props.changeFrequency(false);
                }
                return !checkboxesStatus[i];
              }
              return element;
            }),
          );
        }}
      />
    );
  };

  const tableData = [];
  for (let i = 0; i < intervals; i += 1) {
    tableData.push(i + 1);
  }
  //   const tableData = ['1', '2', '3', '4', '5'];
  const goToPrev = () => {
    if (currentTable > 1) setCurrentTable(currentTable - 1);
  };

  const goToNext = () => {
    if ((currentTable + 1) * chunkSize - intervals < chunkSize) {
      setCurrentTable(currentTable + 1);
    }
  };

  console.log(
    'intervals>>>',
    props.resetFlag,
    props.checkboxesStatus,
    checkboxesStatus,
    props.intervalLength,
    props.observationTime,
  );

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={percent}
        width={null}
        style={{width: '100%', flex: 1, marginBottom: 10}}
      />
      {/* <Table borderStyle={{borderWidth: 1}}>
        <Row
          data={tableHead}
          flexArr={[1, 2, 1, 1]}
          style={styles.head}
          textStyle={styles.text}
        />
        <TableWrapper style={styles.wrapper}>
          <Col
            data={tableTitle}
            style={styles.title}
            heightArr={[28, 28]}
            textStyle={styles.text}
          />
          <Rows
            data={tableData}
            flexArr={[2, 1, 1]}
            style={styles.row}
            textStyle={styles.text}
          />
        </TableWrapper>
      </Table> */}
      <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1}}>
        {/* Left Wrapper */}
        <TableWrapper style={{width: 80}}>
          <Cell data="" style={styles.singleHead} />
          <TableWrapper style={{flexDirection: 'row'}}>
            <Col
              data={['Date', 'O or X']}
              style={styles.head}
              heightArr={[50, 50]}
              textStyle={styles.text}
            />
          </TableWrapper>
        </TableWrapper>

        {/* Right Wrapper */}
        <TableWrapper style={{flex: 1}}>
          <Cell
            data="Intervals"
            style={styles.intervalRowStyle}
            textStyle={styles.text}
          />
          <TableWrapper style={{flex: 1}}>
            <Row
              data={tableData.slice(
                (currentTable - 1) * chunkSize,
                currentTable * chunkSize,
              )}
              style={{flex: 1, height: 50}}
              textStyle={styles.text}
            />
            <Row
              data={tableData
                .slice((currentTable - 1) * chunkSize, currentTable * chunkSize)
                .map((cellData, cellIndex) => {
                  return (
                    <Cell
                      key={cellIndex}
                      data={getCheckbox(
                        (currentTable - 1) * chunkSize + cellIndex,
                      )}
                      style={{height: 50}}
                      textStyle={styles.text}
                    />
                  );
                })}
              style={{flex: 1}}
              textStyle={styles.text}
            />
          </TableWrapper>
          {/* <Cols data={tableData} heightArr={[40, 40]} textStyle={styles.text} /> */}
        </TableWrapper>
      </Table>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="#5555aa"
              style={{marginRight: 10}}
            />
          }
          title="Prev"
          type="outline"
          raised={true}
          containerStyle={{margin: 10}}
          onPress={() => {
            goToPrev();
          }}
        />
        <Button
          iconRight
          icon={
            <Icon
              name="arrow-right"
              size={15}
              color="#5555aa"
              style={{marginLeft: 10}}
            />
          }
          title="Next"
          type="outline"
          raised={true}
          containerStyle={{margin: 10}}
          onPress={() => {
            goToNext();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#fff'},
  singleHead: {width: 80, height: 50, backgroundColor: '#c8e1ff'},
  head: {flex: 1, backgroundColor: '#c8e1ff'},
  intervalRowStyle: {flex: 1, backgroundColor: '#c8e1ff', height: 50},
  title: {flex: 2, backgroundColor: '#f6f8fa'},
  titleText: {marginRight: 6, textAlign: 'right'},
  text: {textAlign: 'center'},
  btn: {
    width: 58,
    height: 18,
    marginLeft: 15,
    backgroundColor: '#c8e1ff',
    borderRadius: 2,
  },
  btnText: {textAlign: 'center'},
  scrollView: {
    marginHorizontal: 0,
  },
  checkbox: {
    alignSelf: 'center',
  },
});

// const forwardedBehaviorIntervalTable = React.forwardRef(BehaviorIntervalTable);

export default BehaviorIntervalTable;
