import React from 'react';
import { Button, Icon, Grid, Dropdown, Form, Input, Segment } from 'semantic-ui-react';
import AlertSummaryWidget from  '../../widgets/AlertSummaryWidget';

function Template({state, handlers, id}){
  const {renderFloorplan,dropdownOptions,addButtonDisabled, deleteButtonDisabled} = state
  const {handleChange, handleClick, handleFileUpload, uploadInputref} = handlers;

  return (
    <div>
      {/* <Grid columns={2} divided>
        <Grid.Row stretched>
          <Grid.Column width={10}> */}
            <Form >
              {renderFloorplan && <Form.Group>&nbsp;&nbsp;&nbsp;&nbsp;
           <Dropdown placeholder='Select Sensor Type' selection options={dropdownOptions} onChange={handleChange} />
                &nbsp;<Button icon onClick={handleClick} disabled={addButtonDisabled} name="add">
                  <Icon name='plus' />
                </Button>
                <Button icon onClick={handleClick} disabled={deleteButtonDisabled} name="remove">
                  <Icon name='minus' />
                </Button>
              </Form.Group>}
            </Form>

            {!renderFloorplan && <div>
              <Form >
                <Form.Group>
                  &nbsp;&nbsp;&nbsp;&nbsp;
            <Input icon='file alternate' ref={uploadInputref} type="file" /> &nbsp;
          <Button color='blue' onClick={handleFileUpload} animated='vertical'>
                    <Button.Content hidden><Icon name='upload' />UPLOAD</Button.Content>
                    <Button.Content visible><Icon name='upload' />UPLOAD</Button.Content>
                  </Button>
                </Form.Group>
              </Form></div>}
            <canvas id={id} height="600" width="900"></canvas>
          {/* </Grid.Column>
          <Grid.Column width={5}> */}
            {/* <Segment></Segment> */}
            {/* <AlertSummaryWidget /> */}
          {/* </Grid.Column>
        </Grid.Row>
      </Grid> */}
    </div>
  )
}

export default Template;
