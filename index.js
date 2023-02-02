import fetch from 'node-fetch';
import dotenv from "dotenv";
import https from 'https';
dotenv.config();

async function mainFunction() {
  await fetch(process.env.FOLEY_PREP_INTERVIEW_URL,
    { agent: new https.Agent({ rejectUnauthorized: false }) })
    .then(res => res.json())
    .then(json => {
      let studentAnswers = json.users;
      let testAnswers = json.tests;
      let finalResult = []
      if (testAnswers[0].name === "SAT") { gradingFunction(testAnswers[0], studentAnswers, finalResult) }
      if (testAnswers[1].name === "ACT") { gradingFunction(testAnswers[1], studentAnswers, finalResult) }
      console.log(finalResult)
      return finalResult
    })
}

function gradingFunction(testType, studentAnswers, finalResult) {
  studentAnswers.forEach(singleStudent => {
    if (singleStudent.test === testType.name) {
      let studentCorrectAnswers = [];
      for (let i = 0; i < singleStudent.responses.length; i++) {
        if (singleStudent.responses[i] === testType.answers[i]) {
          studentCorrectAnswers.push(true)
        }
      }
      finalResult.push({
        name: singleStudent.name,
        grade: `${gradingMethod(studentCorrectAnswers)}%`
      })
    }
  })
  function gradingMethod(studentCorrectAnswers) {
    return (studentCorrectAnswers.length / testType.answers.length) * 100
  }
}

mainFunction()