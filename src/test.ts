import { ref,reactive } from "vue";
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { UserModule } from "./stores/user";
import router from "./router";

const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
    username: '',
    password: ''
})
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the username'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    callback()
  }
}

const loginRules = reactive<FormRules<typeof loginForm>>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
})

let loading = false

function handleLogin(formEl: FormInstance | undefined) {
    if(!formEl) return 
    formEl.validate(async (valid:boolean)=>{
        if(valid){
            loading = true
            await UserModule.Login(loginForm)
            .then((res:any)=>{
              if(String(res.code) === '1'){
                //成功跳转进入主页
                router.push('/')
              }else{
                //失败
                ElMessage.error(res.msg)
                // loading = false
              }
            })
            .catch(()=>{
              ElMessage.error('用户名或密码错误！')
              // loading = false
            })
        }
    })
    
}