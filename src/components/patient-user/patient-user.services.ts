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

export default {
  saveSituationDiary
}
