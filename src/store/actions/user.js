import request from '@/utils/request'

export const CURRENT_USER_LOGOUT = 'CURRENT_USER_LOGOUT_SYNC'

// 一个用户创建{type:'login'}的函数
export function test(data){
    return {
        type:CURRENT_USER_LOGOUT,
        payload:data
    }
}
export function login(data){
    return {
        type:'login',
        payload:data
    }
}
export function logout(data){
    return {
        type:'logout'
    }
}

// 异步操作：redux-thunk中间件（支持函数action）
export function loginAsync(values){
    const {username,password} = values
    return async function(dispatch){
        const {data} = await request.post(`/user/login?username=${username}&password=${password}`)
        // 登录成功后，修改redux数据
        dispatch(login(data.data))

        return data;
    }
}

export default {
    login,
    logout,
    loginAsync
}