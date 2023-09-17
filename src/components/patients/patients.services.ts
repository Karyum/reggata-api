import db from '@db'

interface IPatient {
  name: string
  age: number
  phone: string
  maritalStatus: string
  intake: any // for now
}

const addPatient = async (data: IPatient) => {
  const { name, age, phone, maritalStatus, intake } = data

  const patient = await db('patients')
    .insert({
      name,
      age,
      phone,
      maritalStatus,
      intakeForm: JSON.stringify(intake)
    })
    .returning('*')

  return patient[0]
}

const addPatientNotes = async (patientId: number, notes: string) => {
  await db('patient_notes').insert({
    patientId,
    note: notes
  })
}

const getPatient = async (id: string) => {
  const patient = await db('patients').where({ id }).first()

  // get the notes of the patient
  const notes = await db('patient_notes').where({ patientId: id })

  patient.notes = notes

  return patient
}

export default {
  addPatient,
  addPatientNotes,
  getPatient
}
