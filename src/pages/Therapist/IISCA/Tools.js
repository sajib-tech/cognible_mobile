import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Button from '../../../components/Button';
import Color from '../../../utility/Color';


import PreferenceAttachment from './PreferenceAttachment'
// import Behaviors from './Behaviors'
// import BehaviorChoices from './BehaviorChoices'
// import TopBehaviors from './TopBehaviors1'
// import BehaviorsRange from './BehaviorsRange'
// import AddSituation from './AddSituation'
// import BehaviorReason from './BehaviorReason'
// import Cluster from './BehaviorCluster'
// import AddActivity from './AddActivity'
// import Antecedent from './Antecedent'
// import TransitionTrigger from './TransitionTrigger'
// import AddWay from './AddWay'
// import Consequences from './Consequences'
// import Reinforcer from './Reinforcer'
// import HREnagaged from './HREngaged'
// import CommunicationMotive from './CommunicationMotive'
// import SelfStimulation from './SelfStimulation'

const Tools = (props) => {
  const {
    currentQuestionNo,
    currentAnswer,
    getIISCAParams,
    studentQuestionare,
    studentId,
    program
  } = props;
  const [preferenceDrawer, setPreferenceDrawer] = useState(false);

  const renderModal = () => {
    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={preferenceDrawer}
        onRequestClose={() => {
          setPreferenceDrawer(false);
        }}>
            <TouchableOpacity
          style={styles.modalWrapper}
          activeOpacity={1}
          onPress={() => {
          setPreferenceDrawer(false);


          }}>
              <View style={styles.modalContent}>
              <PreferenceAttachment
              updateMapping={props.updateMapping}
              currentAnswer={currentAnswer}
              currentQuestionNo={currentQuestionNo}
              getIISCAParams={getIISCAParams}
              studentId={studentId}
              program={program}
            />
        </View>

          </TouchableOpacity>
        
      </Modal>
    );
  };

  switch (currentQuestionNo) {
    case 3:
    case 4:
      return (
        <View style={{margin: 10}}>
          <Button
            style={{width: '50%',marginRight:5,
            paddingVertical:0,
            padding:0,
            paddingBottom:0}}
            onPress={() => {
              setPreferenceDrawer(true);
            }}
            labelButton="Preference attachment"
          />
          
            {renderModal()}
          {/* <Drawer
            title="Preference Attachment"
            width="50%"
            placement="right"
            onClose={() => setPreferenceDrawer(false)}
            visible={preferenceDrawer}
            closable
            destroyOnClose
          >
            <PreferenceAttachment
              updateMapping={props.updateMapping}
              currentAnswer={currentAnswer}
              currentQuestionNo={currentQuestionNo}
              getIISCAParams={getIISCAParams}
            />
          </Drawer> */}
        </View>
      );
    // case 5:
    //   return (
    //     <View>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true);
    //         }}
    //         labelButton={'Behavior'}
    //       />

    //       {/* <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <Behaviors
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer> */}
    //     </View>
    //   );
    // case 6:
    //   return (
    //     <BehaviorChoices
    //       currentAnswer={currentAnswer}
    //       currentQuestionNo={currentQuestionNo}
    //       getIISCAParams={getIISCAParams}
    //       updateMapping={props.updateMapping}
    //       studentQuestionare={studentQuestionare}
    //     />
    //   )
    // case 7:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         <Icon type="drag" />
    //         Behavior
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <TopBehaviors
    //           updateMapping={props.updateMapping}
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 8:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Behavior Range
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <BehaviorsRange
    //           updateMapping={props.updateMapping}
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 9:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Behavior Types
    //       </Button>
    //       <Drawer
    //         title="Clusters"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <Cluster
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 10:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Situation and Behavior
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <AddSituation
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 11:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Activity
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <AddActivity
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 12:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Antecedent
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <Antecedent
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 13:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Transition Trigger
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <TransitionTrigger
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 14:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         My Way
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <AddWay
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 15:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Consequence
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <Consequences
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 16:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Reinforcer
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <Reinforcer
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 17:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Engaged
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <HREnagaged
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 18:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Commmunication
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <CommunicationMotive
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 19:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Way
    //       </Button>
    //       <Drawer
    //         title="Preference Attachment"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <SelfStimulation
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )
    // case 20:
    //   return (
    //     <div>
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setPreferenceDrawer(true)
    //         }}
    //       >
    //         Add Behavior Reason
    //       </Button>
    //       <Drawer
    //         title="Behavior Reason"
    //         width="50%"
    //         placement="right"
    //         onClose={() => setPreferenceDrawer(false)}
    //         visible={preferenceDrawer}
    //         closable
    //         destroyOnClose
    //       >
    //         <BehaviorReason
    //           currentAnswer={currentAnswer}
    //           currentQuestionNo={currentQuestionNo}
    //           getIISCAParams={getIISCAParams}
    //           updateMapping={props.updateMapping}
    //           studentQuestionare={studentQuestionare}
    //         />
    //       </Drawer>
    //     </div>
    //   )

    default:
      return <View />;
  }
};

const styles=StyleSheet.create({
    modalWrapper: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: Color.white,
        width: '95%',
        borderRadius: 5,
        padding: 0,
        height: '40%',
      },
      modalTitle: {
        fontSize: 16,
        color: '#000',
      },
})
export default Tools;
