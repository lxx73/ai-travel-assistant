<template>
  <div class="customize-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">AI攻略定制</h1>
        <p class="page-subtitle">填写以下信息，让AI为你生成个性化的旅游攻略</p>
      </div>
    </section>

    <!-- 定制表单 -->
    <section class="customize-form-section">
      <div class="container">
        <div class="form-container">
          <el-form
            :model="form"
            :rules="rules"
            ref="formRef"
            label-width="120px"
            class="customize-form"
          >
            <!-- 目的地 -->
            <el-form-item label="目的地" prop="destination">
              <el-input
                v-model="form.destination"
                placeholder="请输入目的地，例如：北京、三亚、丽江"
                class="form-control"
              />
            </el-form-item>

            <!-- 出行天数 -->
            <el-form-item label="出行天数" prop="days">
              <el-select
                v-model="form.days"
                placeholder="请选择出行天数"
                class="form-control"
              >
                <el-option
                  v-for="day in 10"
                  :key="day"
                  :label="`${day}天`"
                  :value="day"
                />
              </el-select>
            </el-form-item>

            <!-- 预算范围 -->
            <el-form-item label="预算范围" prop="budget">
              <el-select
                v-model="form.budget"
                placeholder="请选择预算范围"
                class="form-control"
              >
                <el-option label="经济型（¥1000-2000/人）" value="经济型" />
                <el-option label="舒适型（¥2000-4000/人）" value="舒适型" />
                <el-option label="精品型（¥4000-6000/人）" value="精品型" />
                <el-option label="豪华型（¥6000+/人）" value="豪华型" />
              </el-select>
            </el-form-item>

            <!-- 出行类型 -->
            <el-form-item label="出行类型" prop="travelType">
              <el-radio-group v-model="form.travelType" class="radio-group">
                <el-radio-button label="自由行" />
                <el-radio-button label="跟团游" />
                <el-radio-button label="半自由行" />
              </el-radio-group>
            </el-form-item>

            <!-- 出行人数 -->
            <el-form-item label="出行人数" prop="people">
              <el-select
                v-model="form.people"
                placeholder="请选择出行人数"
                class="form-control"
              >
                <el-option
                  v-for="num in 10"
                  :key="num"
                  :label="`${num}人`"
                  :value="num"
                />
              </el-select>
            </el-form-item>

            <!-- 出发日期 -->
            <el-form-item label="出发日期" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                placeholder="请选择出发日期"
                class="form-control"
                :disabled-date="disabledDate"
              />
            </el-form-item>

            <!-- 特殊需求 -->
            <el-form-item label="特殊需求">
              <el-input
                v-model="form.specialNeeds"
                type="textarea"
                placeholder="请输入特殊需求，例如：偏好美食、购物、景点打卡等"
                rows="4"
                class="form-control"
              />
            </el-form-item>

            <!-- 提交按钮 -->
            <el-form-item>
              <button
                type="button"
                class="btn btn-primary btn-lg submit-btn"
                @click="submitForm"
                :loading="loading"
              >
                {{ loading ? '生成中...' : '生成攻略' }}
              </button>
            </el-form-item>
          </el-form>

          <!-- 右侧提示信息 -->
          <div class="form-tips">
            <h3 class="tips-title">定制小贴士</h3>
            <ul class="tips-list">
              <li>• 请尽可能详细地填写信息，以便AI生成更符合你需求的攻略</li>
              <li>• 预算范围将影响住宿、交通和活动的推荐</li>
              <li>• 特殊需求可以包括饮食偏好、兴趣爱好等</li>
              <li>• 生成攻略可能需要1-2分钟时间，请耐心等待</li>
            </ul>
            <div class="tips-image">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=travel%20planning%20concept%2C%20AI%20assistant%2C%20modern%20design&image_size=portrait_4_3" alt="AI定制" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3>AI旅游定制助手</h3>
            <p>让每一次旅行都成为难忘的回忆</p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/customize">AI攻略定制</router-link></li>
              <li><router-link to="/chat">智能问答</router-link></li>
              <li><router-link to="/user">用户中心</router-link></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>联系我们</h4>
            <p>邮箱：contact@aitravel.com</p>
            <p>电话：400-123-4567</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 AI旅游定制助手. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'

defineOptions({
  name: 'Customize'
})

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const form = reactive({
  destination: '',
  days: 0,
  budget: '',
  travelType: '自由行',
  people: 0,
  startDate: '',
  specialNeeds: ''
})

// 表单验证规则
const rules = {
  destination: [
    { required: true, message: '请输入目的地', trigger: 'blur' }
  ],
  days: [
    { required: true, message: '请选择出行天数', trigger: 'change' }
  ],
  budget: [
    { required: true, message: '请选择预算范围', trigger: 'change' }
  ],
  people: [
    { required: true, message: '请选择出行人数', trigger: 'change' }
  ],
  startDate: [
    { required: true, message: '请选择出发日期', trigger: 'change' }
  ]
}

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // 模拟AI生成攻略的过程
      setTimeout(() => {
        loading.value = false
        // 跳转到攻略结果页
        router.push({
          path: '/result',
          query: {
            destination: form.destination,
            days: form.days,
            budget: form.budget,
            travelType: form.travelType,
            people: form.people,
            startDate: form.startDate,
            specialNeeds: form.specialNeeds
          }
        })
      }, 2000)
    }
  })
}

// 初始化表单数据（从URL参数获取）
onMounted(() => {
  if (route.query.destination) {
    form.destination = route.query.destination as string
  }
  if (route.query.days) {
    form.days = Number(route.query.days)
  }
  if (route.query.budget) {
    form.budget = route.query.budget as string
  }
})
</script>

<style scoped>
.customize-page {
  min-height: 100vh;
}

/* 导航栏 */
.navbar {
  background-color: var(--background-white);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}

.brand-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: var(--spacing-md);
}

.nav-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.nav-item:hover,
.nav-item.active {
  color: var(--primary-color);
  background-color: var(--primary-light);
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, var(--primary-light), var(--background-white));
  padding: var(--spacing-xl) 0;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.page-subtitle {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

/* 定制表单 */
.customize-form-section {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
}

.form-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.customize-form {
  padding-right: var(--spacing-md);
  border-right: 1px solid var(--border-color);
}

.form-control {
  width: 100%;
}

.radio-group {
  display: flex;
  gap: var(--spacing-sm);
}

.submit-btn {
  width: 100%;
  margin-top: var(--spacing-md);
}

/* 提示信息 */
.form-tips {
  padding-left: var(--spacing-md);
}

.tips-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.tips-list {
  list-style: none;
  margin-bottom: var(--spacing-lg);
}

.tips-list li {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.5;
}

.tips-image {
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.tips-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* 底部 */
.footer {
  background-color: var(--text-primary);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-top: var(--spacing-xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.footer-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.footer-info p {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.footer-links h4,
.footer-contact h4 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-sm);
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-xs);
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-size: var(--font-size-sm);
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.footer-links a:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer-contact p {
  font-size: var(--font-size-sm);
  opacity: 0.8;
  margin-bottom: var(--spacing-xs);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-xs);
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-menu {
    gap: var(--spacing-sm);
  }
  
  .nav-item {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs);
  }
  
  .form-container {
    grid-template-columns: 1fr;
  }
  
  .customize-form {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }
  
  .form-tips {
    padding-left: 0;
  }
  
  .radio-group {
    flex-wrap: wrap;
  }
}
</style>