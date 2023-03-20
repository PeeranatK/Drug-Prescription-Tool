import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import NavLink from 'react-bootstrap/esm/NavLink';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link, Navigate } from 'react-router-dom';
import {GoogleLogin,GoogleLogout} from 'react-google-login';
import {gapi} from 'gapi-script';
import { useEffect,useState } from 'react';
//import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const  Navtop = () =>  {
  const menudata = [
    {
      path:'/',
      name:"Interaction check"
    },
    {
      path:'/Suggestion',
      name:"Drug suggestion"
    },
    
  ]
  const [profile, setProfile] = useState([]);
  const history = useNavigate();
  const clientID = '889381299945-0p5gfvqbq04tg8nbjp67dcspbkfff4hh.apps.googleusercontent.com'
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientID : clientID,
        scope: ''
      })
    }
    gapi.load("client:auth2",initClient)
  },[])
  const onSuccess = (res) =>{
    setProfile(res.profileObj);
    console.log("login success",res);
    localStorage.setItem('user', JSON.stringify(res.profileObj));
    //admin
    if(res.profileObj.email == 'p16181@gmail.com'){
      console.log("admin");
      history('/Dashboard');
    }else{
      console.log("normal");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Restricted Area',
      });
    }
    
    //history('/Dashboard');
  }
  const onFailure = (res) =>{
    console.log("login fail",res)
  }
  // const onLogout = () => {
  //   setProfile(null);
  // }

   
  return (
    <Navbar  className='Topnav' expand="lg">
      <Container>
      
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {
              menudata.map((item) => (
                <NavLink to={item.path} key={item.name} href={item.path}>
                  <div className='list_item'>{item.name}</div>
                </NavLink>

              )) 
            }
          </Nav>
          <Nav>
            {/* <Link to="/login">
              <MDBBtn outline className='mx-2' color='light'>Login</MDBBtn>
            </Link> */}
            {/* <GoogleLogin
              clientId={clientID}
              buttonText="Sign in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single-host-origin"}
              //cookiePolicy={"strict"}
              isSignedIn={true}
            /> */}
            {/* <GoogleLogin onSuccess={onSuccess} onError={onFailure} /> */}
            <GoogleLogin
              clientId="889381299945-0p5gfvqbq04tg8nbjp67dcspbkfff4hh.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure={onFailure}
              />
              {/* <GoogleLogout
              clientId="889381299945-0p5gfvqbq04tg8nbjp67dcspbkfff4hh.apps.googleusercontent.com"
              buttonText="Logout"
              onLogoutSuccess={onSuccess}
              /> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navtop;