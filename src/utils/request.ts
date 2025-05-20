import axios from "axios";
import { UserModule } from "../stores/user";
import { checkPending, getRequestKey, removePending, setPending } from "./requestOptimize";
import router from "../router";

//取消请求的token
const CancelToken = axios.CancelToken

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 600000
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log(config, 'config')
    //添加token
    const token = UserModule.token
    if(token){
        config.headers['token'] = token
    }
    //处理get请求
    if(config.method === 'get' && config.params){
        let url = config.url + '?'
        for(const propName of Object.keys(config.params)){
            const value = config.params[propName]
            var part = encodeURIComponent(propName) + '=';
            if(value !== null && typeof (value) !== 'undefined'){
                if(typeof value === 'object'){
                    for(const key of Object.keys(value)){
                        let params = propName + '[' + key + ']'
                        var subpart = encodeURIComponent(params) + '='
                        url += subpart + encodeURIComponent(value[key]) + '&'
                    }
                }else{
                    url += part + encodeURIComponent(value) + '&'
                }
            }
        }
        url = url.slice(0, -1)
        config.params = {}
        config.url = url
    }
    //处理post请求
    const key = getRequestKey(config);
    //是否重复发起
    if(checkPending(key)){
        //重复则取消当前请求
        const source = CancelToken.source()
        config.cancelToken = source.token
        source.cancel('重复请求')
    }else{
        setPending(key)
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    //把请求响应中的config的url带上的代理api去掉
    response.config.url = response.config.url?.replace('/api','')
    //请求完成，删除请求中状态
    const key = getRequestKey(response.config)
    removePending(key)
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if(error && error.response){
        switch(error.response.status){
            case 401:
                router.push('/login')
                break
            case 405:
                error.message = '请求错误'
        }
    }
    //把请求响应中的config的url带上的代理api去掉
    error.config.url = error.config.url?.replace('/api','')
    //请求完成，删除请求中状态
    const key = getRequestKey(error.config)
    removePending(key)
    return Promise.reject(error);
  });

  export default service