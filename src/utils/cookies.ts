import Cookies from 'js-cookie';
// User
const storeId = 'storeId'
export const getStoreId = ()=>Cookies.get(storeId)
export const setStoreId = (id:string)=>Cookies.set(storeId, id)
export const removeStoreId = ()=>Cookies.remove(storeId)

//User
const tokenKey = 'token'
export const getToken = ()=> Cookies.get(tokenKey)
export const setToken = (token:string)=> Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey);