import {createStore,applyMiddleware} from 'redux'

import thunk from 'redux-thunk'

import reducer from './reducers'


const enhancer = applyMiddleware(thunk)


const store = createStore(reducer,enhancer);// 等效于createStore(reducer,undefined,enhancer)



export default store;