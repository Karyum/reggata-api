import { Req, Res } from '@/types'
import catchAsync from '@/utils/catchAsync'
import patientsService from './patients.services'

const addPatient = catchAsync(async (req: Req, res: Res) => {
  const { name, age, phone, maritalStatus, intake, notes } = req.body

  const patient: any = await patientsService.addPatient({
    name,
    age,
    phone,
    maritalStatus,
    intake
  })

  if (notes) {
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

export default {
  addPatient,
  getPatient
}
