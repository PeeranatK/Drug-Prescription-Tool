const client = require('./dbconnect.js')
const express = require("express");
const func1 = require("./interaction");
const LTL = require('ltl');
//const { Engine } = require('json-rules-engine');
//const RuleEngine = require('json-rules-engine');

const app  = express();
const port = 3001;

const cors = require('cors');
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
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

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

client.connect();

/*app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With Content-Type, Accept');
  next();
})*/


/*const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(express.json());*/


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
        //console.log(result.rows); 
    } else{
      console.log(`DB error2`);
      console.log(err);
    }
});
  //client.end;
})

app.post('/api/resultInteract', (req, res)=>{
  const id = req.body.id;
  const query = "Select * from d_interaction  WHERE ddi_id = " + id ;

  client.query(query, (err, result)=>{
    if(!err){
        res.send(result.rows);
        //console.log(result.rows); 
    } else{
      console.log(`DB error2`);
      console.log(err);
    }
});
  //client.end;
})
app.post('/api/resultSuggest', (req, res)=>{
  const id = req.body.id;
  const query = "Select * from rules JOIN rule_conditions ON rules.rid = rule_conditions.rule_id WHERE rules.rid = " + id ;

  client.query(query, (err, result)=>{
    if(!err){
        res.send(result.rows);
        //console.log(result.rows); 
    } else{
      console.log(`DB error2`);
      console.log(err);
    }
});
  //client.end;
})

app.post('/api/addSuggest', async (req, res)=>{
  //const drug1 = req.body.drug1;
  //console.log(req.body);
  //console.log(req.body.condition);
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
    //client.release();
  }
//   const drug2 = req.body.drug2;
//   const query = "Select * from d_interaction WHERE drug1 = '" + drug1 + "' AND drug2 = '" + drug2 + "'";

//   client.query(query, (err, result)=>{
//     if(!err){
//         res.send(result.rows);
//         //console.log(result.rows); 
//     } else{
//       console.log(`DB error2`);
//       console.log(err);
//     }
// });
  //client.end;
})

app.post('/api/addInteract', async (req, res)=>{
  //const drug1 = req.body.drug1;
  //console.log(req.body);
  //console.log(req.body.description);
  //const data = req.body.condition;
  try {
    await client.query('BEGIN');
    //get highest id
    const userResult = await client.query("SELECT MAX(ddi_id) FROM d_interaction");
    const rId = userResult.rows[0].max;
    const id = rId + 1;
    // for (let i = 0; i < data.length; i++) {
    //   const row = data[i];

      await client.query(
        'INSERT INTO d_interaction (ddi_id, drug1, drug2, description, level) VALUES ($1, $2, $3, $4, $5)',
        [id, req.body.dname1, req.body.dname2, req.body.description,req.body.level]
      );
    // }

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
  //const drug1 = req.body.drug1;
  //console.log(req.body);
  //console.log(req.body.condition);
  const data = req.body.condition;
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM rule_conditions WHERE rule_id = $1',[req.body.rid]);
    await client.query('DELETE FROM rules WHERE rid = $1',[req.body.rid]);
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
  }
})

