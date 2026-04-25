<template>
  <div class="login-page">
    <!-- 左侧背景区域 -->
    <div class="login-bg">
      <div class="bg-content">
        <h1 class="bg-title">AI旅游定制助手</h1>
        <p class="bg-slogan">让每一次旅行都成为难忘的回忆</p>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-container">
      <div class="login-form-card">
        <div class="form-header">
          <div class="logo">
            <span class="logo-icon">🌍</span>
            <h2 class="logo-text">旅游定制助手</h2>
          </div>
          <h3 class="form-title">欢迎登录</h3>
        </div>

        <el-form :model="loginForm"
                 :rules="rules"
                 ref="formRef"
                 class="login-form">
          <!-- 用户名/手机号输入框 -->
          <el-form-item prop="login">
            <el-input v-model="loginForm.login"
                      placeholder="请输入用户名或手机号"
                      class="form-control">
              <template #prefix>
                <span class="el-icon-user"></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password"
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

          <!-- 记住我 -->
          <el-form-item class="remember-me">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <button type="button"
                    class="btn btn-primary btn-lg login-btn"
                    @click="login"
                    :loading="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </el-form-item>

          <!-- 注册链接 -->
          <div class="register-link">
            <span>没有账号？</span>
            <router-link to="/register"
                         class="register-text">立即注册</router-link>
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
import { Post } from '../main'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  login: '',
  password: '',
  remember: '',
})

// 从本地存储中获取记住我状态
const rememberData = localStorage.getItem('tripsy_remember_data')
if (rememberData) {
  const rememberForm = JSON.parse(rememberData)
  loginForm.login = rememberForm.login
  loginForm.remember = true
}

// 表单验证规则
const rules = {
  login: [
    { required: true, message: '请输入用户名或手机号', trigger: 'blur' },
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
}

// 登录方法
const login = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用登录接口
        const res = await Post('user/login', { login: loginForm.login, password: loginForm.password })
        localStorage.setItem('tripsy_remember_data', loginForm.remember ? JSON.stringify({ login: loginForm.login, remember: loginForm.remember }) : '')
        console.log('登录成功', res)
        // 登录成功后跳转到首页
        router.push('/')
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 左侧背景区域 */
.login-bg {
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

/* 右侧登录表单 */
.login-form-container {
  width: 450px;
  background-color: var(--background-white);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-form-card {
  width: 100%;
  max-width: 360px;
  background-color: var(--background-white);
  border-radius: 12px;
  padding: var(--spacing-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all var(--transition-normal);
}

.login-form-card:hover {
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

.login-form {
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

.remember-me {
  margin-bottom: var(--spacing-md);
}

.login-btn {
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

.login-btn:hover {
  box-shadow: 0 6px 20px rgba(22, 119, 255, 0.4);
  transform: translateY(-2px);
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
}

.login-btn:active {
  transform: translateY(0);
}

.register-link {
  text-align: center;
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.register-text {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.register-text:hover {
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
  .login-page {
    flex-direction: column;
  }

  .login-bg {
    width: 100%;
    height: 40vh;
  }

  .login-form-container {
    width: 100%;
    height: 60vh;
  }

  .login-form-card {
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