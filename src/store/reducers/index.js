import {combineReducers} from 'redux'
import user from './user'
import common from './common'
import interview from './interview'
import permission from './permission'


const reducer = combineReducers({
    user,
    common,
    interview,
    permission
})

export default reducer;