app.post('/api/updateInteract', async (req, res)=>{
  //const drug1 = req.body.drug1;
  //console.log(req.body);
  //console.log(req.body.condition);
  const data = req.body.condition;
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM d_interaction WHERE ddi_id = $1',[req.body.id]);
    const userResult = await client.query("SELECT MAX(ddi_id) FROM d_interaction");
    const rId = userResult.rows[0].max;
    const id = rId + 1;
    // for (let i = 0; i < data.length; i++) {
    //   const row = data[i];

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
  //const drug1 = req.body.drug1;
  //console.log(req.body);
  console.log(req.body.rid);
  //const data = req.body.condition;
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
  //const drug1 = req.body.drug1;
  //console.log(req.body);
  console.log(req.body.rid);
  //const data = req.body.condition;
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

//temproral logic
//package 
// Define the patient factor and drug name

// const age = 30;
// const drugName = 'Etoricoxib';
// const sex = 'male';
// const pregnancy = false;
// const lactation = false;
// const disease = '';
// const kidney = '';

/*(if(drugName == 'Ibuprofen'){
  console.log("1");
}
// Define the temporal logic formula
function evaluateFormula(age, drugName) {
  return age >= 18 && (drugName === 'Ibuprofen' || drugName === 'Paracetamol');
}

// Evaluate the formula with the patient factor and drug name
const result = evaluateFormula(age, drugName);

// Print the output
if (result) {
  console.log('Warning: This drug may cause liver damage. Please consult your doctor before taking it.');
} else {
  console.log('Instruction: Take the drug with food to reduce the risk of stomach irritation.');
}


if(drugName == 'Ibuprofen'){
  console.log("1");
}*/

// switch(drugName) {
//   case "Etoricoxib":
//     //next
//     //contraindicated
//     if(pregnancy||lactation||disease == 'Heart failure'||disease == 'Ischemic heart disease'||disease == 'Peripheral artery disease'||disease == 'cerebrovascular disease'||age < 15 || kidney == 'CrCl<30 mL/min'){
//       message = "contraindicated";
//     }else{
//       //caution
//       if(sex == 'female'||disease == 'asthma'||disease == 'diabetes'||kidney == 'CrCl>=30 mL/min'){
//         message = "caution";
//       }else{
//         message = "Dosing : 30-120 mg Once Daily";
//       }
//     }
//     break;
//   case "Rivaroxaban":
//      //next
//     //contraindicated
//     if(age < 18 ||disease == 'active pathological bleeding'|| kidney == 'CrCl<30 mL/min'){
//       message = "contraindicated";
//     }else{
//       //caution
//       if(disease == 'Valvular disease'||disease == 'diabetes'||kidney == 'CrCl>=30 mL/min'){
//         message = "caution";
//       }else{
//         message = "Dosing : 30-120 mg Once Daily";
//       }
//     }
//     break;
//   default:
//     message = "Unknown";
// }

//console.log(message);

const { Engine } = require('json-rules-engine');

/**
 * Setup a new engine
 */
let engine = new Engine()

// define a rule for detecting the player has exceeded foul limits.  Foul out any player who:
// (has committed 5 fouls AND game is 40 minutes) OR (has committed 6 fouls AND game is 48 minutes)
/*engine.addRule({
  conditions: {
    any: [{
      all: [{
        fact: 'pregnancy',
        operator: 'equal',
        value: true
      }, {
        fact: 'lactation',
        operator: 'equal',
        value: 5
      }]
    }, {
      all: [{
        fact: 'gameDuration',
        operator: 'equal',
        value: 48
      }, {
        fact: 'personalFoulCount',
        operator: 'greaterThanInclusive',
        value: 6
      }]
    }]
  },
  event: {  // define the event to fire when the conditions evaluate truthy
    type: 'fouledOut',
    params: {
      message: 'Player has fouled out!'
    }
  }
})*/

// app.post('/drugdisease', (req, res) => {
//   console.log(req.body);
//   res.send('Received the data');
// });


// app.post('/drugdisease', (req, res)=>{
//   //const drug = req.body.drug;

//   const drug = 'Etoricoxib';
//   console.log('drug : '+ drug);
// //})
//   //console.log('drug : '+req.body);
//   //res.send("check");

//   const query = "Select * from d_suggest WHERE dname = '" + drug + "' " ;

//   client.query(query, (err, result)=>{
//     if(!err){
//         res.send(result.rows);
//         //Get data from database
//         let db_disease_con, db_disease_cau;
//         let value = result.rows;
//         value.forEach(row => {
//           db_disease_con = row.contraindicate;
//           db_disease_cau = row.caution;
//         });
//         //console.log(value); 
//         //console.log(result.rows); 
//     } else{
//       console.log(`DB error3`);
//       console.log(err);
//     }
    
//     /*
    


//     // Run the engine to evaluate
//     engine.run(fact).then(({ events }) => {
//       events.map(event => console.log(event.params.message))
//     })
//     */



//   });
//   //client.end;

  
// })

// //Get disease from database 
// let db_disease_con = ['heart failure', 'ischemic heart disease', 'peripheral artery disease', 'cerebrovascular disease'];
// let db_disease_cau = ['heart failure', 'ischemic heart disease', 'peripheral artery disease', 'cerebrovascular disease'];
// let Rule1,Rule2,Rule3,RuleD;

// // switch (drugName) {
// //   case 'Etoricoxib':
// //     //Etoricoxib
// //     Rule1 = {
// //   priority: 1,
// //   conditions: {
// //     any: [
// //       { fact: 'pregnancy', operator: 'equal', value: true },
// //       { fact: 'lactation', operator: 'equal', value: true },
// //       { fact: 'disease', operator: 'in', value:  db_disease_con},
// //       { fact: 'age', operator: 'lessThan', value: 15 },
// //       { fact: 'kidney', operator: 'lessThan', value: 30 }
// //     ]
// //   },
// //   event: {  // define the event to fire when the conditions evaluate truthy
// //     type: 'contraindicated',
// //     params: {
// //       message: 'contraindicated'
// //     }
// //   }
// //     }
// //     Rule2 = {
// //   priority: 2,
// //   conditions: {
// //     any: [
// //       { fact: 'sex', operator: 'equal', value: 'female' },
// //       { fact: 'disease', operator: 'in', value:  db_disease_cau},
// //       { fact: 'kidney', operator: 'greaterThanInclusive', value: 30 }
// //     ]
// //   },
// //   event: {
// //     type: 'caution',
// //     params: {
// //       message: 'Used with caution'
// //     }
// //   }
// //     }
// //     // Default rule: If none of the other rules match, log a message
// //     RuleD = {
// //   priority: 3,
// //   conditions: {
// //     all: [
// //       {
// //         fact: 'alwaysTrue', // a fact that is always true
// //         operator: 'equal',
// //         value: true
// //       }
// //     ]
// //   },
// //   event: {
// //     type: 'log_message',
// //     params: { message: 'Dosing : 30-120 mg Once Daily' }
// //   }
// //     };
// //     engine.addRule(Rule1);
// //     engine.addRule(Rule2);
// //     engine.addRule(RuleD);
// //     break;
// //   case 'Rivaroxaban':
// //     //Rivaroxaban
// //     Rule1 = {
// //   priority: 1,
// //   conditions: {
// //     any: [
// //       { fact: 'disease', operator: 'in', value:  db_disease_con},
// //       { fact: 'age', operator: 'lessThan', value: 18 },
// //     ]
// //   },
// //   event: {  // define the event to fire when the conditions evaluate truthy
// //     type: 'contraindicated',
// //     params: {
// //       message: 'contraindicated'
// //     }
// //   }
// //     }
// //     Rule2 = {
// //   priority: 2,
// //   conditions: {
// //     all: [
// //       { fact: 'disease', operator: 'in', value:  db_disease_cau}
// //     ]
// //   },
// //   event: {
// //     type: 'caution',
// //     params: {
// //       message: 'Used with caution'
// //     }
// //   }
// //     }
// //     Rule3 = {
// //   priority: 3,
// //   conditions: {
// //     any: [
// //       { fact: 'kidney', operator: 'notEqual', value: '' }
// //     ]
// //   },
// //   event: {
// //     type: 'caution',
// //     params: {
// //       message: {
// //         if: [
// //           {
// //             fact: 'kidney',
// //             operator: 'greaterThan',
// //             value: 50
// //           },
// //           {
// //             then: 'No dosage adjustment necessary.'
// //           },
// //           {
// //             fact: 'kidney',
// //             operator: 'greaterThan',
// //             value: 14
// //           },
// //           {
// //             then: 'Dosing : 15 mg once daily with food'
// //           },
// //           {
// //             else: 'Avoiding use in patients '
// //           }
// //         ]
// //       }
// //     }
// //   }
// //     }
// //     // Default rule: If none of the other rules match, log a message
// //     RuleD = {
// //   priority: 10,
// //   conditions: {
// //     all: [
// //       {
// //         fact: 'alwaysTrue', // a fact that is always true
// //         operator: 'equal',
// //         value: true
// //       }
// //     ]
// //   },
// //   event: {
// //     type: 'log_message',
// //     params: { message: 'Dosing : 10-20 mg Once Daily' }
// //   }
// //     };
// //     engine.addRule(Rule1);
// //     engine.addRule(Rule2);
// //     engine.addRule(Rule3);
// //     engine.addRule(RuleD);
// //     break;

// //   default:
// //     break;
// // }
// //Etoricoxib
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'pregnancy', operator: 'equal', value: true },
//       { fact: 'lactation', operator: 'equal', value: true },
//       { fact: 'disease', operator: 'in', value:  db_disease_con},
//       { fact: 'age', operator: 'lessThan', value: 15 },
//       { fact: 'kidney', operator: 'lessThan', value: 30 }
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'sex', operator: 'equal', value: 'female' },
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//       { fact: 'kidney', operator: 'greaterThanInclusive', value: 30 }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: 'Used with caution'
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 3,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Dosing : 30-120 mg Once Daily' }
//   }
// };

