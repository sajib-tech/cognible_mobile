import {gql} from 'apollo-boost';
import moment from 'moment';

import {client} from '../../../constants/ApolloClient';
import {
  externalToInternal,
  internalToExternal,
} from '../../../utility/PointType';

import * as actions from '../celeration-chart/action-types/panel.action-type';

export const setStudentId = (value) => {
  return (dispatch, getState) => {
    dispatch({
      type: actions.setStudentId,
      studentId: value,
    });
  };
};
export const fetchAllCelerationCategories = () => {
  return (dispatch) => {
    dispatch(fetchAllCelerationCategoriesBegin());

    client
      .query({
        query: gql`
          query {
            getCelerationCategory {
              id
              name
            }
          }
        `,
      })
      .then((response) => {
        dispatch(
          fetchAllCelerationCategoriesSuccess(
            response.data.getCelerationCategory,
          ),
        );
      })
      .catch((error) => dispatch(fetchAllCelerationCategoriesFailure(error)));
  };
};

const fetchAllCelerationCategoriesBegin = () => ({
  type: actions.fetchAllCelerationCategoriesBegin,
});
const fetchAllCelerationCategoriesSuccess = (data) => ({
  type: actions.fetchAllCelerationCategoriesSuccess,
  celerationCategories: data,
});
const fetchAllCelerationCategoriesFailure = (error) => ({
  type: actions.fetchAllCelerationCategoriesFailure,
  error,
});

