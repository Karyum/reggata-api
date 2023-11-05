import { Req, Res } from '@/types'
import catchAsync from '@/utils/catchAsync'
import patientsService from './patients.services'

const addPatient = catchAsync(async (req: Req, res: Res) => {
  const { name, age, phone, maritalStatus, intake, notes, gender, id } =
    req.body

  const patient: any = await patientsService.addPatient({
    name,
    age,
    phone,
    maritalStatus,
    intake,
    gender,
    id
  })

  if (notes && !id) {
    // add the note of the patient to db
    await patientsService.addPatientNotes(patient.id, notes)
  }

  res.send({
    success: true,
    message: 'מטופל נוסף בהצלחה',
    patient
  })
})

const getPatient = catchAsync(async (req: Req, res: Res) => {
  const { id } = req.params

  const patient = await patientsService.getPatient(id)

  res.send({
    success: true,
    patient
  })
})

const getPatients = catchAsync(async (req: Req, res: Res) => {
  const patients = await patientsService.getPatients()

  res.send(patients)
})

const addSession = catchAsync(async (req: Req, res: Res) => {
  const { patientId, time, date, description, type } = req.body

  const session = await patientsService.addSession({
    patientId,
    time,
    date,
    type,
    description
  })

  res.send({
    success: true,
    session
  })
})

const fetchSessions = catchAsync(async (req: Req, res: Res) => {
  const { startDate, endDate } = req.body

  const sessions = await patientsService.fetchSessions(startDate, endDate)

  res.send({
    success: true,
    sessions
  })
})

const addUserToPatient = catchAsync(async (req: Req, res: Res) => {
  const { patientId, name, username, password } = req.body

  const patient = await patientsService.addUserToPatient({
    patientId,
    name,
    username,
    password
  })

  res.send({
    success: true,
    patient
  })
})

const revokeAccess = catchAsync(async (req: Req, res: Res) => {
  const { patientId } = req.body

  await patientsService.revokeAccess(patientId)

  res.send({
    success: true
  })
})

const enactAccess = catchAsync(async (req: Req, res: Res) => {
  const { patientId } = req.body

  await patientsService.enactAccess(patientId)

  res.send({
    success: true
  })
})

const updateSession = catchAsync(async (req: Req, res: Res) => {
  const { patientId, time, date, description, type, sessionId } = req.body

  const session = await patientsService.updateSession({
    patientId,
    time,
    date,
    type,
    description,
    sessionId
  })

  res.send({
    success: true,
    session
  })
})

const deleteSession = catchAsync(async (req: Req, res: Res) => {
  const { sessionId } = req.params

  await patientsService.deleteSession(+sessionId)

  res.send({
    success: true
  })
})

const addNote = catchAsync(async (req: Req, res: Res) => {
  const { patientId, note } = req.body

  await patientsService.addPatientNotes(patientId, note)

  res.send({
    success: true
  })
})

const getSurveyResults = catchAsync(async (req: Req, res: Res) => {
  const { patientId, surveyName } = req.params

  const results = await patientsService.getSurveyResults(+patientId, surveyName)

  res.send({
    success: true,
    results
  })
})

export default {
  addPatient,
  getPatient,
  getPatients,
  addSession,
  fetchSessions,
  addUserToPatient,
  revokeAccess,
  enactAccess,
  updateSession,
  deleteSession,
  addNote,
  getSurveyResults
}
