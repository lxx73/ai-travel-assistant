<template>
  <div class="register-page">
    <!-- 左侧背景区域 -->
    <div class="register-bg">
      <div class="bg-content">
        <h1 class="bg-title">AI旅游定制助手</h1>
        <p class="bg-slogan">让每一次旅行都成为难忘的回忆</p>
      </div>
    </div>

    <!-- 右侧注册表单 -->
    <div class="register-form-container">
      <div class="register-form-card">
        <div class="form-header">
          <div class="logo">
            <span class="logo-icon">🌍</span>
            <h2 class="logo-text">旅游定制助手</h2>
          </div>
          <h3 class="form-title">账号注册</h3>
        </div>

        <el-form :model="registerForm"
                 :rules="rules"
                 ref="formRef"
                 class="register-form">
          <!-- 用户名输入框 -->
          <el-form-item prop="username">
            <el-input v-model="registerForm.username"
                      placeholder="请输入用户名"
                      class="form-control">
              <template #prefix>
                <span class="el-icon-user"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 手机号输入框 -->
          <el-form-item prop="phone">
            <el-input v-model="registerForm.phone"
                      placeholder="请输入手机号"
                      class="form-control">
              <template #prefix>
                <span class="el-icon-phone"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <el-input v-model="registerForm.password"
                      type="password"
                      placeholder="请输入密码"
                      class="form-control"
                      show-password>
              <template #password-icon="{ visible }">
                <el-icon :size="16">
                  <Unlock v-if="visible" />
                  <Lock v-else />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 确认密码输入框 -->
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword"
                      type="password"
                      placeholder="请确认密码"
                      class="form-control"
                      show-password>
              <template #password-icon="{ visible }">
                <el-icon :size="16">
                  <Unlock v-if="visible" />
                  <Lock v-else />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 同意协议 -->
          <el-form-item prop="agree"
                        class="agree-item">
            <el-checkbox v-model="registerForm.agree">
              我已阅读并同意
              <a href="#"
                 class="agreement-link">用户协议</a>
              和
              <a href="#"
                 class="agreement-link">隐私政策</a>
            </el-checkbox>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item>
            <button type="button"
                    class="btn btn-primary btn-lg register-btn"
                    @click="register"
                    :loading="loading">
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </el-form-item>

          <!-- 登录链接 -->
          <div class="login-link">
            <span>已有账号？</span>
            <router-link to="/login"
                         class="login-text">返回登录</router-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { Post } from '@/main'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 注册表单数据
const registerForm = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 20, message: '用户名长度在1-20之间', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 用户名格式验证：只允许字母、数字、下划线、中文
        if (!/^[\w\u4e00-\u9fa5]+$/.test(value)) {
          callback(new Error('用户名只能包含字母、数字、下划线和中文'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号长度必须为11位', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度至少8位', trigger: 'blur' },
    { max: 50, message: '密码长度不能超过50位', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 密码强度验证
        if (!/[a-z]/.test(value)) {
          callback(new Error('密码必须包含至少一个小写字母'))
        } else if (!/[A-Z]/.test(value)) {
          callback(new Error('密码必须包含至少一个大写字母'))
        } else if (!/\d/.test(value)) {
          callback(new Error('密码必须包含至少一个数字'))
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          callback(new Error('密码必须包含至少一个特殊字符'))
        } else {
          // 检查常见弱密码
          const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein']
          if (weakPasswords.includes(value.toLowerCase())) {
            callback(new Error('密码过于简单，请使用更复杂的密码'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  agree: [
    { required: true, message: '请阅读并同意用户协议和隐私政策', trigger: 'change' }
  ]
}

// 注册方法
const register = async () => {
  if (!formRef.value) return
  if (!registerForm.agree) {
    ElMessage.error('请先阅读并同意用户协议和隐私政策')
    return
  }

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // 模拟注册过程
      try {
        // 调用注册接口
        const res = await Post('user/register', { username: registerForm.username, phone: registerForm.phone, password: registerForm.password })
        console.log('注册成功', res)
        // 注册成功后跳转到登录页
        router.push('/login')
      } catch (error) {
        console.error('注册失败', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.register-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 左侧背景区域 */
.register-bg {
  flex: 1;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20travel%20landscape%2C%20mountain%20view%2C%20clear%20blue%20sky%2C%20natural%20beauty&image_size=landscape_16_9');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: var(--spacing-xl);
}

.bg-content {
  text-align: center;
  max-width: 600px;
}

.bg-title {
  font-size: var(--font-size-xxxl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.bg-slogan {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  line-height: 1.5;
}

/* 右侧注册表单 */
.register-form-container {
  width: 450px;
  background-color: var(--background-white);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-form-card {
  width: 100%;
  max-width: 360px;
  background-color: var(--background-white);
  border-radius: 12px;
  padding: var(--spacing-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all var(--transition-normal);
}

.register-form-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.form-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.logo-icon {
  font-size: 32px;
  margin-right: var(--spacing-sm);
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin: 0;
}

.form-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.register-form {
  width: 100%;
}

.form-control {
  width: 100%;
  border-radius: 12px;
  transition: all var(--transition-fast);
}

.form-control:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.15);
}

.agree-item {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.agreement-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.agreement-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  transition: all var(--transition-fast);
  border: none;
  color: white;
}

.register-btn:hover {
  box-shadow: 0 6px 20px rgba(22, 119, 255, 0.4);
  transform: translateY(-2px);
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
}

.register-btn:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.login-text {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.login-text:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.password-toggle {
  cursor: pointer;
  font-size: 16px;
  padding: 0 var(--spacing-xs);
  transition: transform var(--transition-fast);
}

.password-toggle:hover {
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-page {
    flex-direction: column;
  }

  .register-bg {
    width: 100%;
    height: 40vh;
  }

  .register-form-container {
    width: 100%;
    height: 60vh;
  }

  .register-form-card {
    padding: var(--spacing-lg);
  }

  .bg-title {
    font-size: var(--font-size-xxl);
  }

  .bg-slogan {
    font-size: var(--font-size-md);
  }
}
</style>