//interaction
let a = "DB00316";
let b = "DB00682";
let interaction = [a,b];
let interaction2 = [b,a];
let dose  = 2000;
let dose_a = 4000;
let state = -1;
//suggestion
//patient

//rule
let strength = [30,60,90,120];
let dose_age = 16; // min
let gender = "women"; // caution
let prenancy = true; // contraindicated
let Contraindicate_disease = ["NYHA class II-IV congestive heart failure" , "ischemic heart disease", "peripheral artery disease", "cerebrovascular disease" , "undergone coronary artery bypass graft [CABG] surgery or angioplasty"];
let precaution_diasease = ["Aseptic meningitis", "Asthma", "Coronary artery bypass graft surgery", "Diabetes"];
//kidney function
//"CrCl ≥30 mL/minute: No dosage adjustment necessary; use with caution.
//CrCl <30 mL/minute: Use is contraindicated."
//hepatic
//"Mild hepatic impairment (Child-Pugh class A): Do not exceed 60 mg once daily; use with caution.
//Moderate hepatic impairment (Child-Pugh class B): Do not exceed 30 mg once daily or 60 mg every other day; use with caution.
//Severe hepatic impairment (Child-Pugh class C): Use is contraindicated."


//temporal operator
// - next
// - sometime
// - always
// - until
// - Forever
// - Eventually
// - weaK A until B




//fuunction
function test(){
    if(a == interaction[0] && b == interaction[1] && dose < dose_a){
        console.log("safe");
    }else if(a == interaction[0] && b == interaction[1]){
        console.log("interaction");
    }
}

function suggestion(){


}



//test();
//console.log("finish");

//G(display_message -> F (time >= 5 seconds -> fade_out_message))
const { Engine } = require('json-rules-engine')
let engine = new Engine()
const con1 = {
    conditions: {
      all: [{
        fact: "drug1",
        operator: 'equal',
        value: interaction[0]
      }, {
        fact: "drug2",
        operator: 'equal',
        value: interaction[1]
      }]
    },
    event: { type: 'con1' },
    priority: 10, // IMPORTANT!  Set a higher priority for the drinkRule, so it runs first
    onSuccess: async function (event, almanac) {
      almanac.addRuntimeFact('time1', true)
      console.log("successs");

      // asychronous operations can be performed within callbacks
      // engine execution will not proceed until the returned promises is resolved
      //const accountId = await almanac.factValue('accountId')
      //const accountInfo = await getAccountInformation(accountId)
      //almanac.addRuntimeFact('accountInfo', accountInfo)
    },
    onFailure: function (event, almanac) {
      almanac.addRuntimeFact('time1', false)
      console.log("fail");
    }
  }
  engine.addRule(con1);

  let facts = { drug1: a,drug2: b};
  engine.run(facts).then(()=>{console.log("end")});
  
