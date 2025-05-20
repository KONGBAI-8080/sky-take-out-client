import request from '../utils/request'

//登录请求
export const login = (data:any) => {
    return request({
        url:'/employee/login',
        method:'post',
        data
    })
}

//退出请求
export const userLogout = (params:any)=>{
    return request({
        url:'/employee/logout',
        method:'post',
        params
    })
}