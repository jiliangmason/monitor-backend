import { merge } from 'lodash'
import moment from 'moment'
const postfix = moment().format('YYYY-MM-DD');

const indexConfig = {
    es: {
        index: `record_${postfix}`,
        alias: 'record_alias',
    }
}

const config = merge(indexConfig, require(`./${process.env.NODE_ENV || 'development'}`).default || {})

export default config