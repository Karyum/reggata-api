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

export default {
  addPatient,
  getPatient,
  getPatients
}
