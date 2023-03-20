import { MDBContainer, MDBIcon } from "mdbreact";
import "./suggestion.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { useState, useRef } from "react";
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
import Swal from 'sweetalert2';
import { Typeahead } from 'react-bootstrap-typeahead';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect } from "react";
import ButtonAppBar from '../Component/Nav';

function AddInteract() {
  const [searchinput, setSearchinput] = useState('');
  const [searchinput2, setSearchinput2] = useState('');
  const [saveinput, setSaveinput] = useState([]);
  const [result, setResult] = useState([]);
  const [sresult, setsResult] = useState('');
  //var index = 0;
  const [index, setIndex] = useState(0);

  const pregnancyValues = ["true", "false"];
  const sexValues = ["male", "female"];
  //const lactationValues = ["true", "false"];
  const [severityLevel, setSeverityLevel] = useState("");

  const [formData, setFormData] = useState({
    dname1: '',
    dname2: '',
    level: '',
    description: '',
   
  });
  const [rows, setRows] = useState([
    { id: 1, col1: '', col2: '', col3: '' },
  ]);
  const [nextId, setNextId] = useState(2);

  const handleAddRow = () => {
    // setRows([...rows, { id: nextId, col1: '', col2: '', col3: '' }]);
    // setNextId(nextId + 1);
    const newRow = { id: rows.length + 1, col1: '', col2: '', col3: '' };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id) => {
    //setRows(rows.filter((row) => row.id !== id));
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
  };

  const handleRowChange = (id, col, value) => {
    const newRows = [...rows];
    const index = newRows.findIndex((row) => row.id === id);
    newRows[index][col] = value;
    setRows(newRows);
  };


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



  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
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

  const [textareaValue, setTextareaValue] = useState("");
  const textareaRef = useRef(null);

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };


  // const handleSubmit = (event) => {
  //   const searchDrug = document.getElementById('free-solo-2-demo').value;
  //   console.log('Search Drug:', searchDrug);
  //   console.log('Severity:', severityLevel);
  //   console.log('Condition:', alignment);
  //   console.log('textarea : '+textareaRef.current.value);
  //   console.log('Rows:', rows);
  //   // event.preventDefault(); // prevent default form submission
  //   // console.log(formData); // display form data in console
  //   // console.log(formData.dname.length);
  //   // //check sex
  //   // if(formData.sex == 'male'){
  //   //   setFormData({ ...formData, pregnancy: false }); // update form data
  //   //   setFormData({ ...formData, lactation: false }); // update form data
  //   // }
  //   // // handle form submission logic here
  //   // //findSuggestion();
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const searchDrug = document.getElementById('free-solo-2-demo').value;
    const text = textareaRef.current.value;
    Axios.post('http://localhost:3001/addSuggest', {
      'dname' : searchDrug,
      'priority' :severityLevel,
      'method' :alignment,
      'suggestion' :text,
      'condition' :rows,
    }).then((respond) => {
      console.log(respond.data);
      setsResult(respond.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message,
      });
    }).catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    });

    
  };

  const handleReset = (event) => {
    setAlignment('any');
    setRows([{ id: 1, col1: '', col2: '', col3: '' }]);
    setSeverityLevel("");
    //setRows([]);
    setTextareaValue("");
  }
  const [alignment, setAlignment] = React.useState('any');

  const handleChangeToggle = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  
  
  


  
  const handleChangeSeverity = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, age: value });
    }
  };

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


  return (
    <div>
       <ButtonAppBar />
    <MDBContainer>
      <div>
        <br /><h1 className="text-center">Add Suggestion</h1><br />
      </div>
      {/* <div className="d-flex justify-content-between"> */}
      <div className="d-flex align-items-center">
        <Stack spacing={2} sx={{ width: 400 }} className="me-4">
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
        <div className="me-4">
          <span>Severity level :  </span>
          <input
            type="number"
            min="1"
            max="20"
            value={severityLevel}
            onChange={(e) => setSeverityLevel(parseInt(e.target.value))}
          />
        </div>
        <div className="me-4">
          <span>Condition:  </span>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChangeToggle}
            aria-label="Platform"
          >
            <ToggleButton value="any">Any</ToggleButton>
            <ToggleButton value="all">All</ToggleButton>
          </ToggleButtonGroup>
        </div>
        
        <button type="button" className="btn btn-primary float-end" onClick={handleAddRow}>
        Add Row
        </button>
      </div>
      

      <div>
      <table className="table">
        <thead>
          <tr>
            <th>Factor</th>
            <th>Operator</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Form.Select
                  value={row.col1}
                  onChange={(event) =>
                    handleRowChange(row.id, 'col1', event.target.value)
                  }
                >
                  <option value=""></option>
                  <option value="age">Age</option>
                  <option value="weight">Weight</option>
                  <option value="sex">Sex</option>
                  <option value="pregnancy">Pregnancy</option>
                  <option value="lactation ">Lactation</option>
                  <option value="disease">Underlying disease</option>
                  <option value="kidney">Kidney function</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  value={row.col2}
                  onChange={(event) =>
                    handleRowChange(row.id, 'col2', event.target.value)
                  }
                >
                  <option value=""></option>
                  <option value="equal">Equal</option>
                  <option value="notEqual">Not equal</option>
                  <option value="lessThan">Less than</option>
                  <option value="greaterThan">Greater than</option>
                  <option value="lessThanInclusive">Less than or Equal</option>
                  <option value="greaterThanInclusive">Greater than or Equal</option>
                  <option value="in">In</option>
                </Form.Select>
              </td>
              <td>
               
              {row.col1 === "lactation" || row.col1 === "pregnancy" ? (
                <Form.Select
                  value={row.col3}
                  onChange={(event) =>
                    handleRowChange(row.id, 'col3', event.target.value)
                  }
                >
                  <option value=""></option>
                  {pregnancyValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              ) : row.col1 === "sex" ? (
                <Form.Select
                  value={row.col3}
                  onChange={(event) =>
                    handleRowChange(row.id, 'col3', event.target.value)
                  }
                >
                  <option value=""></option>
                  {sexValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              
                ) : row.col1 === 'disease' ? (
                  <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={options2.map((option) => option.name)}
                    getOptionLabel={(option) => option.toString()}
                    value={searchinput2}
                    onChange={handleChangeDisease}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=""
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                          
                        }}
                        value= {searchinput2}
                      />
                    )}
                  />
                ) : (
                <Form.Control
                  type={row.col1 === "age" || row.col1 === "weight" ? "number" : "text"}
                  value={row.col3}
                  onChange={(event) =>
                    handleRowChange(row.id, 'col3', event.target.value)
                  }
                />
                )}
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteRow(row.id)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
    <div>
      <span>Suggest Word</span>
    </div>
    <div>
      
      <textarea ref={textareaRef} value={textareaValue} onChange={handleTextareaChange} style={{height: '50%', width: '80%'} }></textarea>
    </div>
    <div className="d-flex">
      <button type="button" className="btn btn-success" onClick={handleSubmit}>
        Submit
      </button>
      <button type="button" className="btn btn-warning" onClick={handleReset}>
        Reset
      </button>
    </div>
      
    </MDBContainer>
    </div>
  );
}

export default AddSuggest;
