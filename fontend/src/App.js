import './App.css';
import Interaction from './Page/interaction';
//import Page2 from './Page/page2';
import AddSuggest from './Page/addSuggest';
//import Page5 from './Page/page5';
import Suggestion from './Page/suggestion';
import Navtop from './Component/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Signin from './Page/Sigin';
import Dashboard from './Page/Dashboard';
import Login from './Page/Login';
import useToken from './Page/useToken';
import { useState, useEffect } from 'react';
import {UpdateSuggest} from './Page/updateSuggest';
import {DashboardIn} from './Page/DashboardIn';
/*function App() {
  const [druglist, setDruglist] = useState([]);
  const getdruglist = () => {
    Axios.get('/druglist').then((respond) => {
      setDruglist(respond.data);
    })
  }
  getdruglist();
  return (
    <div className="App">
      <form>
        <label key="{label}">Enter your name:
          <input key="{text}" type="text" />
        </label>
      </form>
      <div className='Druglist'>
        {druglist.map((val,key) => {
          return (
            <div className='Drug list' key={key}>
              <p key="{name}" className="card-text1">Name: {val.name}</p>
              <p key="{alias}" className="card-text2">Name: {val.alias}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}*/

function App() {
  
  // if(!token) {
  //   return <Login setToken={setToken} />
  // }

  return (
    <div>
      <Router>
        <div className="App">
          {/* <Navtop /> */}
          <Routes>
            
            <Route path="/" exact element={<Interaction />}></Route>
            <Route path="/Suggestion" element={<Suggestion />}></Route>
            <Route path="/addSuggest" element={<AddSuggest />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/Dashboard" element={<Dashboard />}></Route>
            <Route path="/DashboardInteraction" element={<DashboardIn />}></Route>
            <Route path="/updateSuggest/:id" exact element={<UpdateSuggest />}>
            {/* <Route path="/addInteract" element={<AddInteract />}></Route> */}
            
            {/* <Route path="/updateInteract/:id" exact element={<UpdateInteract />}></Route> */}
            
            
              
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
