import { Req, Res } from '@/types'
import catchAsync from '@/utils/catchAsync'
import generalService from './general.services'

const testSocket = catchAsync(async (req: Req, res: Res) => {
  res.send({ a: 'test' })
})

export default {
  testSocket
}
