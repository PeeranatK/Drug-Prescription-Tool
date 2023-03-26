
import React from "react";
import { MDBContainer, MDBIcon } from "mdbreact";
import "./interaction.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { useState } from "react";
import Axios from 'axios';
import { useEffect } from "react";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Navtop from '../Component/Navbar';

const Interaction = () => {
  const [searchinput, setSearchinput] = useState('');
  const [saveinput, setSaveinput] = useState([]);
  const [result, setResult] = useState([]);
  const [index, setIndex] = useState(0);
  var heading = ["", "", "Severity","Description"];
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event, value) => {
    setSearchinput(value);
  };

  function handleDeleteClick(id,text) {
    const removeItem = saveinput.filter((saveinput) => {
      return saveinput.id !== id
    })
    const removeResult = result.filter((result) => {
      return !(result.id1 === id || result.id2 === id);
    });
    setSaveinput(removeItem);
    setResult(removeResult);
  }

  const objectArrayToArray = (arr, prop) => arr.map(item => item[prop]);

  function getAllPairs(arr) {
    return arr.reduce((result, current, i) => {
        return result.concat(arr.slice(i + 1).map(x => [current, x]))
    }, [])
  }

  function findInteraction(drug1,drug2,id1,id2) {
    Axios.post('https://drug-prescription-tool-api.vercel.app/api/interaction', {
      'drug1' : drug1,
      'drug2' : drug2
    }).then((respond) => {
      console.log(respond.data);
      console.log(respond.data.length);
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

  const memoizedFindInteraction = useCallback((drug1, drug2, id1, id2) => {
    Axios.post('https://drug-prescription-tool-api.vercel.app/api/interaction', {
      'drug1' : drug1,
      'drug2' : drug2
    }).then((respond) => {
      console.log(respond.data);
      console.log(respond.data.length);
      if(respond.data.length > 0){
        const newData = {
          id: result.length + 1,
          id1: id1,
          id2: id2,
          drug1: respond.data.map(obj => obj.drug1),
          drug2: respond.data.map(obj => obj.drug2),
          level: respond.data.map(obj => obj.level),
          description: respond.data.map(obj => obj.description),
        };
        const isDuplicate = result.some(item => 
          item.drug1[0] === newData.drug1[0] && 
          item.drug2[0] === newData.drug2[0] && 
          item.level[0] === newData.level[0] &&
          item.description[0] === newData.description[0]
        );
        if(!isDuplicate){
          setResult(prevResult => [...prevResult, newData]);
        }
      }
  
      console.log(result);
      console.log(result.length);
    })
  }, [result]);

  const [options, setOptions] = useState([]);
  useEffect(() => {
    
    async function fetchSuggestions() {
        const response = await Axios.get(`https://drug-prescription-tool-api.vercel.app/api/druglist`);
        setOptions(response.data);
    }
  
    fetchSuggestions();
  }, [searchinput]);
  useEffect(() => {
    function startInput() {
      setIndex(i => i + 1);
      setSaveinput(prevSaveinput => [
        ...prevSaveinput,
        {
          id: index,
          text: searchinput.trim()
        }
      ]);
      setSearchinput('');
    }
    if (searchinput !== '') {
      startInput();
    }
  }, [searchinput]);

  useEffect(() => {
    if(saveinput.length >= 2){
      let pair = getAllPairs(objectArrayToArray(saveinput,'text'));
      let pair_id = getAllPairs(objectArrayToArray(saveinput,'id'));
      console.log(pair);
      for(var i = 0; i < pair.length; i++){
        //findInteraction
        memoizedFindInteraction(pair[i][0],pair[i][1],pair_id[i][0],pair_id[i][1]);
      }
    }
  }, [saveinput,memoizedFindInteraction])


  return (
    <div>

<Navtop />
    <MDBContainer>
      <div>
        <br /><h1 className="text-center">Drug Interaction Check</h1><br />
      </div>
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
          <li key = {saveinput.id}>
            {saveinput.text}
            {" "}
            <button onClick={() => handleDeleteClick(saveinput.id,saveinput.text)}>X</button>
        </li>

        ))}
      </ul>
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
                    <span className="drug-name">{interaction.drug1}</span><img src={`${process.env.PUBLIC_URL}/arrow.png`} alt="And" />  <span className="drug-name">{interaction.drug2}</span>
                  </td>
                  <td>
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