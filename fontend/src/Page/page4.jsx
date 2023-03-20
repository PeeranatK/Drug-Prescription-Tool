import React, { useState } from "react";
import { FormGroup, Label, Input, Button, ListGroup, ListGroupItem } from "reactstrap";

const Page4 = () => {
  const [riskFactor, setRiskFactor] = useState("");
  const [drugName, setDrugName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    setDrugName(e.target.value);
  };

  const handleSelectChange = (e) => {
    setRiskFactor(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // make API call or fetch data based on riskFactor and drugName
    // set suggestions based on API response
  };

  return (
    <div>
      <h2>Drug Suggestion</h2>
      <form onSubmit={handleFormSubmit}>
        <FormGroup>
          <Label for="drugName">Drug Name:</Label>
          <Input
            type="text"
            id="drugName"
            placeholder="Enter drug name"
            value={drugName}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="riskFactor">Risk Factor:</Label>
          <Input
            type="text"
            id="riskFactor"
            placeholder="Enter risk factor"
            onChange={handleSelectChange}
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </form>
      {suggestions.length > 0 && (
        <ListGroup>
          {suggestions.map((suggestion) => (
            <ListGroupItem key={suggestion.id}>{suggestion.name}</ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Page4;