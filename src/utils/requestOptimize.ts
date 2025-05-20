import md5 from 'md5'
const getRequestKey = (config:any) => {
    if(!config){
        return md5(''+new Date());
    }
    const data = typeof config.data === 'string' ? config.data : JSON.stringify(config.data)
    return md5(config.url + '&' + config.method + '&' + data)
}

//存储key值 目的是为了防止重复请求
const pending = new Map<string, boolean>()
//检查key值
const checkPending = (key: string) => pending.has(key)
//删除key值
const removePending = (key: string) => pending.delete(key)
// 设置 pending 状态
const setPending = (key: string) => pending.set(key, true)

export{
    getRequestKey,
    checkPending,
    removePending,
    setPending
}