import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

import Axios from 'axios';

async function loginUser(credentials) {
  try {
    const response = await Axios.post('http://localhost:3001/login', credentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  }

  return(
    <div className="login-wrapper">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// };