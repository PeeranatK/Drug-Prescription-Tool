import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link } from "react-router-dom";
import ButtonAppBar from '../Component/Nav';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [sresult, setsResult] = useState('');
  const [result, setResult] = useState('');
  const history = useNavigate();
  useEffect(() => {
    UsersGet()
    //console.log(profile);
  }, [])
  
  const UsersGet = () => {
    Axios.get("http://localhost:3001/api/topSuggest")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const UpdateUser = id => {
    console.log("rid" + id);
    const link = '/updateSuggest/'+id;
    //history('/updateSuggest/${id}');
    history(link);
  }

  const UserDelete = id => {
    Axios.post('http://localhost:3001/api/deleteSuggest', {
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
                    {/* <TableCell align="left">Last</TableCell> */}
                    <TableCell align="center">Severity level</TableCell>
                    <TableCell align="center">Modification</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                    <TableRow key={user.rid}>
                        <TableCell align="right">{user.rid}</TableCell>
                        {/* <TableCell align="center">
                        <Box display="flex" justifyContent="center">
                            <Avatar src={user.avatar} />
                        </Box>
                        </TableCell> */}
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
                </Table>
            </TableContainer>
            </Paper>
        </Container>
    </div>
    
    
  );
}