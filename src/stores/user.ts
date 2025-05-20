import { defineStore } from "pinia"
import { getStoreId, getToken, removeToken, setToken } from "../utils/cookies"
import Cookies from "js-cookie"
import { login, userLogout } from "../api/employee"
import { ElMessage } from "element-plus"

export interface IUserState{
    token: string
    name: string
    avatar: string
    storeId: string
    introduction: string
    userInfo: any
    roles: string[]
    username: string
}

export interface IUserInfo{
    username:string
    password:string
}

const user = defineStore('user',{
    state: ():IUserState => ({
        token: getToken()||'',
        name: '',
        avatar: '',
        storeId: getStoreId() || '',
        introduction: '',
        userInfo: {},
        roles: [],
        username: Cookies.get('username') || ''
    }),

    actions:{
        async Login(userInfo:IUserInfo){
            this.username = userInfo.username.trim()
            Cookies.set('username', userInfo.username)
            const {data} = await login(userInfo)
            if(String(data.code) === '1'){
                this.token = data.data.token
                setToken(data.data.token)
                this.userInfo = data.data
                Cookies.set('user_info', data.data)
                return data
            }else{
                return ElMessage.error(data.msg)
            }
        },
        async Logout(){
            await userLogout({})
            removeToken()
            this.token = ''
            this.roles = []
            Cookies.remove('username')
            Cookies.remove('user_info')
        }
    }

})

export const UserModule = user()