// //Rivaroxaban
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_con},
//       { fact: 'age', operator: 'lessThan', value: 18 },
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau}
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: 'Used with caution'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     any: [
//       { fact: 'kidney', operator: 'notEqual', value: '' }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'greaterThan',
//             value: 50
//           },
//           {
//             then: 'No dosage adjustment necessary.'
//           },
//           {
//             fact: 'kidney',
//             operator: 'greaterThan',
//             value: 14
//           },
//           {
//             then: 'Dosing : 15 mg once daily with food'
//           },
//           {
//             else: 'Avoiding use in patients '
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Dosing : 10-20 mg Once Daily' }
//   }
// };


// //Atorvastatin
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'pregnancy', operator: 'equal', value: true },
//       { fact: 'lactation', operator: 'equal', value: true },
//       { fact: 'age', operator: 'lessThan', value: 10 },
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//       { fact: 'kidney', operator: 'equal', value:  'Dialysis'}
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: 'Due to the high protein binding, atorvastatin is not expected to be cleared by dialysis'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value: 20 }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: { message: 'Dosing : 10-20 mg Once Daily' }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Dosing : 10-80 mg Once Daily' }
//   }
// };


// //Ceftriaxone
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_con},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'disease',
//             operator: 'equal',
//             value: 'Gallbladder pseudolithiasis'
//           },
//           {
//             then: 'Use with caution : Abnormal gallbladder sonograms have been reported, possibly due to ceftriaxone-calcium precipitates'
//           },
//           {
//             fact: 'disease',
//             operator: 'equal',
//             value: 'Gastrointestinal disease'
//           },
//           {
//             then: 'Use with caution in patients with a history of GI disease, especially colitis'
//           }
//         ]
//       }
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'notEqual', value: '' }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'age',
//             operator: 'greaterThan',
//             value: 17
//           },
//           {
//             then: 'Dosing 1-2 g every 12-24 hr'
//           },
//           {
//             else: 'Dosing : 50 to 100 mg/kg/day in 1 to 2 divided doses every 12 to 24 hours (maximum: 2,000 mg daily)'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Dosing : 250/500/1000 mg' }
//   }
// };


