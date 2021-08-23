import { combineReducers } from 'redux';
import sessionInfo from './reducers/userReducer';
import { USER_LOGGED_OUT } from './util/consts';

import { socketSensorReducer, socketAlertReducer, socketSensorDataReducer, socketAlertDataReducer } from './reducers/SocketReducer';
import { treeReducer, expandedtreenodeReducer, flatTreeDataReducer } from './reducers/TreeDataReducer';
import { userReducer, usergroupReducer, userroleReducer, alarmReducer, definehierarchyReducer, definehierarchyCollumnReducer, rolesUiDataReducer, usergroupReducerForAddUser } from './reducers/ConfigurationComponentReducer';
import { homePageAlertReducer, alertReducer, homePageUserReducer, homePageDeviceReducer, sensorReducer, bottomalertReducer, alertstablevisibilityReducer } from './reducers/HomePageComponentReducer';
import { alertRulesConfigReducer } from './reducers/AlertRulesReducer';
import {
  sensordatabydatereducer,
  sensorvalueReducer,
  updatesavebuttontextreducer,
  layoutListReducer,
  alertsummaryforfaultypanelReducer,
  alertmonthlysummaryReducer,
  currentLayoutTitleReducer,
  widgetReducer,
  sensorsvaluefortelemonReducer,
  sidebardataReducer,
  selectedtreereducer,
  getLast20ValuesReducer,
  alertsforselectedtopicreducer,
  currentvaluesforsummaryreducer,
  getSensorSummaryTreeReducer,
  alertsdashboardReducer,
  toggleLayoutVisibilityReducer,
  toggleLayoutFullScreenVisibilityReducer,
  hoverMenuVisibilityReducer,
  getSensorLocationReducer,
  getSummaryReducer,
  valuesfordevicesummaryreducer,
  getControlTypeReducer,
  getControlTypeSumReducer,
  fetchAlertThresholds,
  alertbydatereducer
} from './reducers/WidgetDashboardComponentReducer';

const appReducer = combineReducers({
  sessionInfo,

  //Home page data
  alertscount: homePageAlertReducer,
  alertslist: alertReducer,
  usercount: homePageUserReducer,
  devicecount: homePageDeviceReducer,
  sensorslist: sensorReducer,
  // Configuration data
  userslist: userReducer,
  usersGroupsList: usergroupReducer,
  userRolesList: userroleReducer,
  alarmslist: alarmReducer,
  definehierarchylist: definehierarchyReducer,
  definehierarchycollumnlist: definehierarchyCollumnReducer,
  rolesUiData: rolesUiDataReducer,
  usersGroupsListForAddUser: usergroupReducerForAddUser,
  // Widget Dashboard data
  layoutList: layoutListReducer,
  widgetslist: widgetReducer,
  treelayout: sidebardataReducer,
  treedata: treeReducer,
  expanded: expandedtreenodeReducer,
  selectedtree: selectedtreereducer,
  latestsensorvalue: sensorvalueReducer,
  sensorsvaluefortelemon: sensorsvaluefortelemonReducer,
  socketSensorInfo: socketSensorReducer,
  socketAlertInfo: socketAlertReducer,
  socketSensorData: socketSensorDataReducer,
  socketAlertData: socketAlertDataReducer,
  savebuttontext: updatesavebuttontextreducer,
  currentLayoutTitle: currentLayoutTitleReducer,
  last20Values: getLast20ValuesReducer,
  sensorLocation: getSensorLocationReducer,
  sensordatasummary: getSummaryReducer,
  // Alerts data
  alertRulesConfig: alertRulesConfigReducer,
  // data for custum Widgets
  monthlyalertsummary: alertmonthlysummaryReducer,
  alertsummaryforfaultypanel: alertsummaryforfaultypanelReducer,
  sensorvaluebydate: sensordatabydatereducer,
  alertvaluebydate: alertbydatereducer,
  alertsforselectedtopic: alertsforselectedtopicreducer,
  currentvalues: currentvaluesforsummaryreducer,
  sensorSummaryTree: getSensorSummaryTreeReducer,
  flatTreeData: flatTreeDataReducer,
  alertsfordashboard: alertsdashboardReducer,
  layoutformvisibility: toggleLayoutVisibilityReducer,
  layoutheadervisibility: toggleLayoutFullScreenVisibilityReducer,
  bottom: bottomalertReducer,
  hoverMenuVisibility: hoverMenuVisibilityReducer,
  latestAlertsVisibility: alertstablevisibilityReducer,
  devicevalues: valuesfordevicesummaryreducer,
  controlTypes: getControlTypeReducer,
  controlTypeSum: getControlTypeSumReducer,
  alertThresholds: fetchAlertThresholds
});

export default (state, action) => {
  if (action.type === USER_LOGGED_OUT) {
    state = undefined;
  }
  return appReducer(state, action)
}