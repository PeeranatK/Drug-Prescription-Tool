import React, { useEffect, useState, useRef } from "react";
import Container from '@mui/material/Container';
import ButtonAppBar from '../Component/Nav';
import Axios from 'axios';
import Swal from 'sweetalert2';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { Select, MenuItem } from '@mui/material';
import {sliceData, calculateRange} from './table-pagiation';
import { TextField,TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, Box, Link, ButtonGroup, Avatar, TableFooter, TablePagination } from "@mui/material";


export  function DashboardIn() {
  const [users, setUsers] = useState([]);
  const [sresult, setsResult] = useState('');
  const [result, setResult] = useState('');
  const [searchinput, setSearchinput] = useState('');
  const [searchinput2, setSearchinput2] = useState('');
  const [severityLevel, setseverityLevel] = useState('');
  const [ID, setID] = useState('');
  const [page, setPage] = useState(1); // current page number
  const [rowsPerPage, setRowsPerPage] = useState(10); // number of rows per page
  const [searchText, setSearchText] = useState('');
  const [original, setOriginal] = useState([]);
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredUsers = original.slice().filter(user => user.drug1.toLowerCase().includes(value) || user.drug2.toLowerCase().includes(value));
    setUsers(filteredUsers);
    setSearchText(value);
    setPage(1);
  }
  useEffect(() => {
    UsersGet()
  }, [])
  const [options, setOptions] = useState([]);
  useEffect(() => {
    
    async function fetchSuggestions() {
        const response = await Axios.get(`https://drug-prescription-tool-api.vercel.app/api/druglist`);
        setOptions(response.data);
    }
  
    fetchSuggestions();
  }, [searchinput]);
  const [formData, setFormData] = useState({
    dname1: '',
    dname2: '',
    description: '',
    level: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const textareaRef = useRef(null);

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };
  const handleSeverityLevelChange = (event) => {
    setseverityLevel(event.target.value);
  };
  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = () => {
    

    const name1 = 'description';
    const name2 = 'level';
    const value1 = textareaValue;
    const value2 = severityLevel;
    console.log(textareaValue);
    setFormData({ ...formData, [name2]: value2 });

    console.log(formData);
    Axios.post('https://drug-prescription-tool-api.vercel.app/api/addInteract', {
      'dname1' : formData.dname1,
      'dname2' : formData.dname2,
      'description' : textareaValue,
      'level' : formData.level,
    }).then((respond) => {
      console.log(respond.data);
      setsResult(respond.data);
      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message,
      });
      
      UsersGet();
    }).catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    });
  };
  const handleClose2 = () => {
    setSearchinput('');
      setSearchinput2('');
      setseverityLevel('');
      setTextareaValue('');
    setIsModalOpen2(false);
  };
  const handleSubmit2 = () => {
    

    const name1 = 'description';
    const name2 = 'level';
    const value1 = textareaValue;
    const value2 = severityLevel;
    console.log(textareaValue);
    setFormData({ ...formData, [name2]: value2 });
    var dname1,dname2;
    if(formData.dname1 === ''){
        dname1 = searchinput;
    }else{
        dname1 = formData.dname1;
    }

    if(formData.dname2 === ''){
        dname2 = searchinput;
    }else{
        dname2 = formData.dname2;
    }

    console.log(formData);
    Axios.post('https://drug-prescription-tool-api.vercel.app/api/updateInteract', {
      'dname1' : dname1,
      'dname2' : dname2,
      'description' : textareaValue,
      'level' : formData.level,
      'id' : ID,
    }).then((respond) => {
      console.log(respond.data);
      setsResult(respond.data);
      setIsModalOpen2(false);
      UsersGet();
      //console.log(id);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message,
      });
      
      UsersGet();
    }).catch((error) => {
      console.error(error);
      setIsModalOpen2(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    });
  };
  const handleChangeDrug1 = (event, value) => {
    const name = 'dname1';
    console.log(value);
    setFormData({ ...formData, [name]: value }); // update form data
  }
  const handleChangeDrug2 = (event, value) => {
    const name = 'dname2';
    console.log(value);
    setFormData({ ...formData, [name]: value }); // update form data
  }
  const UsersGet = () => {
    Axios.get("https://drug-prescription-tool-api.vercel.app/api/topInteract")
      .then(response => {
        setUsers(response.data);
        setOriginal(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  async function fetchSuggestions3(id) {
    try {
      const response = await Axios.post('https://drug-prescription-tool-api.vercel.app/api/resultInteract', {
        'id': id,
      });
      console.log(response.data);
  
      setSearchinput(response.data[0].drug1);
      setSearchinput2(response.data[0].drug2);
      setseverityLevel(response.data[0].level);
      setTextareaValue(response.data[0].description);
      //console.log(response.data[0].drug1);
  
    } catch (error) {
      console.error(error);
    }
  }
  const UpdateUser = id => {
    console.log("rid" + id);
    setID(id);
    setIsModalOpen2(true);
    fetchSuggestions3(id);
  }

  const UserDelete = id => {
    Axios.post('https://drug-prescription-tool-api.vercel.app/api/deleteInteract', {
      'rid' : id,
    }).then((respond) => {
      console.log(respond.data);
      setsResult(respond.data);
      console.log(id);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message,
      });
      UsersGet();
    }).catch((error) => {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    });
  }

  return (
    <div>
      <ButtonAppBar />
      <Container sx={{ p: 2 }} maxWidth="lg">
        <Paper sx={{ p: 2 }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Interaction
              </Typography>
            </Box>
            <Box>
              <TextField
                label="Search"
                variant="outlined"
                value={searchText}
                onChange={handleSearch}
                fullWidth
                margin="normal"
              />
            </Box>
            <Box>
              <Button variant="contained" color="primary" onClick={handleAddButtonClick}>
                Add
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">ID</TableCell>
                  <TableCell align="center">Drug Name</TableCell>
                  <TableCell align="left">Drug Name</TableCell>
                  <TableCell align="center">Severity level</TableCell>
                  <TableCell align="center">Modification</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sliceData(users, page, rowsPerPage).map((user) => (
                  <TableRow key={user.ddi_id}>
                    <TableCell align="right">{user.ddi_id}</TableCell>
                    <TableCell align="center">{user.drug1}</TableCell>
                    <TableCell align="left">{user.drug2}</TableCell>
                    <TableCell align="center">{user.level}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Button onClick={() => UpdateUser(user.ddi_id)}>Edit</Button>
                        <Button onClick={() => UserDelete(user.ddi_id)}>Del</Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      count={users.length}
                      rowsPerPage={rowsPerPage}
                      page={page - 1}
                      onPageChange={(event, newPage) => setPage(newPage + 1)}
                      onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(1);
                      }}
                    />
                  </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="add-interaction-modal-title"
        aria-describedby="add-interaction-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="add-interaction-modal-title" variant="h6" component="h2" gutterBottom>
            Add Interaction
          </Typography>
            <Stack direction="row" spacing={2} sx={{ width: 800 }} className="me-4">
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    sx={{ width: 350 }}
                    options={options.map((option) => option.name)}
                    getOptionLabel={(option) => option.toString()}
                    value={searchinput}
                    onChange={handleChangeDrug1}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Drug"
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                        value={searchinput}
                    />
                    )}
                />
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    sx={{ width: 350 }}
                    options={options.map((option) => option.name)}
                    getOptionLabel={(option) => option.toString()}
                    value={searchinput2}
                    onChange={handleChangeDrug2}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Drug"
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                        value={searchinput2}
                    />
                    )}
                />
                </Stack>
                <div>
                <br></br><span>Severity Level   </span>
                <Select
                    label="Severity Level"
                    value={severityLevel}
                    onChange={handleSeverityLevelChange}
                    sx={{ minWidth: 150 }}
                    >
                    <MenuItem value="MINOR">MINOR</MenuItem>
                    <MenuItem value="MODERATE">MODERATE</MenuItem>
                    <MenuItem value="MAJOR">MAJOR</MenuItem>
                    </Select>
                </div>

                <div>
                    <span>Description</span>
                    </div>
                    <div>
                    
                    <textarea ref={textareaRef} value={textareaValue} onChange={handleTextareaChange} style={{height: '50%', width: '80%'} }></textarea>
                    </div>
                    <div className="d-flex">
                    <button type="button" className="btn btn-success" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleClose}>
                        Close
                    </button>
                </div>

        </Box>
      </Modal>
      <Modal
        open={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
        aria-labelledby="add-interaction-modal-title"
        aria-describedby="add-interaction-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="add-interaction-modal-title" variant="h6" component="h2" gutterBottom>
            Edit Interaction
          </Typography>
          
            <Stack direction="row" spacing={2} sx={{ width: 800 }} className="me-4">
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    sx={{ width: 350 }}
                    options={options.map((option) => option.name)}
                    getOptionLabel={(option) => option.toString()}
                    value={searchinput}
                    onChange={handleChangeDrug1}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Drug"
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                        value={searchinput}
                    />
                    )}
                />
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    sx={{ width: 350 }}
                    options={options.map((option) => option.name)}
                    getOptionLabel={(option) => option.toString()}
                    value={searchinput2}
                    onChange={handleChangeDrug2}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Drug"
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                        value={searchinput2}
                    />
                    )}
                />
                </Stack>
                <div>
                <br></br><span>Severity Level   </span>
                <Select
                    label="Severity Level"
                    value={severityLevel}
                    onChange={handleSeverityLevelChange}
                    sx={{ minWidth: 150 }}
                    >
                    <MenuItem value="MINOR">MINOR</MenuItem>
                    <MenuItem value="MODERATE">MODERATE</MenuItem>
                    <MenuItem value="MAJOR">MAJOR</MenuItem>
                    </Select>
                </div>

                <div>
                    <span>Description</span>
                    </div>
                    <div>
                    
                    <textarea ref={textareaRef} value={textareaValue} onChange={handleTextareaChange} style={{height: '50%', width: '80%'} }></textarea>
                    </div>
                    <div className="d-flex">
                    <button type="button" className="btn btn-success" onClick={handleSubmit2}>
                        Submit
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleClose2}>
                        Close
                    </button>
                </div>

        </Box>
      </Modal>
    </div>
    
    
  );
}