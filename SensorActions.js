import axios from 'axios';
var base64 = require('base-64');
import { authApiBaseUrl } from '../../util/clientapis.js';
import {
  FETCH_SENSORSLIST_FULFILLED,
  FETCH_SUMMARY_FULFILLED,
  FETCH_LATEST_SENSOR_VALUE_FOR_TELEMON_FULFILLED,
  FETCH_LAST_20_VALUES_FULFILLED,
  FETCH_ALERTS_FOR_SELECTED_TOPIC,
  FETCH_CURRENT_VALUES_FOR_SUMMARY,
  GET_SENSOR_SUMMARY_TREE_FULFILLED,
  FETCH_SENSOR_LOCATION_FULFILLED,
  FETCH_VALUES_FOR_DEVICE_SUMMARY,
  GET_CONTROLTYPE_FULFILLED,
  GET_CONTROLTYPE_SUM_FULFILLED
} from '../../util/consts';

const feathSensorsListurl = `${authApiBaseUrl}/sensor/getLatestValueAllSensors`;
const fetchlatestsensorvaluefortelemonurl = `${authApiBaseUrl}sensor/getAllDataForTelemon`;
const fetchLast20Valuesurl = `${authApiBaseUrl}/sensor/getLast20Values`;
const fetchAlertsForSelectedTopicurl = `${authApiBaseUrl}/sensor/getAlertsForSelectedTopic`;
const fetchCurrentValuesForSummaryurl = `${authApiBaseUrl}/sensor/getCurrentValuesForSummary`;
const fetchUnresponsiveDeviceSummaryurl = `${authApiBaseUrl}/sensor/getUnresponsiveDeviceSummary`;
const getSensorSummaryTreeurl = `${authApiBaseUrl}/sensor/getSensorSummaryTree`;
const fetchSensorLocationurl = `${authApiBaseUrl}/sensor/getSensorLocation`;
const fetchSummaryurl = `${authApiBaseUrl}/sensor/getSummary`;
const getControlTypeurl = `${authApiBaseUrl}/sensor/getControlType`;
const getControlTypeSumurl = `${authApiBaseUrl}/sensor/getControlTypeSum`;
const fetchCurrentValuesByLocationurl = `${authApiBaseUrl}/sensor/getCurrentValuesByLocation`;


export const fetchSensorsList = () =>
  dispatch =>
    axios.get(feathSensorsListurl)
      .then((response) => {
        if (response !== undefined && response !== null) {
          dispatch({ type: FETCH_SENSORSLIST_FULFILLED, sensorslist: response.data });

        }
        else {
          dispatch({ type: FETCH_SENSORSLIST_FULFILLED, sensorslist: [] });

        }

      }).catch(
        error => {

          throw (error);
        }
      );

export const fetchlatestsensorvaluefortelemon = (topiclist) => {
  const topicstr = `'${topiclist.join("','")}'`;
  let topiclistencoded = base64.encode(topicstr);
  return dispatch => {
    return axios.get(`${fetchlatestsensorvaluefortelemonurl}?topics=${topiclistencoded}`)
      .then((response) => {
        if (response !== undefined && response !== null) {
          dispatch({ type: FETCH_LATEST_SENSOR_VALUE_FOR_TELEMON_FULFILLED, sensorsvaluefortelemon: response.data.array_to_json });

        }
        else {
          dispatch({ type: FETCH_LATEST_SENSOR_VALUE_FOR_TELEMON_FULFILLED, sensorsvaluefortelemon: 0 });

        }

      }).catch(
        error => {

          throw (error);
        }
      );
  }
}

export const fetchLast20Values = (topiclist) => {
  const topicstr = `'${topiclist.join("','")}'`;
  let topiclistencoded = base64.encode(topicstr);
  return dispatch => {
    return axios.get(`${fetchLast20Valuesurl}?topic=${topiclistencoded}`)
      .then((response) => {
        dispatch({ type: FETCH_LAST_20_VALUES_FULFILLED, last20Valuesforsensor: response.data });
      }).catch(
        error => { throw (error); }
      );
  }
}

export const getSensorDataSummary = (topic) => {
  // return dispatch => {
  return axios.get(`${fetchSummaryurl}?topic=${topic}`)
  // .then((response) => {
  //   dispatch({ type: FETCH_SUMMARY_FULFILLED, sensordatasummary: response.data });
  // }).catch(
  //   error => { throw (error); }
  // );
  // }
}

