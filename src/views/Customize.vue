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
          <el-form :model="form"
                   :rules="rules"
                   ref="formRef"
                   label-width="120px"
                   class="customize-form">
            <!-- 目的地 -->
            <el-form-item label="目的地"
                          prop="destination">
              <el-input v-model="form.destination"
                        placeholder="请输入目的地，例如：北京、三亚、丽江"
                        class="form-control" />
            </el-form-item>

            <!-- 出行天数 -->
            <el-form-item label="出行天数"
                          prop="days">
              <el-input-number :value="form.days"
                               @input="form.days = $event"
                               :min="1"
                               :max="30"
                               placeholder="请输入出行天数"
                               class="form-control" />
            </el-form-item>

            <!-- 预算范围 -->
            <el-form-item label="预算范围"
                          prop="budget">
              <el-input v-model="form.budgetRange"
                        placeholder="请输入预算范围，例如：经济型、¥2000-3000/人"
                        class="form-control" />
            </el-form-item>

            <!-- 出行类型 -->
            <el-form-item label="出行类型"
                          prop="travelType">
              <el-radio-group v-model="form.travelType"
                              class="radio-group">
                <el-radio-button label="自由行" />
                <el-radio-button label="跟团游" />
                <el-radio-button label="半自由行" />
              </el-radio-group>
            </el-form-item>

            <!-- 出行人数 -->
            <el-form-item label="出行人数"
                          prop="people">
              <el-input-number :value="form.people"
                               @input="form.people = $event"
                               :min="1"
                               :max="50"
                               placeholder="请输入出行人数"
                               class="form-control" />
            </el-form-item>

            <!-- 出发日期 -->
            <el-form-item label="出发日期"
                          prop="startDate">
              <el-date-picker v-model="form.startDate"
                              type="date"
                              placeholder="请选择出发日期"
                              class="form-control"
                              :disabled-date="disabledDate" />
            </el-form-item>

            <!-- 特殊需求 -->
            <el-form-item label="特殊需求">
              <el-input v-model="form.specialNeeds"
                        type="textarea"
                        placeholder="请输入特殊需求，例如：偏好美食、购物、景点打卡等"
                        rows="4"
                        class="form-control" />
            </el-form-item>

            <!-- 提交按钮 -->
            <el-form-item>
              <button type="button"
                      class="btn btn-primary btn-lg submit-btn"
                      @click="submitForm"
                      :loading="loading">
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
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=travel%20planning%20concept%2C%20AI%20assistant%2C%20modern%20design&image_size=portrait_4_3"
                   alt="AI定制" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { Post } from '@/main'

defineOptions({
  name: 'Customize'
})

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const form = reactive({
  destination: '', // 目的地
  days: 0, // 出行天数
  budgetRange: '', // 预算范围
  travelType: '自由行', // 出行类型
  people: 0, // 出行人数
  startDate: '', // 出发日期
  specialNeeds: '' // 特殊需求
})

// 表单验证规则
const rules = {
  destination: [
    { required: true, message: '请输入目的地', trigger: 'blur' }
  ],
  days: [
    { required: true, message: '请选择出行天数', trigger: 'change' }
  ],
  budgetRange: [
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
      const requestData = {
        destination: form.destination,
        days: form.days,
        budget_range: form.budgetRange,
        travel_type: form.travelType,
        people_count: form.people,
        departure_date: form.startDate,
        special_requirements: form.specialNeeds
      }
      const { code, data, message } = await Post('travel/generate', requestData)
      if (code === 200) {
        // 跳转到结果页面
        router.push({
          path: '/result',
          query: {
            id: data.id
          }
        })
      } else {
        alert(message)
      }
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
    form.budgetRange = route.query.budget as string
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
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: var(--spacing-xl);
}

.customize-form {
  padding-right: var(--spacing-lg);
  border-right: 1px solid var(--border-color);
}

.form-control {
  width: 100%;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

/* 输入数字组件样式 */
:deep(.el-input-number) {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
}

:deep(.el-input-number:hover) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: #f8f9fa;
  border: none;
  width: 40px;
  transition: all 0.3s ease;
  color: #606266;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

:deep(.el-input-number__decrease.is-disabled),
:deep(.el-input-number__increase.is-disabled) {
  background-color: #f8f9fa;
  color: #c9cdd4;
  cursor: not-allowed;
}

:deep(.el-input-number__input) {
  border: none;
  text-align: center;
  font-size: 14px;
  color: var(--text-primary);
  height: 36px;
  line-height: 36px;
}

:deep(.el-input-number__input:focus) {
  outline: none;
  box-shadow: none;
}

/* 单选按钮样式 */
.radio-group {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

:deep(.el-radio-button__inner) {
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: -1px 0 0 0 var(--primary-color);
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 8px 0 0 8px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 8px 8px 0;
}

/* 日期选择器样式 */
:deep(.el-date-editor) {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
  overflow: hidden;
}

:deep(.el-date-editor:hover) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

:deep(.el-date-editor:focus-within) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

/* 解决日期选择器横线问题 */
:deep(.el-date-editor .el-input__wrapper) {
  box-shadow: none !important;
}

:deep(.el-input__inner) {
  border: none;
  box-shadow: none;
  height: 36px;
  line-height: 36px;
  padding: 0 15px;
  font-size: 14px;
  color: var(--text-primary);
}

:deep(.el-input__wrapper::before),
:deep(.el-input__wrapper::after) {
  display: none;
}

:deep(.el-input__inner:focus) {
  outline: none;
  box-shadow: none;
}

:deep(.el-input__prefix) {
  left: 15px;
  color: #909399;
}

:deep(.el-input__suffix) {
  right: 15px;
  color: #909399;
}

:deep(.el-input__prefix-inner) {
  margin-right: 8px;
}

:deep(.el-input__suffix-inner) {
  margin-left: 8px;
}

/* 统一日期组件样式 */
:deep(.el-date-picker) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #dcdfe6;
}

:deep(.el-date-picker__header) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  padding: 12px;
  border-radius: 8px 8px 0 0;
}

:deep(.el-date-picker__nav-btn) {
  color: #606266;
  transition: color 0.3s ease;
}

:deep(.el-date-picker__nav-btn:hover) {
  color: var(--primary-color);
}

:deep(.el-date-picker__current-month) {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-date-picker__time-header) {
  background-color: #f8f9fa;
  border-top: 1px solid #e4e7ed;
  padding: 8px 12px;
}

:deep(.el-date-picker__time-header__btn) {
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-date-picker__time-header__btn:hover) {
  color: #0e63d8;
}

/* 提交按钮样式 */
.submit-btn {
  width: 100%;
  margin-top: var(--spacing-lg);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color), #0e63d8);
  border: none;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
}

.submit-btn:hover {
  background: linear-gradient(135deg, #0e63d8, var(--primary-color));
  box-shadow: 0 6px 16px rgba(22, 119, 255, 0.4);
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
}

.submit-btn:disabled {
  background: #c9cdd4;
  box-shadow: none;
  transform: none;
  cursor: not-allowed;
}

/* 表单标签样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 14px;
}

/* 表单错误提示 */
:deep(.el-form-item__error) {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 4px;
}

/* 表单项间距 */
:deep(.el-form-item) {
  margin-bottom: var(--spacing-md);
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