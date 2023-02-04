import fetch from 'node-fetch';
import https from 'https';
import dotenv from "dotenv";
dotenv.config()

function mainFunction() {
  fetch(process.env.FOLEY_PREP_INTERVIEW_URL,
    { agent: new https.Agent({ rejectUnauthorized: false }) })
    .then(res => res.json())
    .then(json => {
      const studentAnswers = json.users;
      const testAnswers = json.tests;
      const finalGradeResults = []
      if (testAnswers[0].name === "SAT") { gradingFunction(testAnswers[0], studentAnswers, finalGradeResults) }
      if (testAnswers[1].name === "ACT") { gradingFunction(testAnswers[1], studentAnswers, finalGradeResults) }
      console.log(finalGradeResults)
      return finalGradeResults
    })
    .catch((err) => console.log(err))
}

function gradingFunction(testType, studentAnswers, finalGradeResults) {
  studentAnswers.forEach(singleStudent => {
    if (singleStudent.test === testType.name) {
      let studentCorrectAnswers = [];
      for (let i = 0; i < singleStudent.responses.length; i++) {
        if (singleStudent.responses[i] === testType.answers[i]) {
          studentCorrectAnswers.push(true)
        }
      }
      finalGradeResults.push({
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