export const fetchAlertsForSelectedTopic = (selectedID) => {
  return dispatch =>
    axios.get(`${fetchAlertsForSelectedTopicurl}?selectedID=${selectedID}`)
      .then((response) => {

        if (response !== undefined && response !== null) {
          dispatch({ type: FETCH_ALERTS_FOR_SELECTED_TOPIC, alertsforselectedtopic: response.data });

        }
        else {
          dispatch({ type: FETCH_ALERTS_FOR_SELECTED_TOPIC, alertsforselectedtopic: [] });

        }
      }).catch(
        error => { throw (error); }
      );
}


export const fetchCurrentValuesForSummary = (selectedID) => {
  return dispatch =>
    axios.get(`${fetchCurrentValuesForSummaryurl}?selectedID=${selectedID}`)
      .then((response) => {
        if (response !== undefined && response !== null) {


          dispatch({ type: FETCH_CURRENT_VALUES_FOR_SUMMARY, currentvalues: response.data });


        }
        else {
          dispatch({ type: FETCH_CURRENT_VALUES_FOR_SUMMARY, currentvalues: [] });

        }
      }).catch(
        error => { throw (error); }
      );
}

//Async behaviour of fetchCurrentValuesForSummary 
export function fetchCurrentValuesForSummaryForaysnc(selectedID) {
  return (axios.get(`${fetchCurrentValuesForSummaryurl}?selectedID=${selectedID}`));
}

export const clearCurrentValues = () => {
  return dispatch => dispatch({
    type: FETCH_CURRENT_VALUES_FOR_SUMMARY,
    currentvalues: []
  });
}

export const fetchUnresponsiveDeviceSummary = (selectedID) => {
  return dispatch =>
    axios.get(`${fetchUnresponsiveDeviceSummaryurl}?selectedID=${selectedID}`)
      .then((response) => {
        if (response !== undefined && response !== null) {


          dispatch({ type: FETCH_VALUES_FOR_DEVICE_SUMMARY, devicevalues: response.data });


        }
        else {
          dispatch({ type: FETCH_VALUES_FOR_DEVICE_SUMMARY, devicevalues: [] });

        }
      }).catch(
        error => { throw (error); }
      );
}
export const getSensorSummaryTree = (deviceTimeout) => {
  return dispatch => {
    return axios.get(`${getSensorSummaryTreeurl}?deviceTimeout=${deviceTimeout}`)
      .then((response) => {
        if (response !== undefined && response !== null) {
          dispatch({ type: GET_SENSOR_SUMMARY_TREE_FULFILLED, sensorsvalueforselectedtree: response.data });

        }
        else {
          dispatch({ type: GET_SENSOR_SUMMARY_TREE_FULFILLED, sensorsvalueforselectedtree: 0 });

        }

      }).catch(
        error => {

          throw (error);
        }
      );
  }
}

export const fetchSensorLocation = (selectedID) => {
  return dispatch =>
    axios.post(fetchSensorLocationurl, { selectedID })
      .then((response) => {
        if (response !== undefined && response !== null) {
          dispatch({ type: FETCH_SENSOR_LOCATION_FULFILLED, sensorLocation: response.data });

        }
        else {
          dispatch({ type: FETCH_SENSOR_LOCATION_FULFILLED, sensorLocation: [] });

        }
      }).catch(
        error => { throw (error); }
      );
}

export const getControlType = () => {
  return dispatch => {
    return axios.get(`${getControlTypeurl}`)
      .then((response) => {
        if (response !== undefined && response !== null) {
          dispatch({ type: GET_CONTROLTYPE_FULFILLED, controlTypes: response.data });

        }
        else {
          dispatch({ type: GET_CONTROLTYPE_FULFILLED, controlTypes: [] });

        }

      }).catch(
        error => {

          throw (error);
        }
      );
  }
}

export const getControlTypeSum = (controlType, deviceId) => {
  return dispatch => {
    return axios.get(`${getControlTypeSumurl}?controlType=${controlType}&deviceId=${deviceId}`)
      .then((response) => {
        if (response !== undefined && response !== null) {
          dispatch({ type: GET_CONTROLTYPE_SUM_FULFILLED, controlTypeSum: response.data });

        }
        else {
          dispatch({ type: GET_CONTROLTYPE_SUM_FULFILLED, controlTypeSum: [] });

        }

      }).catch(
        error => {

          throw (error);
        }
      );
  }
}

export function fetchCurrentValuesByLocationAsync(selectedID) {
  return axios.get(`${fetchCurrentValuesByLocationurl}?selectedID=${selectedID}`)
}

