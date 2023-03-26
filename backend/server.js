const client = require('./dbconnect.js')
const express = require("express");
const LTL = require('ltl');
const { Engine } = require('json-rules-engine');

const app  = express();
const port = 3001;

const cors = require('cors');
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000","https://drug-prescription-tool.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use('/api/profile', (req, res) => {
  console.log("api profile");
  res.send(req.body);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/", (req, res) => {
  res.json({ message: "This API working" });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

client.connect();



app.get('/api/druglist', (req, res)=>{
  client.query(`Select name from druglist`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      } else{
        console.log(`DB error1`);
      }
  });
  
})
app.get('/api/diseaselist', (req, res)=>{
  client.query(`Select name from diseaselist`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      } else{
        console.log(`DB error1`);
      }
  });
  
})
app.get('/api/topSuggest', (req, res)=>{
  client.query(`Select * from rules`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      } else{
        console.log(`DB error1`);
      }
  });
  
})

app.get('/api/topInteract', (req, res)=>{
  client.query(`Select * from d_interaction`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      } else{
        console.log(`DB error1`);
      }
  });
  
})


app.post('/api/interaction', (req, res)=>{
  const drug1 = req.body.drug1;
  const drug2 = req.body.drug2;
  const query = "Select DISTINCT * from d_interaction WHERE (drug1 = '" + drug1 + "' AND drug2 = '" + drug2 + "' ) OR (drug1 = '" + drug2 + "' AND drug2 = '" + drug1 + "' )";

  client.query(query, (err, result)=>{
    if(!err){
        res.send(result.rows);
    } else{
      console.log(`DB error2`);
      console.log(err);
    }
});
})

app.post('/api/resultInteract', (req, res)=>{
  const id = req.body.id;
  const query = "Select * from d_interaction  WHERE ddi_id = " + id ;

  client.query(query, (err, result)=>{
    if(!err){
        res.send(result.rows);
    } else{
      console.log(`DB error2`);
      console.log(err);
    }
});
})
app.post('/api/resultSuggest', (req, res)=>{
  const id = req.body.id;
  const query = "Select * from rules JOIN rule_conditions ON rules.rid = rule_conditions.rule_id WHERE rules.rid = " + id ;

  client.query(query, (err, result)=>{
    if(!err){
        res.send(result.rows);
    } else{
      console.log(`DB error2`);
      console.log(err);
    }
});
})

app.post('/api/addSuggest', async (req, res)=>{
  const data = req.body.condition;
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      "INSERT INTO rules (name, description, method, priority) VALUES ($1, $2, $3, $4) RETURNING rid",
      [req.body.dname, req.body.suggestion, req.body.method, req.body.priority]
    );
    const rId = userResult.rows[0].rid;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      await client.query(
        'INSERT INTO rule_conditions (rule_id, fact, operator, value) VALUES ($1, $2, $3, $4)',
        [rId, row.col1, row.col2, row.col3]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Data added successfully",
    });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding data",
    });
  } finally {
  }

})

app.post('/api/addInteract', async (req, res)=>{

  try {
    await client.query('BEGIN');
    //get highest id
    const userResult = await client.query("SELECT MAX(ddi_id) FROM d_interaction");
    const rId = userResult.rows[0].max;
    const id = rId + 1;

      await client.query(
        'INSERT INTO d_interaction (ddi_id, drug1, drug2, description, level) VALUES ($1, $2, $3, $4, $5)',
        [id, req.body.dname1, req.body.dname2, req.body.description,req.body.level]
      );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Data added successfully",
    });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding data",
    });
  } 

})

app.post('/api/updateSuggest', async (req, res)=>{
  const data = req.body.condition;
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM rule_conditions WHERE rule_id = $1',[req.body.rid]);
    await client.query('DELETE FROM rules WHERE rid = $1',[req.body.rid]);
    const userResult2 = await client.query("SELECT MAX(rid) FROM rules");
    const rId = userResult2.rows[0].max;
    const id = rId + 1;
    const userResult = await client.query(
      "INSERT INTO rules (rid, name, description, method, priority) VALUES ($1, $2, $3, $4, $5)",
      [id, req.body.dname, req.body.suggestion, req.body.method, req.body.priority]
    );
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const userResult2 = await client.query("SELECT MAX(cid) FROM rule_conditions");
      const rId = userResult2.rows[0].max;
      const id2 = rId + 1;
      await client.query(
        'INSERT INTO rule_conditions (cid,rule_id, fact, operator, value) VALUES ($1, $2, $3, $4,$5)',
        [id2,id, row.col1, row.col2, row.col3]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Data added successfully",
    });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding data",
    });
  }
})

app.post('/api/updateInteract', async (req, res)=>{

  const data = req.body.condition;
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM d_interaction WHERE ddi_id = $1',[req.body.id]);
    const userResult = await client.query("SELECT MAX(ddi_id) FROM d_interaction");
    const rId = userResult.rows[0].max;
    const id = rId + 1;

      await client.query(
        'INSERT INTO d_interaction (ddi_id, drug1, drug2, description, level) VALUES ($1, $2, $3, $4, $5)',
        [id, req.body.dname1, req.body.dname2, req.body.description,req.body.level]
      );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Data added successfully",
    });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding data",
    });
  }
})

