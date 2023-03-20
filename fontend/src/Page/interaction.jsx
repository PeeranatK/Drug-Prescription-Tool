
import React from "react";
import { MDBContainer, MDBIcon } from "mdbreact";
import "./interaction.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { useState } from "react";
//import SelectItem from './selectlist';
import Axios from 'axios';
import { useEffect } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import options from './data';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import SearchBar from './Components/SearchBar.jsx'
import Users from './data.json'
import { AutoComplete, InputGroup } from "rsuite";
import Autosuggest from 'react-autosuggest';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Navtop from '../Component/Navbar';

const Interaction = () => {
  const [searchinput, setSearchinput] = useState('');
  const [saveinput, setSaveinput] = useState([]);
  const [result, setResult] = useState([]);
  //var index = 0;
  const [index, setIndex] = useState(0);
  var heading = ["", "", "Severity","Description"];
  const [inputValue, setInputValue] = useState('');
  //const [suggestions, setSuggestions] = useState([]);





  
  


  const handleChange = (event, value) => {
    //setSearchinput(event.target.value);
    //console.log(event.target.value);
    //console.log(searchinput);
    //console.log(value);
    setSearchinput(value);
    //console.log(searchinput);
    //startInput();
  };

  function handleDeleteClick(id,text) {
    const removeItem = saveinput.filter((saveinput) => {
      return saveinput.id !== id
    })
    //console.log(id);
    const removeResult = result.filter((result) => {
      //return (result.drug1 !== text && result.drug2 !== text)
      return (result.id1 !== id && result.id2 !== id)
    })
    // console.log(text);
    // console.log(result.drug2);
    // console.log(saveinput.id);
    // console.log(removeItem);
    // console.log(removeResult);
    setSaveinput(removeItem);
    setResult(removeResult);
  }

  const objectArrayToArray = (arr, prop) => arr.map(item => item[prop]);

  function getAllPairs(arr) {
    return arr.reduce((result, current, i) => {
        return result.concat(arr.slice(i + 1).map(x => [current, x]))
    }, [])
  }


  function startInput(){
    //console.log(index);
    setIndex(index + 1);
    //console.log(searchinput);
    setSaveinput([
      ...saveinput,
      {
        id: index,
        text: searchinput.trim()
      }
    ])
    setSearchinput('');
    //console.log(saveinput.length);
    //console.log(saveinput);
  }





  function findInteraction(drug1,drug2,id1,id2) {
    Axios.post('http://localhost:3001/api/interaction', {
      'drug1' : drug1,
      'drug2' : drug2
    }).then((respond) => {
      console.log(respond.data);
      console.log(respond.data.length);
      //console.log(respond.data.map(obj => obj.drug1));
      if(respond.data.length > 0){
        setResult([
          ...result,
          {
            id: result.length + 1,
            id1: id1,
            id2: id2,
            drug1: respond.data.map(obj => obj.drug1),
            drug2: respond.data.map(obj => obj.drug2),
            level: respond.data.map(obj => obj.level),
            description: respond.data.map(obj => obj.description),
          }
        ])
      }
      

      console.log(result);
      console.log(result.length);
    })
  }

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
  useEffect(() => {
    if (searchinput !== '') {
      startInput();
    }
  }, [searchinput]);

  useEffect(() => {
    if(saveinput.length >= 2){
      //obj -> array -> 
      //console.log(saveinput.length);
      //console.log(saveinput);
      //console.log(objectArrayToArray(saveinput,'text'));
      let pair = getAllPairs(objectArrayToArray(saveinput,'text'));
      let pair_id = getAllPairs(objectArrayToArray(saveinput,'id'));
      console.log(pair);
      for(var i = 0; i < pair.length; i++){
        //console.log(pair[i]);
        //findInteraction
        findInteraction(pair[i][0],pair[i][1],pair_id[i][0],pair_id[i][1]);
      }
      
      //console.log(pair[0][0]);
      //console.log(pair[0].length);
      //findInteraction
      //findInteraction(pair[0][0],pair[0][1]);
    }
  }, [saveinput])

  //console.log(saveinput);
  //findInteraction("Abacavir","Aceclofenac");

  
  //test();
  //test2("Abacavir","Aceclofenac");

  return (
    <div>

<Navtop />
    <MDBContainer>
      <div>
        <br /><h1 className="text-center">Drug Interaction Check</h1><br />
      </div>
      
      {/* <div className="input-group md-form form-sm form-2 pl-0">
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
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div> */}
      <div className="d-flex align-items-center">
        <Stack spacing={2} sx={{ width: '100%' }} className="me-4">
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={options.map((option) => option.name)}
          getOptionLabel={(option) => option.toString()}
          value={searchinput}
          onChange={handleChange}
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
        
      </div>
      <ul className="select-list">
        {saveinput.map((saveinput) => (
          /*<SelectItem 
            saveinput={saveinput}
            onDeleteClick={handleDeleteClick}
          />*/
          <li key = {saveinput.id}>
            {saveinput.text}
            {" "}
            <button onClick={() => handleDeleteClick(saveinput.id,saveinput.text)}>X</button>
        </li>

        ))}
      </ul>

      
      {/* <div className="output">

        {result.map((result) => (
          <div key={result.id} className='result'>
          <div className="drug1">{result.drug1}</div>
          <div className="drug2">{result.drug2}</div>
          <div className="status">{result.level}</div>
          <div className="describtion">{result.description}</div>
          </div>
        ))}

      </div> */}
      {result.length > 0 && (
      <table className="drug-interaction-table">
      <thead>
        <tr>
          <th>Drug Interaction</th>
          <th>Severity</th>
          <th>Description</th>
        </tr>
      </thead>
      {result.length > 0 && (
      <tbody>
        {/* {result.length > 0 ? (
        result.map((interaction) => (
          <tr key={interaction.id}>
            <td>
              <span className="drug-name">{interaction.drug1}</span><img src="https://cdn2.iconfinder.com/data/icons/social-productivity-line-black-1/3/27-1024.png" alt="And" />  <span className="drug-name">{interaction.drug2}</span>
              
            </td>
            <td>
              <span className="severity">{interaction.level}</span>
            </td>
            <td>
              <span className="description">{interaction.description}</span>
            </td>
          </tr>
        ))): null} */}
        {result.length > 0 && (
          result.reduce((acc, interaction) => {
            if (!acc.keys.has(interaction.id)) {
              let severityClassName = "";

              if (interaction.level === "MINOR") {
                severityClassName = "severity-yellow";
              } else if (interaction.level === "MODERATE") {
                severityClassName = "severity-red";
              } else if (interaction.level === "MAJOR") {
                severityClassName = "severity-purple";
              }
              acc.keys.add(interaction.id);
              acc.rows.push(
                <tr key={interaction.id}>
                  <td>
                    <span className="drug-name">{interaction.drug1}</span><img src="https://cdn2.iconfinder.com/data/icons/social-productivity-line-black-1/3/27-1024.png" alt="And" />  <span className="drug-name">{interaction.drug2}</span>
                  </td>
                  <td>
                  {/* <span className={interaction.level === "MINOR" ? "severity-yellow" : (interaction.level === "MODERATE" ? "severity-red" : (interaction.level === "MAJOR" ? "severity-purple" : ""))}>{interaction.level}</span> */}

                    {/* <span className="severity">{interaction.level}</span> */}
                    {/* {interaction.level === "MINOR" ? (
                      <span className="severity-yellow">{interaction.level}</span>
                    ) : interaction.level === "MODERATE" ? (
                      <span className="severity-red">{interaction.level}</span>
                    ) : interaction.level === "MAJOR" ? (
                      <span className="severity-purple">{interaction.level}</span>
                    ) : null} */}
                    <span className={interaction.level}>{interaction.level}</span>
                  </td>
                  <td>
                    <span className="description">{interaction.description}</span>
                  </td>
                </tr>
              );
            }
            return acc;
          }, {keys: new Set(), rows: []}).rows
        )}
      </tbody>
      )}
    </table>
    )}
    </MDBContainer>
    </div>
  );
}

export default Interaction;