// //Cetirizine
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  18},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'age',
//             operator: 'greaterThan',
//             value: 5
//           },
//           {
//             then: 'Dosing : 5 to 10 mg once daily'
//           },
//           {
//             fact: 'age',
//             operator: 'greaterThanInclusive',
//             value: 2
//           },
//           {
//             then: 'Dosing : Initial 2.5 mg once daily; may be increased to a maximum dose of 2.5 mg every 12 hours or 5 mg once daily'
//           }
//           ,
//           {
//             fact: 'age',
//             operator: 'greaterThanInclusive',
//             value: 1
//           },
//           {
//             then: 'Dosing : 2.5 mg once daily; may increase to a maximum dose of 2.5 mg every 12 hours if needed'
//           },
//           {
//             else: 'Dosing : 2.5 mg once daily'
//           }
//         ]
//       }
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'greaterThanInclusive', value:  18},
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: 'Dosing : 5 to 10 mg once daily'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'kidney', operator: 'notEqual', value: '' }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'greaterThan',
//             value: 50
//           },
//           {
//             then: 'Dosing : 5 to 10 mg once daily'
//           },
//           {
//             fact: 'kidney',
//             operator: 'lessThanInclusive',
//             value: 50
//           },
//           {
//             then: 'Dosing : 5 mg once daily'
//           },
//           {
//             fact: 'kidney',
//             operator: 'equal',
//             value: 'Intermittent hemodialysis'
//           },
//           {
//             then: 'Dosing : 5 mg once daily; 5 mg 3 times per week may also be effective.'
//           },
//           {
//             fact: 'kidney',
//             operator: 'equal',
//             value: 'Peritoneal dialysis'
//           },
//           {
//             then: 'Dosing : 5 mg once daily'
//           },
//           {
//             else: 'Dosing : 5 to 10 mg once daily'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'There are no dosage adjustments necessary.' }
//   }
// };



// //Clopidogrel
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//       { fact: 'pregnancy', operator: 'equal', value: true },
//       { fact: 'lactation', operator: 'equal', value: true },
//       { fact: 'age', operator: 'greaterThan', value:  17},
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'disease',
//             operator: 'in',
//             value: db_disease_cau
//           },
//           {
//             then: 'Use with caution'
//           },
//           {
//             fact: 'pregnancy',
//             operator: 'equal',
//             value: true
//           },
//           {
//             then: 'Use only when strictly needed and for the shortest duration possible'
//           },
//           {
//             fact: 'lactation',
//             operator: 'equal',
//             value: true
//           },
//           {
//             then: 'Should consider the risk of infant exposure, the benefits of breastfeeding to the infant, and benefits of treatment to the mother.'
//           },
//           {
//             else: 'Dosing : Loading 300-600 mg , Maintainance 75-150 mg'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Dosing : 75 mg' }
//   }
// };


// //Dulaglutide
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//       { fact: 'lactation', operator: 'equal', value:  true }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'lactation',
//             operator: 'equal',
//             value: true
//           },
//           {
//             then: 'Should consider the risk of infant exposure, the benefits of breastfeeding to the infant, and benefits of treatment to the mother'
//           },
//           {
//             else: 'Use with caution'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Dosing : 0.75 - 1.5 mg once weekly' }
//   }
// };


// //Esomeprazole
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'lactation', operator: 'equal', value:  true}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'Decision to continue or discontinue breastfeeding during therapy should take into account the risk of infant exposure, the benefits of breastfeeding to the infant, and benefits of treatment to the mother'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'notEqual', value:  ''}
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'age',
//             operator: 'lessThan',
//             value: 1
//           },
//           {
//             then: 'Dosing : 0.5 mg/kg once daily'
//           },
//           {
//             fact: 'age',
//             operator: 'lessThan',
//             value: 18
//           },
//           {
//             then: 'Dosing : weight < 55 kg: 10 mg once daily; weight ≥ 55 kg: 20 mg once daily'
//           },
//           {
//             else: 'Dosing : 20-40 mg once/twice daily (max 40mg/day)'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Dosing : 20/40 mg' }
//   }
// };


// //Fluconazole
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'pregnancy', operator: 'equal', value: true}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  18}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Loading dose: 6 to 12 mg/kg/dose; maintenance: 3 to 12 mg/kg/dose once daily'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'kidney', operator: 'notEqual', value:  ''}
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'greaterThan',
//             value: 50
//           },
//           {
//             then: 'For multiple dosing, loading dose of 50 to 400 mg daily'
//           },
//           {
//             else: 'For multiple dosing, loading dose of 50 to 400 mg, then adjust daily doses by 50%'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: { message: 'Injection : 400-800 mg Once daily (6-12 mg/kg); Oral 50-400 mg Once daily' }
//   }
// };


// //Fluoxetine
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_con},
//       { fact: 'lactation', operator: 'equal', value:  true},
//       { fact: 'age', operator: 'lessThan', value:  7}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//       { fact: 'pregnancy', operator: 'equal', value: true}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'disease',
//             operator: 'in',
//             value: db_disease_cau
//           },
//           {
//             then: 'Use with caution'
//           },
//           {
//             else: 'May require dose adjustments of fluoxetine to achieve euthymia'
//           }
//         ]
//       }
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  18}
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: 'Dosing : 10-60 mg once daily'
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log_message',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'equal',
//             value: 'Chronic administration'
//           },
//           {
//             then: 'Additional accumulation of fluoxetine or norfluoxetine may occur in patients with severely impaired renal function.'
//           },
//           {
//             fact: 'kidney',
//             operator: 'equal',
//             value: 'Not removed by hemodialysis'
//           },
//           {
//             then: 'Use of lower dose or less frequent dosing is not usually necessary.'
//           },
//           {
//             else: 'Dosing : 10 to 80 mg once daily'
//           }
//         ]
//       }
//     }
//   }
// };

