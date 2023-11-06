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

const saveSurvey = catchAsync(async (req: Req, res: Res) => {
  const { answers, score, surveyName } = req.body
  const { patientId } = req.session.user

  await patientUserService.saveSurvey({
    patientId,
    answers,
    score,
    surveyName
  })

  res.send({
    success: true,
    message: 'Saved 🌻'
  })
})

export default {
  saveSituationDiary,
  saveSurvey
}
