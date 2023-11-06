import db from '@db'

const saveSituationDiary = async ({
  behavior,
  feelings,
  physicalSymptoms,
  situation,
  thoughts,
  patientId
}: any) => {
  await db('patients_situation_diary').insert({
    behavior,
    feelings,
    physicalSymptoms: physicalSymptoms,
    situation,
    thoughts,
    patient_id: patientId
  })

  return true
}

const saveSurvey = async ({ patientId, answers, score, surveyName }: any) => {
  await db('patients_surveys').insert({
    patient_id: patientId,
    answers: JSON.stringify(answers),
    score,
    survey_name: surveyName
  })

  return true
}

export default {
  saveSituationDiary,
  saveSurvey
}