// //Gabapentin
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  3}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  18}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'age',
//             operator: 'lessThan',
//             value: 5
//           },
//           {
//             then: 'Oral: Initial: 10 to 40 mg/kg/day in 3 divided doses'
//           },
//           {
//             fact: 'age',
//             operator: 'lessThan',
//             value: 12
//           },
//           {
//             then: 'Oral: Initial: 10 to 35 mg/kg/day in 3 divided doses'
//           },
//           {
//             else: 'Dosing : 100 to 3600 mg 1 to 3 times daily'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 15
//           },
//           {
//             then: 'Dosing Oral: Reduce daily dose in proportion to creatinine clearance based on dose for creatinine clearance of 15 mL/minute'
//           },
//           {
//             fact: 'kidney',
//             operator: 'equal',
//             value: 15
//           },
//           {
//             then: 'Dosing Oral: 100 to 300 mg once daily'
//           },
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 30
//           },
//           {
//             then: 'Dosing Oral: 200 to 700 mg once daily'
//           },
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 60
//           },
//           {
//             then: 'Dosing Oral: 200 to 700 mg twice daily'
//           },
//           {
//             fact: 'kidney',
//             operator: 'greaterThan',
//             value: 59
//           },
//           {
//             then: 'Dosing Oral: 300 to 1,200 mg 3 times daily'
//           },
//           {
//             fact: 'kidney',
//             operator: 'equal',
//             value: 'ESRD requiring hemodialysis'
//           },
//           {
//             then: 'Oral: Dose based on CrCl plus a single supplemental dose of 125 to 350 mg (given after each 4 hours of hemodialysis). '
//           },
//           {
//             else: 'Dosing : 100 to 3600 mg 1 to 3 times daily'
//           }
//         ]
//       }
//     }
//   }
// }


// //Hydroxyzine
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'pregnancy', operator: 'equal', value:  true},
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//       { fact: 'lactation', operator: 'equal', value:  true} 
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'lactation',
//             operator: 'equal',
//             value: true
//           },
//           {
//             then: 'Not recommended by the manufacturer'
//           },
//           {
//             else: 'Use with caution'
//           }
//         ]
//       }
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  18}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'age',
//             operator: 'lessThan',
//             value: 6
//           },
//           {
//             else: 'Dosing : 50 to 100 mg/day in divided doses'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 51
//           },
//           {
//             then: 'Administer 50% of normal dose.'
//           },
//           {
//             fact: 'kidney',
//             operator: 'in',
//             value: ['Continuous renal replacement therapy (CRRT)', 'Intermittent hemodialysis', 'Peritoneal dialysis']
//           },
//           {
//             then: 'Administer 50% of the normal dose.'
//           },
//           {
//             else: 'Dosing : 25 to 100 mg 3 to 4 times daily'
//           }
//         ]
//       }
//     }
//   }
// }



// //Hyoscine Butylbromide
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'age', operator: 'lessThan', value:  6},
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//       { fact: 'lactation', operator: 'equal', value:  true} 
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'lactation',
//             operator: 'equal',
//             value: true
//           },
//           {
//             then: 'Caution be used if scopolamine is administered to a nursing woman'
//           },
//           {
//             else: 'Use with caution'
//           }
//         ]
//       }
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  11}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Dosing : 10 mg/day'
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log',
//     params: {
//       message: 'Dosing : 10 mg 3 to 5 times/day; maximum: 60 mg/day'
//     }
//   }
// }



// //Imatinib
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'age', operator: 'lessThan', value:  1},
//       { fact: 'pregnancy', operator: 'equal', value: true },
//       { fact: 'lactation', operator: 'equal', value: true }
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     any: [
//       { fact: 'kidney', operator: 'lessThan', value:  60}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 20
//           },
//           {
//             then: 'Use caution; a dose of 100 mg daily has been tolerated in a limited number of patients with severe impairment '
//           },
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 40
//           },
//           {
//             then: 'Decrease recommended starting dose by 50%; dose may be increased as tolerated; maximum recommended dose: 400 mg.'
//           },
//           {
//             else: 'Maximum recommended dose: 600 mg.'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'age',
//             operator: 'lessThan',
//             value: 18
//           },
//           {
//             then: 'Dosing Oral: 340 mg/m2/day; maximum: 600 mg daily'
//           },
//           {
//             else: 'Dosing : 100 - 800 mg/day'
//           }
//         ]
//       }
//     }
//   }
// }


// //Cyproterone
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'age', operator: 'lessThan', value:  18},
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log',
//     params: {
//       message: 'Dosing : 50 - 600 mg'
//     }
//   }
// }



