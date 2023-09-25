import db from '@db'

interface IPatient {
  name: string
  age: number
  phone: string
  maritalStatus: string
  intake: any // for now
  gender: string
  id?: number
}

const addPatient = async (data: IPatient) => {
  const { name, age, phone, maritalStatus, gender, intake, id } = data

  if (id) {
    // update the patient
    const patient = await db('patients')
      .where({ id })
      .update({
        name,
        age,
        phone,
        maritalStatus,
        gender,
        intakeForm: JSON.stringify(intake)
      })
      .returning('*')

    return patient[0]
  }

  const patient = await db('patients')
    .insert({
      name,
      age,
      phone,
      maritalStatus,
      gender,
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

const getPatients = async () => {
  const patientsRaw = await db('patients')
    .columns({
      id: 'patients.id',
      name: 'patients.name',
      age: 'patients.age',
      phone: 'patients.phone',
      intakeForm: 'intakeForm'
    })
    .select()
    .orderBy('id', 'desc')

  const patients = patientsRaw.map((patient: any) => ({
    ...patient,
    problem: patient.intakeForm?.problem || ''
  }))

  return patients
}

const addSession = async (data: any) => {
  const { patientId, time, date, description, type } = data

  const session = await db('patients_sessions')
    .insert({
      patient_id: patientId,
      time,
      date,
      type,
      description
    })
    .returning('*')

  return session[0]
}

const fetchSessions = async (startDate: string, endDate: string) => {
  const sessions = await db('patients_sessions')
    .whereBetween('date', [startDate, endDate])
    .join('patients', 'patients.id', '=', 'patients_sessions.patient_id')
    .columns({
      date: 'patients_sessions.date',
      description: 'patients_sessions.description',
      name: 'patients.name',
      patientId: 'patients.id',
      time: 'patients_sessions.time',
      type: 'patients_sessions.type'
    })
    .select()

  return sessions
}

export default {
  addPatient,
  addPatientNotes,
  getPatient,
  getPatients,
  addSession,
  fetchSessions
}
