import './App.css';
import Interaction from './Page/interaction';
import AddSuggest from './Page/addSuggest';
import Suggestion from './Page/suggestion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Page/Dashboard';
import {UpdateSuggest} from './Page/updateSuggest';
import {DashboardIn} from './Page/DashboardIn';


function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            
            <Route path="/" exact element={<Interaction />}></Route>
            <Route path="/Suggestion" element={<Suggestion />}></Route>
            <Route path="/addSuggest" element={<AddSuggest />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/Dashboard" element={<Dashboard />}></Route>
            <Route path="/DashboardInteraction" element={<DashboardIn />}></Route>
            <Route path="/updateSuggest/:id" exact element={<UpdateSuggest />}>
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
