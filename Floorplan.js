import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Grid, Dropdown, Form, Input, Segment } from 'semantic-ui-react';
const { fabric } = require('fabric');
import extractDataFromTopic from './utils/extractDataFromTopic';
import * as sidebarActions from '../../../redux/actions/db/SideBarActions';
import * as utils from './util';
import * as sensorActions from '../../../redux/actions/db/SensorActions';
import AlertSummaryWidget from './AlertSummaryWidget';
import { SVGEditor } from './map_configurations/SVGEditor';
import Template from '../SemanticForWidgetDashboard/SemanticForWidgets/Floorplan.jsx';

class Floorplan extends Component {

  constructor() {
    super();
    this.state = {
      renderFloorplan: false,
      dropdownOptions: [],
      addButtonDisabled: true,
      deleteButtonDisabled: true,
      renderComp: false
    }
    this.isDBUpdated = false;
    this.topic = [];
    this.dropdownData = {};
    this.color = ['green'];
    this.id = '';
    this.svgEditor = null;

    this.handlers = {
      saveSVG: this.saveSVG.bind(this),
      getWidgetindex: this.getWidgetindex.bind(this),
      handleFileUpload: this.handleFileUpload.bind(this),
      handleChange: this.handleChange.bind(this),
      handleClick: this.handleClick.bind(this),
      createDropDownOptions: this.createDropDownOptions.bind(this),
      deleteSVG: this.deleteSVG.bind(this),
      uploadInputref: this.uploadInputref.bind(this)
    }

  }

  saveSVG() {
    let svg = this.svgEditor.prepareSVG()
    const { el } = this.props;
    const index = this.getWidgetindex(el.i);
    if (this.props.widgetsdata.length > 0 && this.props.layoutsdata) {
      let newwidgetsdata = this.props.widgetsdata;
      newwidgetsdata[index].config = svg;
      this.props.updatelayoutsandwidgets(this.props.layoutsdata, newwidgetsdata);
    }
  }

  idGenerator() {
    var id = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return ("floorPlan-" + id() + id() + "-" + id());
  }

  getWidgetindex(key) {
    if (key !== undefined && key !== null) {

      return _.findIndex(this.props.widgetsdata, ['id', key]);
    }
    return 0;
  }

  componentWillMount() {
    this.id = this.idGenerator();
    this.props.getSensorSummaryTree(20);
  }

  componentDidMount() {
    this.svgEditor = new SVGEditor(this.id);
    let canvas = this.svgEditor.getCanvas()
    canvas.on('object:modified', (e) => {
      this.saveSVG();
    })
    canvas.on('object:selected', (e) => {
      this.setState({ deleteButtonDisabled: false })
    })
    canvas.on('selection:cleared', (e) => {
      this.setState({ deleteButtonDisabled: true })
    })
    canvas.on('mouse:dblclick', (e, d) => {
      this.props.fetchMenuForSelectedTreeNode(e.target.id);
      this.isDBUpdated = false;
    })
    const { el } = this.props;
    const index = this.getWidgetindex(el.i);
    const config = this.props.widgetsdata[index].config;
    if (utils.getObjectLength(config)) {
      canvas.loadFromJSON(config, () => {
        this.setState({ renderFloorplan: true })
        this.createDropDownOptions();
      })

    }
    else {
      this.setState({ renderFloorplan: false })
    }
  }

  updateDbValues() {
    const canvasObjects = this.svgEditor.getObjects();
    this.topic = new Set(canvasObjects.map(obj => obj.id))
    const validation = utils.validateSensorSummaryTree(this.props.sensorSummaryTree, this.topic)
    if (validation.status) {
      for (const obj in canvasObjects) {
        let matches = validation.matches[canvasObjects[obj].id];
        let svgElem = canvasObjects[obj]._objects;
        svgElem[1].set('text', `${matches.alerts}`);
        svgElem[0].fill = this.color[matches.alerts] || "red";
      }
      this.svgEditor.renderCanvas();
    }
  }

