<script setup lang="ts">
import { ref,reactive } from "vue";
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { UserModule } from "../../stores/user";
import router from "../../router";

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

</script>

<template>
    <div class="login">
        <div class="login-box">
            <img src="../../assets/login/login-l.png" alt="">
            <div class="login-form">
                <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="loginRules" label-width="auto" style="max-width: 600px">
                    <el-form-item label="Username" prop="username">
                        <el-input v-model="loginForm.username" 
                            clearable />
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                        <el-input v-model="loginForm.password"
                            type="password"
                            autocomplete="off"
                            show-password
                            clearable/>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" type="primary" @click="handleLogin(loginFormRef)">
                          <span v-if="!loading">login</span>
                          <span v-else>logining...</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>

</template>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background: #476dbe;
  background-color: #333;
}
.login-box {
  width: 1000px;
  height: 474.38px;
  border-radius: 8px;
  display: flex;
  img {
    width: 60%;
    height: auto;
  }
}
.login-form {
  background: #ffffff;
  width: 40%;
  border-radius: 0px 8px 8px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>