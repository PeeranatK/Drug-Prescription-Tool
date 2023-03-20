import { MDBContainer, MDBIcon } from "mdbreact";
import "./suggestion.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { useState } from "react";
import Axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Form from 'react-bootstrap/Form';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { useEffect } from "react";
import Navtop from '../Component/Navbar';

const Suggestion = () => {
  const [searchinput, setSearchinput] = useState('');
  const [searchinput2, setSearchinput2] = useState('');
  const [saveinput, setSaveinput] = useState([]);
  const [result, setResult] = useState([]);
  const [sresult, setsResult] = useState('');
  //var index = 0;
  const [index, setIndex] = useState(0);

  const [formData, setFormData] = useState({
    dname: '',
    age: '',
    sex: '',
    pregnancy: '',
    lactation: '',
    disease: '',
    kidney: '',
    weight: '',
  });


  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [options, setOptions] = useState([]);
  useEffect(() => {
    
    async function fetchSuggestions() {
      
      //if (searchinput !== "") {
        //console.log("useeffect");
        const response = await Axios.get(`http://localhost:3001/api/druglist`);
        setOptions(response.data);
        //console.log(response);
      //}
    }
  
    fetchSuggestions();
  }, [searchinput]);

  const [options2, setOptions2] = useState([]);
  useEffect(() => {
    
    async function fetchSuggestions2() {
    
      //if (searchinput !== "") {
        //console.log("useeffect");
        const response = await Axios.get(`http://localhost:3001/api/diseaselist`);
        setOptions2(response.data);
        console.log(response);
      //}
    }
  
    fetchSuggestions2();
  }, [searchinput2]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const handleSubmit = (event) => {
    event.preventDefault(); // prevent default form submission
    console.log(formData); // display form data in console
    console.log(formData.dname.length);
    //check sex
    if(formData.sex == 'male'){
      setFormData({ ...formData, pregnancy: false }); // update form data
      setFormData({ ...formData, lactation: false }); // update form data
    }
    // handle form submission logic here
    findSuggestion();
  }
  



  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value }); // update form data
  }

  const handleChangeDrug = (event, value) => {
    const name = 'dname';
    console.log(value);
    setFormData({ ...formData, [name]: value }); // update form data
  }
  const handleChangeDisease = (event, value) => {
    const name = 'disease';
    console.log(value);
    setFormData({ ...formData, [name]: value }); // update form data
  }

  const handleCheck = (event) => {
    //setIsChecked(event.target.checked);
    //console.log("check");
    //console.log(event.target.checked);
    //console.log(event.target.name);

    //const { name, value } = event.target.checked;
    setFormData({ ...formData, [event.target.name]: event.target.checked });
    // handle checkbox form logic here
  }

  

  







  function findSuggestion() {
    console.log("active");
    Axios.post('http://localhost:3001/api/drugdisease', {
      'dname': formData.dname,
      'age': formData.age,
      'sex': formData.sex,
      'pregnancy': formData.pregnancy,
      'lactation': formData.lactation,
      'disease': formData.disease,
      'kidney': formData.kidney,
      'weight': formData.weight,
    }).then((respond) => {
      console.log(respond.data);
      setsResult(respond.data);
    }).catch((error) => {
      console.error(error);
    });
  }





  //console.log(saveinput);
  //findInteraction("Abacavir","Aceclofenac");

  
  //test();
  //test2("Abacavir","Aceclofenac");

  return (
    <div>
      <Navtop />
    <MDBContainer>
       
      <div>
        <br /><h1 className="text-center">Drug Suggestion</h1><br />
      </div>
       {/*Input Field*/}
       {/* 
      <div className="input-group md-form form-sm form-2 pl-0">
      
        <input className="form-control my-0 py-1 red-border" type="text" placeholder="Search" aria-label="Search" onChange={handleChange} value={searchinput} onKeyPress={event => {
                if (event.key === 'Enter') {
                  if(searchinput !==  ""){
                    startInput();
                  }
                }
              }}/>
        <div className="input-group-append">
          <span className="input-group-text green lighten-3" id="basic-text1">
            <MDBIcon icon="search" className="text-grey" />
          </span>
        </div>
      </div>
      */}
      {/*Form*/}
      <MDBContainer>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="dname">
            {/* <Form.Label>Drug name</Form.Label> */}
            {/* <Form.Control type="text" placeholder="" name="dname" value={formData.dname} onChange={handleChange}/> */}
            <Stack spacing={2} sx={{ width: '100%' }} className="me-4">
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={options.map((option) => option.name)}
                getOptionLabel={(option) => option.toString()}
                value={searchinput}
                onChange={handleChangeDrug}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Drug"
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                      
                    }}
                    value= {searchinput}
                  />
                )}
              />
              </Stack>
          <div>
            <br /><h6 className="text-left">Factor</h6>
          </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Age (year)</Form.Label>
            <Form.Control type="text" placeholder="" name="age" value={formData.age} onChange={handleChange}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Weight (Kg)</Form.Label>
            <Form.Control type="text" placeholder="" name="weight" value={formData.weight} onChange={handleChange}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridState">
            <Form.Label>Sex</Form.Label>
            <Form.Select  name="sex" value={formData.sex} onChange={handleChange}>
              <option value=''>Choose...</option>
              <option value='male'>male</option>
              <option value='female'>female</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check inline type="checkbox" label="pregnancy" name="pregnancy" checked={formData.pregnancy} onChange={handleCheck}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check inline type="checkbox" label="lactation" name="lactation" checked={formData.lactation} onChange={handleCheck}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Underlying disease</Form.Label>
            {/* <Form.Control type="text" placeholder="" name="disease" value={formData.disease} onChange={handleChange}/> */}
            <Stack spacing={2} sx={{ width: '100%' }} className="me-4">
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={options2.map((option) => option.name)}
                getOptionLabel={(option) => option.toString()}
                value={searchinput}
                onChange={handleChangeDisease}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                      
                    }}
                    value= {searchinput}
                  />
                )}
              />
              </Stack>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Kidney function</Form.Label>
            <Form.Control type="text" placeholder="" name="kidney" value={formData.kidney} onChange={handleChange}/>
          </Form.Group>
          
          {/* <Button variant="primary" type="submit">
            Submit
          </Button> */}
          <div>
            <Button variant="outlined" onClick={handleClickOpen} type="submit">
              Submit
            </Button>
            <Dialog
              fullScreen={fullScreen}
              fullWidth={fullWidth}
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
            <DialogTitle id="responsive-dialog-title">
              {"Suggestion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {sresult}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              
              <Button onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
            </Dialog>
          </div>
        </Form>
      </MDBContainer>
         
      
    </MDBContainer>
    </div>
  );
}
export default Suggestion;