  componentWillReceiveProps(nextProps) {
    const canvasObjects = this.svgEditor.getObjects();
    if (Object.keys(nextProps.sensorSummaryTree).length && canvasObjects.length !== 0) {
      if (!this.isDBUpdated) {
        this.topic = new Set(canvasObjects.map(obj => obj.id))
        const validation = utils.validateSensorSummaryTree(nextProps.sensorSummaryTree, this.topic)
        if (validation.status) {

          this.isDBUpdated = true;
          for (const obj in canvasObjects) {
            let matches = validation.matches[canvasObjects[obj].id];
            let svgElem = canvasObjects[obj]._objects;
            if (matches.node === 'NODE') {
              svgElem[1].set('text', `${matches.alerts}`);
              // svgElem[0].fill = this.color[matches.alerts] || "red";
              const selectedObj = svgElem[0].getObjects()
              if (matches.alerts === '0') {
                selectedObj[8].fill = '#16DA23'
                selectedObj[9].fill = '#35853B'
              }

              else {
                selectedObj[8].fill = '#FF5050'
                selectedObj[9].fill = '#C84146'
              }

            }
            else {
              svgElem[1].set('text', `${matches.sensor_average}`)
            }
          }
          this.svgEditor.renderCanvas();
        }
      }
      else {
        const selectedTreeNode = parseInt(this.props.selectedTreeNode)
        if (_.find(this.props.sensorSummaryTree, { 'menuid': selectedTreeNode }).node === "LEAF") {
          if (utils.validateSocketValue(nextProps.socketSensorValue, this.topic)) {
            let match = _.filter(canvasObjects, (obj) => {
              if (obj.id === Object.keys(nextProps.socketSensorValue)[0]) {
                let parsedObj = JSON.parse(nextProps.socketSensorValue[obj.id])
                let value = "" + parsedObj[Object.keys(parsedObj)[0]];
                obj._objects[1].set('text', value);
                this.svgEditor.renderCanvas();
              }
            })
          }
        }
        else {
          this.isDBUpdated = false;
          this.props.getSensorSummaryTree(20);
          // this.updateDbValues();
        }
      }
    }
  }
  uploadInputref(ref) {
    this.uploadInput = ref;
  }

  handleFileUpload(ev) {
    ev.preventDefault();
    // Check for the various File API support.
    if (window.FileReader) {
      // FileReader are supported.

      if (this.uploadInput.inputRef.files[0] === undefined) {
        alert("Please select the image file to upload");
      }
      else {
        const fileType = this.uploadInput.inputRef.files[0].type
        if (fileType === "image/png" || fileType === "image/jpeg" || fileType === "image/bmp") {
          let reader = new FileReader();
          let file = this.uploadInput.inputRef.files[0];
          reader.onload = (e) => {
            const floorMap = e.currentTarget.result;
            this.svgEditor.setBackgroundImage(floorMap);
            this.saveSVG();
            this.createDropDownOptions();
            this.setState({ renderFloorplan: true })
          }
          reader.readAsDataURL(file)
        }
        else {
          alert("Please upload an image file.\npng, jpeg and bmp formats are supported")
        }
      }
    }
    else {
      alert('FileReader are not supported in this browser.');
    }

  }

  handleChange(e, d) {
    this.dropdownData = d;
    d.value ? this.setState({ addButtonDisabled: false }) : this.setState({ addButtonDisabled: false });
  }

  handleClick(e, d) {
    if (d.name === 'add') {
      const id = this.dropdownData.value
      let sensorType = "";
      const selectedTreeNode = parseInt(this.props.selectedTreeNode)
      if (_.find(this.props.sensorSummaryTree, { menuid: selectedTreeNode }).node === "LEAF") {
        sensorType = extractDataFromTopic(this.dropdownData.value, 2);
      }
      else {
        sensorType = "Smokedetectorgreen"
      }
      this.svgEditor.createSVGWidget(sensorType, id)
    }
    else {
      this.deleteSVG();
    }
  }

  createDropDownOptions() {
    let selectedTreeNode = "" + this.props.selectedTreeNode;  //int to string conversion
    let match = _.find(this.props.flatTreeData, obj => obj.value === selectedTreeNode)
    let dropdownOptions;
    if (match && match.children.length) {
      dropdownOptions = _.map(match.children, child => {
        return {
          key: child.value,
          text: child.label,
          value: child.value
        }
      })
    }
    else {
      dropdownOptions = this.props.parameters;
    }
    this.setState({ dropdownOptions: dropdownOptions })
  }

  deleteSVG() {
    this.svgEditor.deleteSVGWidget();
    this.saveSVG();
  }

  componentWillUnmount() {
    this.isDBUpdated = false;
  }

  render() {
    return (
      <div className='draggable-cancel'>
        <Template state={this.state} id={this.id} handlers={this.handlers} />
      </div>
    )
  }
}

function mapWidgetStoreToProps(store) {
  return {
    parameters: store.selectedtree.parameters,
    selectedTreeNode: store.selectedtree.selectedID,
    flatTreeData: store.flatTreeData || [],
    sensorSummaryTree: utils.createSensorSummaryTree(store.sensorSummaryTree),
    socketSensorValue: utils.createSocketValue(store.socketSensorData)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatelayoutsandwidgets: (layoutdata, widgetdata) => {
      dispatch(sidebarActions.updatelayoutsandwidgets(layoutdata, widgetdata));
    },
    getSensorSummaryTree: (deviceTimeout) => {
      dispatch(sensorActions.getSensorSummaryTree(deviceTimeout));
    },
    fetchMenuForSelectedTreeNode: (menuid) => {
      dispatch(sidebarActions.fetchmenuforselectedtreenode(menuid))
    }
  };
}

export default connect(mapWidgetStoreToProps, mapDispatchToProps)(Floorplan);
