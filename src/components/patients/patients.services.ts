import db from '@db'
import bcrypt from 'bcrypt'

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

  const patientUser = await db('users').where({ patient_id: id }).first()

  patient.notes = notes
  patient.user = {
    name: patientUser?.name,
    email: patientUser?.email,
    userId: patientUser?.id,
    hasAccess: patientUser?.access
  }

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

const updateSession = async (data: any) => {
  const { patientId, time, date, description, type, sessionId } = data

  const session = await db('patients_sessions')
    .where({ id: sessionId })
    .update({
      patient_id: patientId,
      time,
      date,
      type,
      description
    })
    .returning('*')

  return session[0]
}

const deleteSession = async (sessionId: number) => {
  await db('patients_sessions').where({ id: sessionId }).del()

  return true
}

const fetchSessions = async (startDate: string, endDate: string) => {
  const sessions = await db('patients_sessions')
    .whereBetween('date', [startDate, endDate])
    .leftJoin('patients', 'patients.id', '=', 'patients_sessions.patient_id')
    .columns({
      id: 'patients_sessions.id',
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

const addUserToPatient = async ({
  patientId,
  name,
  username,
  password
}: {
  patientId: number
  name: string
  username: string
  password: string
}) => {
  // first check that the patient_id does not already exist in the users table
  // or that the username does not already exist
  const patient = await db('users')
    .where({ patient_id: patientId })
    .orWhere({ email: username })
    .first()

  if (patient) {
    // if yes allow access
    await db('users').where({ patient_id: patientId }).update({
      access: true
    })

    return true
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // add the patient to the users table
  await db('users').insert({
    name,
    email: username,
    password: hashedPassword,
    patient_id: patientId
  })

  return true
}

const revokeAccess = async (patientId: number) => {
  await db('users').where({ patient_id: patientId }).update({
    access: false
  })

  return true
}

const enactAccess = async (patientId: number) => {
  await db('users').where({ patient_id: patientId }).update({
    access: true
  })

  return true
}

export default {
  addPatient,
  addPatientNotes,
  getPatient,
  getPatients,
  addSession,
  fetchSessions,
  addUserToPatient,
  revokeAccess,
  enactAccess,
  updateSession,
  deleteSession
}
