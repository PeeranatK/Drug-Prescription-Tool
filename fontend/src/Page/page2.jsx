import Axios from 'axios';
import {useState} from 'react';

import Navtop from '../Component/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import { Form, FormControl, FormSelect, Button } from 'react-bootstrap';

function InputBlock() {
  return (
    <Form>
      <Form.Group controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <FormControl type="text" placeholder="Enter your name" />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <FormControl type="email" placeholder="Enter your email" />
      </Form.Group>

      <Form.Group controlId="formBasicSelect">
        <Form.Label>Select a topic</Form.Label>
        <FormSelect>
          <option>General Inquiry</option>
          <option>Support Request</option>
          <option>Feedback or Suggestion</option>
        </FormSelect>
      </Form.Group>

      <Form.Group controlId="formBasicMessage">
        <Form.Label>Message</Form.Label>
        <FormControl as="textarea" rows={3} placeholder="Enter your message" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function DropdownBlock() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select an option
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#action-1">Option 1</Dropdown.Item>
        <Dropdown.Item href="#action-2">Option 2</Dropdown.Item>
        <Dropdown.Item href="#action-3">Option 3</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}


const  page2 = () =>  {
    return (
        <div>
            <h1>Second page</h1>
            <DropdownBlock />
            <h1>Second page</h1>
            <InputBlock />
        </div>
    );
  }
  
  export default page2;