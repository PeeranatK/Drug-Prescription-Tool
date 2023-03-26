import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import ButtonAppBar from '../Component/Nav';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {sliceData, calculateRange} from './table-pagiation';
import { TextField,TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, Box, Link, ButtonGroup, Avatar, TableFooter, TablePagination } from "@mui/material";


export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [sresult, setsResult] = useState('');
  const [result, setResult] = useState('');
  const [page, setPage] = useState(1); // current page number
  const [rowsPerPage, setRowsPerPage] = useState(10); // number of rows per page
  const [searchText, setSearchText] = useState('');
  const [original, setOriginal] = useState([]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredUsers = original.slice().filter(user => user.name.toLowerCase().includes(value));
    setUsers(filteredUsers);
    setSearchText(value);
    setPage(1);
  }
  const history = useNavigate();
  useEffect(() => {
    UsersGet()
  }, [])
  
  const UsersGet = () => {
    Axios.get("https://drug-prescription-tool-api.vercel.app/api/topSuggest")
      .then(response => {
        setUsers(response.data);
        setOriginal(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const UpdateUser = id => {
    console.log("rid" + id);
    const link = '/updateSuggest/'+id;
    history(link);
  }

  const UserDelete = id => {
    Axios.post('https://drug-prescription-tool-api.vercel.app/api/deleteSuggest', {
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
        <Container sx={{ p:2 }} maxWidth="lg">    
            <Paper sx={{ p:2 }}>
                <Box display="flex">
                <Box flexGrow={1}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Suggestion
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
                    <Link to="/addSuggest">
                    <Button variant="contained" color="primary">
                        Add
                    </Button>
                    </Link>
                </Box>
                </Box>
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell align="right">ID</TableCell>
                    <TableCell align="center">Drug Name</TableCell>
                    <TableCell align="left">Suggestion</TableCell>
                    <TableCell align="center">Severity level</TableCell>
                    <TableCell align="center">Modification</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sliceData(users, page, rowsPerPage).map((user) => (
                      <TableRow key={user.rid}>
                          <TableCell align="right">{user.rid}</TableCell>
                          <TableCell align="center">{user.name}</TableCell>
                          <TableCell align="left">{user.description}</TableCell>
                          <TableCell align="center">{user.priority}</TableCell>
                          <TableCell align="center">
                          <ButtonGroup color="primary" aria-label="outlined primary button group">
                              <Button onClick={() => UpdateUser(user.rid)}>Edit</Button>
                              <Button onClick={() => UserDelete(user.rid)}>Del</Button>
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
    </div>
    
    
  );
}