app.post('/api/deleteSuggest', async (req, res)=>{
  console.log(req.body.rid);
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM rule_conditions WHERE rule_id = $1',[req.body.rid]);
    await client.query('DELETE FROM rules WHERE rid = $1',[req.body.rid]);
    

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Data added successfully",
    });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding data",
    });
  }
})

app.post('/api/deleteInteract', async (req, res)=>{
  console.log(req.body.rid);
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM d_interaction WHERE ddi_id = $1',[req.body.rid]);
    

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Data added successfully",
    });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding data",
    });
  }
})




let engine = new Engine()



async function createRuleEngine(dname,factS) {
  const engine = new Engine(undefined, { ignoreFactChanges: true });

  const rules = await client.query("SELECT * FROM rules WHERE name = '" + dname + "'");
  if (rules.rows.length === 0) {
    return("No information");
  }
  const ruleCon = await client.query('SELECT * FROM rule_conditions');
  const ruleConditions = ruleCon.rows;
  const sortedRules = rules.rows.sort((a, b) => a.priority - b.priority);
  const executeRule = async (rule, facts) => {
    const conditions = ruleConditions.filter(c => c.rule_id === rule.rid);
    var ruleJson;
    if(rule.method == 'all'){
      ruleJson = {
        event: {
          type: 'rule-event',
          params: {
            ruleId: rule.rid,
            message: rule.description
          }
        },
        conditions: {
          all: conditions.map(condition => ({
            fact: condition.fact,
            operator: condition.operator,
            value: condition.value
          }))
        }
      };
    }else{
      ruleJson = {
        event: {
          type: 'rule-event',
          params: {
            ruleId: rule.rid,
            message: rule.description
          }
        },
        conditions: {
          any: conditions.map(condition => ({
            fact: condition.fact,
            operator: condition.operator,
            value: condition.value
          }))
        }
      };
    }
    
    engine.addRule(ruleJson);
    const result = await engine.run(factS);

    if (result.events.length > 0) {
      const event = result.events[0];
      return event.params.message;
    } else {
      engine.removeRule(ruleJson);
      return false;
    }
  };


  if(factS.disease == null){
    for (const rule of sortedRules) {
      const message = await executeRule(rule, factS.disease);
      if (message) {
        return message;
      }
    }
  }else
  // Separate the disease array into two facts
  if (factS.disease.length === 0) {;
    for (const rule of sortedRules) {
      const message = await executeRule(rule, factS.disease);
      if (message) {
        return message;
      }
    }
  }else{
    for (const disease of factS.disease) {
      let diseaseFacts = { ...factS, disease };
      for (const rule of sortedRules) {
        var message;
        if(factS.age =="" &&factS.sex =="" &&factS.pregnancy =="" &&factS.lactation =="" &&factS.kidney =="" &&factS.disease =="" &&factS.weight ==""){
          const sortedRules2 = rules.rows.sort((a, b) => b.priority - a.priority);
        }else{
          message = await executeRule(rule, diseaseFacts);
        }
        if (message) {
          return message;
        }
      }
    }
  }
  
  
}





// runEngine();
async function runEngine(dname) {
  const engine = await createRuleEngine(dname);
  let facts = {
    age: '',
    drugName: '',
    sex: '',
    pregnancy: '', 
    lactation: '',
    disease: '',
    kidney: '',
    weight: '',
    alwaysTrue: 'true',
  }

  const results = await engine.run(facts).then(({ events }) => {
    events.map(event => console.log(event.params.message))
  })

}


app.post('/api/drugdisease', async (req, res)=>{
  
  req.body.age = req.body.age == "" ? null : req.body.age;
  req.body.sex = req.body.sex == "" ? null : req.body.sex;
  req.body.pregnancy = req.body.pregnancy == "" ? null : req.body.pregnancy;
  req.body.lactation = req.body.lactation == "" ? null : req.body.lactation;
  req.body.kidney = req.body.kidney == "" ? null : req.body.kidney;
  req.body.disease = req.body.disease == "" ? null : req.body.disease;
  req.body.weight = req.body.weight == "" ? null : req.body.weight;
  if(req.body.pregnancy != null){
    req.body.pregnancy = req.body.pregnancy.toString();
  }
  if(req.body.lactation != null){
    req.body.lactation = req.body.lactation.toString();
  }
  if(req.body.sex == 'male'){
    const truth = false;
    req.body.lactation = truth.toString();
    req.body.pregnancy = truth.toString();
  }
  let fact = {
    age: req.body.age,
    sex: req.body.sex,
    pregnancy: req.body.pregnancy, 
    lactation: req.body.lactation,
    kidney: req.body.kidney,
    disease: req.body.disease,
    weight: req.body.weight,
    alwaysTrue: true.toString(),
  }

  const output = await createRuleEngine(req.body.dname,fact);

  res.send(output);

})










//close connection with database
process.on('SIGINT', () => {
  client.end(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

module.exports = app;