// //Isoniazid
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'age', operator: 'lessThan', value:  15}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'weight',
//             operator: 'lessThan',
//             value: 41
//           },
//           {
//             then: 'Dosing : 10 to 15 mg/kg/dose once daily; maximum dose: 300 mg/dose'
//           },
//           {
//             fact: 'weight',
//             operator: 'greaterThan',
//             value: 40
//           },
//           {
//             then: 'Dosing : 5 mg/kg/dose once daily (typical dose: 300 mg)'
//           },
//           {
//             else: 'Maximum dose: 300 mg/dose'
//           }
//         ]
//       }
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log',
//     params: {
//       message: 'Dosing : 5 mg/kg/dose (usual dose: 300 mg) once daily'
//     }
//   }
// }


// //Norfloxacin
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'age', operator: 'lessThan', value:  18},
//       { fact: 'pregnancy', operator: 'equal', value: true },
//       { fact: 'lactation', operator: 'equal', value: true },
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     any: [
//       { fact: 'kidney', operator: 'lessThan', value:  31}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Dosing : 400 mg once daily'
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log',
//     params: {
//       message: 'Dosing : 400-800 mg in 1-2 dose/day (max 800 mg)'
//     }
//   }
// }


// //Oseltamivir
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     any: [
//       { fact: 'age', operator: 'lessThan', value:  18}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'age',
//             operator: 'lessThan',
//             value: 1
//           },
//           {
//             then: 'Dosing : 3 mg/kg/dose twice daily'
//           },
//           {
//             fact: 'weight',
//             operator: 'lessThan',
//             value: 16
//           },
//           {
//             then: 'Dosing : 30 mg twice daily for 5 days'
//           },
//           {
//             fact: 'weight',
//             operator: 'lessThan',
//             value: 24
//           },
//           {
//             then: 'Dosing : 45 mg twice daily for 5 days'
//           },
//           {
//             fact: 'weight',
//             operator: 'lessThan',
//             value: 41
//           },
//           {
//             then: 'Dosing : 60 mg twice daily for 5 days'
//           },
//           {
//             else: 'Dosing : 75 mg twice daily for 5 days'
//           }
//         ]
//       }
//     }
//   }
// }
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 31
//           },
//           {
//             then: 'Dosing : 30 mg once daily'
//           },
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 61
//           },
//           {
//             then: 'Dosing : 30 mg twice daily'
//           },
//           {
//             else: 'Dosing : 75-150 mg twice daily'
//           }
//         ]
//       }
//     }
//   }
// }


// //Paracetamol
// Rule1 = {
//   priority: 1,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     any: [
//       { fact: 'age', operator: 'lessThan', value:  18}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Dosing : 10 to 15 mg/kg/dose every 4 to 6 hours (maximum daily dose: 75 mg/kg/day not to exceed 4 g/day)'
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log',
//     params: {
//       message: {
//         if: [
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 10
//           },
//           {
//             then: 'Administer every 8 hours.'
//           },
//           {
//             fact: 'kidney',
//             operator: 'lessThan',
//             value: 51
//           },
//           {
//             then: 'Administer every 6 hours.'
//           },
//           {
//             fact: 'kidney',
//             operator: 'equal',
//             value: 'CRRT'
//           },
//           {
//             then: 'Administer every 6 hours.'
//           },
//           {
//             else: 'Dosing : 500 mg every 4 to 6 hours; maximum daily dose: 3000 mg daily'
//           }
//         ]
//       }
//     }
//   }
// }



// //Oxycodone
// Rule1 = {
//   priority: 1,
//   conditions: {
//     any: [
//       { fact: 'age', operator: 'lessThan', value:  18},
//       { fact: 'pregnancy', operator: 'equal', value: true },
//       { fact: 'lactation', operator: 'equal', value: true },
//       { fact: 'disease', operator: 'in', value:  db_disease_con}
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'contraindicated',
//     params: {
//       message: 'contraindicated'
//     }
//   }
// }
// Rule2 = {
//   priority: 2,
//   conditions: {
//     all: [
//       { fact: 'disease', operator: 'in', value:  db_disease_cau},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Use with caution'
//     }
//   }
// }
// Rule3 = {
//   priority: 3,
//   conditions: {
//     all: [
//       { fact: 'kidney', operator: 'lessThan', value:  60},
//     ]
//   },
//   event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'caution',
//     params: {
//       message: 'Adjust 50% of normal dose'
//     }
//   }
// }
// // Default rule: If none of the other rules match, log a message
// RuleD = {
//   priority: 10,
//   conditions: {
//     all: [
//       {
//         fact: 'alwaysTrue', // a fact that is always true
//         operator: 'equal',
//         value: true
//       }
//     ]
//   },
//   event: {
//     type: 'log',
//     params: {
//       message: 'Dosing : 10-280 mg/day'
//     }
//   }
// }



//engine.addRule(Rule1);
//engine.addRule(Rule2);
//engine.addRule(Rule3);

/**
 * Define facts the engine will use to evaluate the conditions above.
 * Facts may also be loaded asynchronously at runtime; see the advanced example below
 */
// let facts = {
//   age: 30,
//   drugName: 'Etoricoxib',
//   sex: 'male',
//   pregnancy: false,
//   lactation: false,
//   disease: '',
//   kidney: 10,
//   alwaysTrue: true,
// }

/*
// Run the engine to evaluate
engine
  .run(facts)
  .then(({ events }) => {
    events.map(event => console.log(event.params.message))
  })
*/








/*
// Define the LTL formula string
const formulaString = 'G(age >= 18 -> F(drugName in ["Ibuprofen", "Paracetamol"]) -> (warning || instruction))';

// Define the function to evaluate the LTL formula for a given set of inputs
function evaluateFormula(age, drugName, warning, instruction) {
  // Check if the patient is at least 18 years old and is taking either Ibuprofen or Paracetamol
  const isDrugAppropriate = age >= 18 && (drugName === 'Ibuprofen' || drugName === 'Paracetamol');
  
  // Check if the warning or instruction message is present
  const isWarningOrInstructionPresent = warning || instruction;
  
  // Evaluate the LTL formula
  const isFormulaSatisfied = isDrugAppropriate ? isWarningOrInstructionPresent : true;
  
  return isFormulaSatisfied;
}




// Evaluate the LTL formula for a given set of inputs
const age = 20;
const drugName = 'Ibuprofen';
const warning = 'Take with food';
const instruction = '';
const isFormulaSatisfied = evaluateFormula(age, drugName, warning, instruction);


console.log(isFormulaSatisfied); // true
*/

const rules = [
  {
    id: 1,
    name: 'Etoricoxib',
    description: 'Contraindicated',
    method: "any",
    priority: 1,
  },
  {
    id: 2,
    name: 'Etoricoxib',
    description: "Used with caution",
    method: "any",
    priority: 2,
  },
  {
    id: 3,
    name: 'Etoricoxib',
    description: "Dosing : 30-120 mg Once Daily",
    method: "all",
    priority: 3,
  },
];

const ruleConditions = [
  {
    id: 1,
    rule_id: 1,
    fact: 'kidney',
    operator: 'greaterThanInclusive',
    value: 30,
  },
  {
    id: 2,
    rule_id: 1,
    fact: 'disease',
    operator: 'in',
    value: ['Asthma', 'Diabetes'],
  },
  {
    id: 3,
    rule_id: 1,
    fact: 'sex',
    operator: 'equal',
    value: 'female',
  },
  {
    id: 4,
    rule_id: 2,
    fact: 'alwaysTrue',
    operator: 'equal',
    value: true,
  },
  {
    id: 5,
    rule_id: 3,
    fact: 'pregnancy',
    operator: 'equal',
    value: true,
  },
  {
    id: 6,
    rule_id: 3,
    fact: 'lactation',
    operator: 'equal',
    value: true,
  },
  {
    id: 7,
    rule_id: 3,
    fact: 'disease',
    operator: 'in',
    value: ['Heart failure', 'Ischemic heart disease', 'Peripheral artery disease', 'Cerebrovascular disease'],
  },
  {
    id: 8,
    rule_id: 3,
    fact: 'age',
    operator: 'lessThan',
    value: 15,
  },
  {
    id: 9,
    rule_id: 3,
    fact: 'kidney',
    operator: 'lessThan',
    value: 30,
  },
];




// async function createRuleEngine() {
//   const engine = new Engine();
//   for (const rule of rules) {
//     const conditions = ruleConditions.filter(c => c.rule_id === rule.id);
//     var ruleJson;
//     //const actions = ruleActions.filter(a => a.rule_id === rule.id);
//     if(rule.method == 'any'){
//       console.log(rule.id+" : any ; "+rule.method);
//        ruleJson = {
//         event: {
//           type: 'rule-event',
//           params: {
//             ruleId: rule.id,
//             message: rule.description
//           }
//         },
//   conditions: {
//     all: conditions.map(condition => ({
//       fact: condition.fact,
//       operator: condition.operator,
//       value: condition.value
//     }))
//   },
//   priority : rule.priority
// };
//     }else{
//       console.log(rule.id+" : all ; "+rule.method);
//        ruleJson = {
//         event: {
//           type: 'rule-event',
//           params: {
//             ruleId: rule.id,
//             message: rule.description
//           }
//         },
//   conditions: {
//     all: conditions.map(condition => ({
//       fact: condition.fact,
//       operator: condition.operator,
//       value: condition.value
//     }))
//   },
//   priority : rule.priority
// };
//     }
    
//     //console.log(`Adding rule ${rule.id}: ${JSON.stringify(ruleJson)}`);
//     engine.addRule(ruleJson);
//   }
//   return engine;
// }

// async function createRuleEngine(dname) {
//   //const engine = new Engine();
//   const engine = new Engine(undefined, { ignoreFactChanges: true });

//   const rules = await client.query("SELECT * FROM rules WHERE name = '" + dname + "'");
//   const ruleCon = await client.query('SELECT * FROM rule_conditions WHERE rule_id = 1');
//   const ruleConditions = ruleCon.rows;
//   console.log(ruleConditions);
//   for (const rule of rules.rows) {
//     const conditions = ruleConditions.filter(c => c.rule_id === rule.rid);
//     const priority = rule.priority;
//     console.log(`Adding rule: ${JSON.stringify(conditions)}`)
//     var ruleJson;
//     if(rule.method == 'any'){
//       //console.log(rule.rid+" : any ; "+rule.method);
//       ruleJson = {
//         event: {
//           type: 'rule-event',
//           params: {
//             ruleId: rule.id,
//             message: rule.description
//           }
//         },
//         conditions: {
//           any: conditions.map(condition => ({
//             fact: condition.fact,
//             operator: condition.operator,
//             value: condition.value
//           }))
//         },
//         priority : priority
//       };
//     }else{
//       //console.log(rule.rid+" : all ; "+rule.method);
//       ruleJson = {
//         event: {
//           type: 'rule-event',
//           params: {
//             ruleId: rule.rid,
//             message: rule.description
//           }
//         },
//         conditions: {
//           all: conditions.map(condition => ({
//             fact: condition.fact,
//             operator: condition.operator,
//             value: condition.value
//           }))
//         },
//         priority : priority
//       };
      
//     }
//     //console.log(ruleJson);
//     engine.addRule(ruleJson);
//   }
  
//   return engine;
// }

async function createRuleEngine(dname,factS) {
  const engine = new Engine(undefined, { ignoreFactChanges: true });

  const rules = await client.query("SELECT * FROM rules WHERE name = '" + dname + "'");
  if (rules.rows.length === 0) {
    //console.log("No information");
    return("No information");
  }
  const ruleCon = await client.query('SELECT * FROM rule_conditions');
  const ruleConditions = ruleCon.rows;
  const sortedRules = rules.rows.sort((a, b) => a.priority - b.priority);
  //console.log(`sort rule: ${JSON.stringify(sortedRules)}`);
  //console.log("test : "+factS.pregnancy);
  const executeRule = async (rule, facts) => {
  //const executeRule = async (rule, fact) => {
    const conditions = ruleConditions.filter(c => c.rule_id === rule.rid);
    //console.log("con : "+conditions);
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
            //fact: facts[condition.fact],
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
            //fact: facts[condition.fact],
            operator: condition.operator,
            value: condition.value
          }))
        }
      };
    }
    
    //console.log("ruleJson : "+ruleJson);
    engine.addRule(ruleJson);
    //console.log("ruleJson : "+ruleJson);
    //console.log(`disease rule : `+ factS.disease);
    const result = await engine.run(factS);
    //console.log("result : "+result);
    //const result = await engine.run({ ...facts, [fact]: true });
    if (result.events.length > 0) {
      const event = result.events[0];
      //console.log(event.params.message);
      //return true;
      return event.params.message;
    } else {
      engine.removeRule(ruleJson);
      return false;
    }
  };


  // Separate the disease array into two facts
  //const diseases = ['Heart failure','Diabetes'];
  if (factS.disease.length === 0) {
    //let diseaseFacts = { ...facts, disease };
    for (const rule of sortedRules) {
      //console.log(`Checking rule ${rule.rid}: ${rule.name}`);
      // if (await executeRule(rule, diseaseFacts)) {
      //   return;
      // }
      const message = await executeRule(rule, factS.disease);
      if (message) {
        //console.log("2480 : "+ message);
        return message;
      }
    }
  }else{
    for (const disease of factS.disease) {
      let diseaseFacts = { ...factS, disease };
      for (const rule of sortedRules) {
        //console.log(`Checking rule ${rule.rid}: ${rule.name}`);
        // if (await executeRule(rule, diseaseFacts)) {
        //   return;
        // }
        const message = await executeRule(rule, diseaseFacts);
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
  //console.log(`Adding rule: ${JSON.stringify(engine)}`);
  //const facts = { age: 15, name: 'Alice' };
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
  //console.log(`Running rules engine with facts: ${JSON.stringify(facts)}`);
  const results = await engine.run(facts).then(({ events }) => {
    events.map(event => console.log(event.params.message))
  })
  //  // Sort rules by priority
  //  rules.sort((a, b) => b.priority - a.priority);
  
  //  // Iterate over rules in priority order until a match is found
  //  for (let rule of rules) {
  //    const result = rule.condition.evaluate(facts);
  //    if (result) {
  //      const event = rule.event;
  //      console.log(event.params.message);
  //      break;
  //    }
  //  }

  
  
  
}


//runEngine("Etoricoxib");
//createRuleEngine("Etoricoxib");


app.post('/api/drugdisease', async (req, res)=>{
  let fact = {
    age: req.body.age,
    sex: req.body.sex,
    pregnancy: req.body.pregnancy.toString(), 
    lactation: req.body.lactation.toString(),
    kidney: req.body.kidney,
    disease: req.body.disease,
    weight: req.body.weight,
    alwaysTrue: true.toString(),
  }
  //console.log(fact);
  const output = await createRuleEngine(req.body.dname,fact);
  //const output =  createRuleEngine(req.body.dname,fact); 
  // output.then((message) => {
  //   console.log(`Rule engine executed successfully with message: ${message}`);
  //   res.send(output);
  // }).catch((error) => {
  //   console.log(`Error executing rule engine: ${error}`);
  // });
  //console.log(output);
  res.send(output);
  // const query = "Select * from d_suggest WHERE dname = '" + req.body.dname + "' " ;
//   client.query(query, (err, result)=>{
//     if(!err){
//       let output ='';
      

        



        
//         res.send(out);



//     } else{
//       console.log(`DB error2`);
//       console.log(err);
//       return;
//     }
// });
  //client.end;
})










//close connection with database
process.on('SIGINT', () => {
  client.end(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});