export const fetchAllCelerationCharts = () => {
  return (dispatch, getState) => {
    dispatch(fetchAllCelerationChartsBegin());

    client
      .query({
        query: gql`
          query getCelerationChart($studentId: ID!) {
            getCelerationChart(student: $studentId) {
              edges {
                node {
                  id
                  title
                  date
                  notes
                  category {
                    id
                    name
                  }
                  student {
                    id
                    firstname
                  }
                  labels {
                    edges {
                      node {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          studentId: getState().celerationChartState.studentId,
        },
      })
      .then((response) => {
        const nodes = response.data.getCelerationChart.edges.map((edge) => {
          const labelNodes = edge.node.labels.edges;
          return {
            ...edge.node,
            pointsTypeLables: {
              type1:
                labelNodes && labelNodes.length > 0
                  ? labelNodes[0].node.name
                  : 'Correct',
              type2:
                labelNodes && labelNodes.length > 1
                  ? labelNodes[1].node.name
                  : 'Incorrect',
              type3:
                labelNodes && labelNodes.length > 2
                  ? labelNodes[2].node.name
                  : 'Prompted',
            },
          };
        });
        dispatch(fetchAllCelerationChartsSuccess(nodes));
      })
      .catch((error) => dispatch(fetchAllCelerationChartsFailure(error)));
  };
};

const fetchAllCelerationChartsBegin = () => ({
  type: actions.fetchAllCelerationChartBegin,
});
const fetchAllCelerationChartsSuccess = (data) => ({
  type: actions.fetchAllCelerationChartSuccess,
  celerationCharts: data,
});
const fetchAllCelerationChartsFailure = (error) => ({
  type: actions.fetchAllCelerationChartFailure,
  error,
});

export const onCelerationChartChange = (event, key) => {
  return (dispatch, getState) => {
    let value;
    if (key === 'category') {
      value = getState().celerationChartState.celerationCategories.find(
        (c) => c.id === event,
      );
    } else {
      value = event;
    }

    dispatch({
      type: actions.onCelerationChartChange,
      key,
      value,
    });
    if (key === 'range') {
      const chart = getState().celerationChartState.celerationChart;
      getCelerationChartDataAPI(
        chart,
        chart.category.name,
        getState().celerationChartState.studentId,
      )
        .then((response) => {
          const nodes = extractData(chart, response);
          dispatch({
            type: actions.onDisplaySelectedChart,
            chart,
            nodes,
          });
        })
        .catch((error) => console.log(error));
    }
  };
};

export const addCelerationChart = (event, chart) => {
  event.preventDefault();

  return (dispatch, getState) => {
    const lables = [
      chart.pointsTypeLables.type1,
      chart.pointsTypeLables.type2,
      chart.pointsTypeLables.type3,
    ];

    client
      .mutate({
        mutation: gql`
          mutation {
            createCelerationChart(
              input: {
                title: "${chart.title}",
                category: "${chart.category.id}",
                student: "${getState().celerationChartState.studentId}",
                date: "${chart.date}",
                notes: "${chart.notes}",
                labels:[${lables.map((label) => `"${label}"`)}]
              }
            ) {
              details {
                id
                title
                date
                notes
                category {
                  id
                  name
                }
                student {
                  id
                  firstname
                }
                labels {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .catch((error) => dispatch(fetchAllCelerationChartsFailure(error)))

      .then((result) => {
        console.log(result);
        dispatch({
          type: actions.onAddCelerationChart,
          chart: result.data.createCelerationChart.details,
        });
        dispatch({
          type: actions.resetCelerationChart,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

const getCelerationChartDataAPI = (chart, category, studentId) => {
  let startDate;
  let endDate;

  if (chart.range) {
    startDate = moment(chart.range[0]).format('YYYY-MM-DD');
    endDate = moment(chart.range[1]).format('YYYY-MM-DD');
  } else {
    startDate = moment()
      .subtract(1, 'year')
      .isoWeek(moment().isoWeek())
      .isoWeekday(moment().isoWeekday())
      .format('YYYY-MM-DD');
    endDate = moment().endOf('week').format('YYYY-MM-DD');
  }

  switch (category) {
    case 'Session':
      return client.query({
        query: gql`
          query {
            getCelerationChartData2(
              startDate: "${startDate}"
              endDate: "${endDate}"
              student: "${studentId}"
              chartType: "Session"
            ) {
              correct
              error
              prompt
              date
            }
          }
        `,
      });
    case 'Behaviour':
      return client.query({
        query: gql`
          query {
            getCelerationChartData2(
              startDate: "${startDate}"
              endDate: "${endDate}"
              student: "${studentId}"
              chartType: "Behaviour"
            ) {
              day
              date
              behaviour
              frequency
            }
          }
        `,
      });
    default:
      return client.query({
        query: gql`
    query{
      getCelerationChartData(chart:"${chart.id}"){
          edges{
              node{
                  id
                  dataType
                  day
                  count
                  time
                  chart{
                      id
                      title
                      date
                  }
              }
          }
        }
      }
    `,
        fetchPolicy: 'network-only',
      });
  }
};

const extractData = (chart, response) => {
  if (chart.category.name === 'Others') {
    return response.data.getCelerationChartData.edges.map((edge) => {
      return {
        ...edge.node,
        dataType: externalToInternal(edge.node.dataType),
      };
    });
  }

  return response.data.getCelerationChartData2;
};

// edit action
export const onSelectChart = (chart) => {
  return (dispatch, getState) => {
    getCelerationChartDataAPI(
      chart,
      chart.category.name,
      getState().celerationChartState.studentId,
    )
      .then((response) => {
        const nodes = extractData(chart, response);

        dispatch({
          type: actions.onSelectCelerationChart,
          chart,
          nodes,
        });
      })
      .catch((error) => console.log(error));
  };
};

export const updateCelerationChart = (event, chart) => {
  event.preventDefault();

  return (dispatch, getState) => {
    const lables = [
      chart.pointsTypeLables.type1,
      chart.pointsTypeLables.type2,
      chart.pointsTypeLables.type3,
    ];

    client
      .mutate({
        mutation: gql`
          mutation {
            updateCelerationChart(
              input: {
                pk: "${chart.id}",
                title: "${chart.title}",
                category: "${chart.category.id}",
                student: "${getState().celerationChartState.studentId}",
                date: "${chart.date}",
                notes: "${chart.notes}",
                labels:[${lables.map((label) => `"${label}"`)}],
              }
            ) {
              details {
                id
                title
                date
                notes
                category {
                  id
                  name
                }
                student {
                  id
                  firstname
                }
                labels {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        console.log(result);
        dispatch({
          type: actions.onUpdateCelerationChart,
          chart,
        });
        dispatch({
          type: actions.resetCelerationChart,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addPoint = (point) => {
  return (dispatch, getState) => {
    const chart = getState().celerationChartState.celerationChart;

    const dataType = internalToExternal(point.dataType);

    client
      .mutate({
        mutation: gql`
          mutation {
            recordCelerationData(
              input: {
                chart: "${chart.id}"
                dataType: "${dataType}"
                day: ${point.day}
                count: ${point.count}
                time: ${point.time}
              }
            ) {
              details {
                id
                dataType
                day
                count
                time
                chart {
                  id
                  title
                  date
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        console.log(result);
        dispatch({
          type: actions.addPoint,
          point,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const resetCelerationChart = () => {
  return (dispatch, getState) => {
    dispatch({
      type: actions.resetCelerationChart,
    });
  };
};

export const openAddDrawer = () => {
  return (dispatch, getState) => {
    dispatch({
      type: actions.openAddDrawer,
      studentId: getState().celerationChartState.studentId,
    });
  };
};

// display chart action
export const onDisplaySelectedChart = (chart) => {
  return (dispatch, getState) => {
    getCelerationChartDataAPI(
      chart,
      chart.category.name,
      getState().celerationChartState.studentId,
    )
      .then((response) => {
        const nodes = extractData(chart, response);

        dispatch({
          type: actions.onDisplaySelectedChart,
          chart,
          nodes,
        });
      })
      .catch((error) => console.log(error));
  };
};

export const updatePoint = (pointIndex, newPoint) => {
  return (dispatch, getState) => {
    const chart = getState().celerationChartState.celerationChart;
    const dataType = internalToExternal(newPoint.dataType);

    client
      .mutate({
        mutation: gql`
        mutation {
          updateCelerationData(
            input: {
              pk: "${newPoint.id}"
              chart: "${chart.id}"
              dataType: "${dataType}"
              day: ${newPoint.day}
              count: ${newPoint.count}
              time: ${newPoint.time}
            }
          ) {
            details {
              id
              dataType
              day
              count
              time
              chart {
                id
                title
                date
              }
            }
          }
        }
      `,
      })
      .then((result) => {
        console.log(result);
        dispatch({
          type: actions.updatePoint,
          pointIndex,
          newPoint,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const onBehaviorTypesChange = (behaviors) => {
  return (dispatch, getState) => {
    dispatch({
      type: actions.onBehaviorTypesChange,
      behaviors,
    });
  };
};
