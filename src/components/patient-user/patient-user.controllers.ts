import { Req, Res } from '@/types'
import catchAsync from '@/utils/catchAsync'
import patientUserService from './patient-user.services'

const saveSituationDiary = catchAsync(async (req: Req, res: Res) => {
  const { behavior, feelings, physicalSymptoms, situation, thoughts } = req.body
  const { patientId } = req.session.user

  await patientUserService.saveSituationDiary({
    behavior,
    feelings,
    physicalSymptoms,
    situation,
    thoughts,
    patientId
  })

  res.send({
    success: true,
    message: 'Saved 🌻'
  })
})

const saveAnxietySurvey = catchAsync(async (req: Req, res: Res) => {
  const { answers, score } = req.body
  const { patientId } = req.session.user

  await patientUserService.saveAnxietySurvey({
    patientId,
    answers,
    score,
    surveyName: 'anxiety-survey'
  })

  res.send({
    success: true,
    message: 'Saved 🌻'
  })
})

export default {
  saveSituationDiary,
  saveAnxietySurvey
}
