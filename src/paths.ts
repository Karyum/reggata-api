import 'module-alias/register'
import { addAliases } from 'module-alias'

addAliases({
  '@': `${__dirname}`,
  '@db': `${__dirname}/database`,
  '@lpadDB': `${__dirname}/database/lpadDb`,
  '@/utils': `${__dirname}/utils`,
  '@/locales': `${__dirname}/locales`
})
