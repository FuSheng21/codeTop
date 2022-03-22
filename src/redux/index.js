import {createStore} from 'redux'

let userInfo = localStorage.getItem('userInfo');
try{
    userInfo = JSON.parse(userInfo) || {}
}catch(err){
    userInfo = {}
}
const state = {
    userInfo,
}

// 接收state与action作为参数
// 必须返回一个新的state
const reducer = function(state,action){
    switch(action.type){
        case 'login':
            localStorage.setItem('userInfo',JSON.stringify(action.payload));
            return {
                ...state,
                userInfo:action.payload
            }
        case 'logout':
            localStorage.removeItem('userInfo')
            return {
                ...state,
                userInfo:{}
            }
    }
    return state;
}

const store = createStore(reducer,state)




export default store;