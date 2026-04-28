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
              <el-input-number v-model="form.days"
                               :min="1"
                               :max="30"
                               placeholder="请输入出行天数"
                               class="form-control" />
            </el-form-item>

            <!-- 预算设置 -->
            <el-form-item label="预算设置"
                          class="budget-section">
              <div class="budget-inputs">
                <el-form-item prop="budgetAmount"
                              class="budget-amount">
                  <el-input-number v-model="form.budgetAmount"
                                   :min="100"
                                   :step="100"
                                   placeholder="请输入预算金额"
                                   class="form-control" />
                </el-form-item>
                <el-form-item prop="budgetType"
                              class="budget-type">
                  <el-radio-group v-model="form.budgetType"
                                  class="radio-group">
                    <el-radio-button label="总预算" />
                    <el-radio-button label="每人预算" />
                  </el-radio-group>
                </el-form-item>
              </div>
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
              <el-input-number v-model="form.people"
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
                              value-format="YYYY-MM-DD"
                              :disabled-date="disabledDate" />
            </el-form-item>

            <!-- 特殊需求 -->
            <el-form-item label="特殊需求"
                          prop="specialNeeds">
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { service } from '@/utils/axios'
import { useTripStore } from '@/store/trip'

defineOptions({
  name: 'Customize'
})

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const tripStore = useTripStore()

// 表单数据
const form = reactive({
  destination: '', // 目的地
  days: 3, // 出行天数
  budgetType: '每人预算', // 预算类型：总预算/每人预算
  budgetAmount: 2000, // 预算金额
  travelType: '自由行', // 出行类型
  people: 2, // 出行人数
  startDate: new Date().toISOString().split('T')[0], // 出发日期, 默认当前日期 格式为 YYYY-MM-DD
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
  budgetType: [
    { required: true, message: '请选择预算类型', trigger: 'change' }
  ],
  budgetAmount: [
    { required: true, message: '请输入预算金额', trigger: 'change' },
    { type: 'number', min: 100, message: '预算金额至少100元', trigger: 'change' }
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
      try {
        // 模拟AI生成攻略的过程
        const requestData = {
          destination: form.destination,
          days: form.days,
          budget_type: form.budgetType,
          budget_amount: form.budgetAmount,
          travel_type: form.travelType,
          people_count: form.people,
          departure_date: form.startDate,
          special_requirements: form.specialNeeds
        }
        // 模拟数据，用于测试（AI返回的结构化格式）
//         const mockResponse = {
//           code: 200,
//           data: {
//             id: 3,
//             destination: '丽江',
//             days: 5,
//             budget_type: '每人预算',
//             budget_amount: 3800,
//             plan_content: `# 丽江5日自由行攻略

// ## 行程概览
// 本攻略为4人同行，每人预算3800元，共5天4晚的丽江自由行行程。`,
//             created_at: '2026-04-26 08:40:15',
//             // AI返回的结构化数据
//             overview: {
//               title: '丽江5日自由行',
//               description: '探索丽江独特文化',
//               budget_summary: '每人预算3800元，共计15200元'
//             },
//             schedule_days: [
//               {
//                 day_number: 1,
//                 day_title: '第一天：市区经典游',
//                 schedule: [
//                   {
//                     time: '09:00',
//                     title: '宽窄巷子',
//                     description: '宽窄巷子由宽巷子、窄巷子和井巷子组成，是成都市中心的一处历史文化保护区，展示了老成都的生活场景。',
//                     location: '宽窄巷子景区',
//                     icon: '🏮'
//                   },
//                   {
//                     time: '12:00',
//                     title: '午餐',
//                     description: '品尝当地特色美食，推荐：担担面、龙抄手。',
//                     location: '宽窄巷子附近',
//                     icon: '🍜'
//                   },
//                   {
//                     time: '14:00',
//                     title: '武侯祠',
//                     description: '武侯祠是纪念三国时期蜀汉丞相诸葛亮的祠堂，是中国唯一的君臣合祀祠庙。',
//                     location: '武侯祠博物馆',
//                     icon: '🏯'
//                   },
//                   {
//                     time: '17:00',
//                     title: '锦里古街',
//                     description: '锦里古街是成都著名的商业步行街，有着浓郁的三国文化和四川民俗风情。',
//                     location: '锦里古街',
//                     icon: '🛍️'
//                   },
//                   {
//                     time: '19:00',
//                     title: '晚餐',
//                     description: '享用正宗川菜，推荐：麻婆豆腐、水煮鱼。',
//                     location: '锦里附近',
//                     icon: '🌶️'
//                   }
//                 ]
//               },
//               {
//                 day_number: 2,
//                 day_title: '第二天：熊猫基地与金沙遗址',
//                 schedule: [
//                   {
//                     time: '08:00',
//                     title: '大熊猫繁育研究基地',
//                     description: '近距离观看国宝大熊猫，了解熊猫的生活习性和保护情况。',
//                     location: '成都大熊猫繁育研究基地',
//                     icon: '🐼'
//                   },
//                   {
//                     time: '12:00',
//                     title: '午餐',
//                     description: '在熊猫基地附近用餐。',
//                     location: '熊猫基地附近',
//                     icon: '🍽️'
//                   },
//                   {
//                     time: '14:00',
//                     title: '金沙遗址博物馆',
//                     description: '金沙遗址是古蜀文明的重要遗址，展示了大量珍贵的文物。',
//                     location: '金沙遗址博物馆',
//                     icon: '🏺'
//                   },
//                   {
//                     time: '17:00',
//                     title: '杜甫草堂',
//                     description: '唐代大诗人杜甫的故居，环境清幽，文化底蕴深厚。',
//                     location: '杜甫草堂博物馆',
//                     icon: '📚'
//                   },
//                   {
//                     time: '19:00',
//                     title: '晚餐',
//                     description: '品尝成都火锅。',
//                     location: '市区火锅店',
//                     icon: '🥘'
//                   }
//                 ]
//               }
//             ],
//             accommodation: [
//               {
//                 name: '成都瑞吉酒店',
//                 description: '位于市中心，交通便利，豪华舒适。',
//                 price_range: '¥1200-1800/晚'
//               },
//               {
//                 name: '成都太古里璞尚酒店',
//                 description: '百年老宅，融合现代与传统元素。',
//                 price_range: '¥800-1200/晚'
//               }
//             ],
//             budget: {
//               total: '4000元/人',
//               breakdown: [
//                 {
//                   item: '住宿',
//                   amount: '1200元'
//                 },
//                 {
//                   item: '交通',
//                   amount: '800元'
//                 },
//                 {
//                   item: '餐饮',
//                   amount: '1000元'
//                 },
//                 {
//                   item: '门票',
//                   amount: '600元'
//                 },
//                 {
//                   item: '其他',
//                   amount: '400元'
//                 }
//               ]
//             },
//             tips: '成都天气潮湿，建议携带雨具。川菜以麻辣为主，不能吃辣的游客请提前告知服务员。'
//           }
//         }

        // 实际接口调用（取消注释以使用真实API）
        const res = await service.post('travel/generate', requestData, { timeout: 300000 })
        const { code, data, message } = res
        // const { code, data, message } = mockResponse

        if (code === 200) {
          // 打印后端返回的数据结构，用于调试
          console.log('后端返回数据:', data);
          
          // 从data.plan_content中获取行程数据
          const planContent = data.plan_content || {};
          
          // 处理行程安排数据 - days数组
          const rawDays = planContent.days || [];
          const formattedScheduleDays = rawDays.map((day: any, index: number) => {
            return {
              day_number: day.day_number || day.day || index + 1,
              day_title: day.day_title || `第${index + 1}天`,
              schedule: day.schedule || day.activities || []
            };
          });
          
          // 处理住宿推荐 - accommodation可能是对象或数组
          let accommodationList: any[] = [];
          if (planContent.accommodation) {
            if (Array.isArray(planContent.accommodation)) {
              accommodationList = planContent.accommodation;
            } else if (typeof planContent.accommodation === 'object') {
              accommodationList = [planContent.accommodation];
            }
          }
          
          // 处理美食推荐 - 转换为推荐格式
          const foodList = (planContent.food || []).map((item: any) => ({
            name: item.name || '',
            description: item.description || '',
            price_range: item.icon || ''
          }));
          
          // 处理交通信息
          const transportationTips = planContent.transportation?.tips || '';
          
          // 处理旅行提示 - tips可能是数组或字符串
          let tipsText = '';
          if (Array.isArray(planContent.tips)) {
            tipsText = planContent.tips.join('；');
          } else if (typeof planContent.tips === 'string') {
            tipsText = planContent.tips;
          }
          
          console.log('处理后的行程安排:', formattedScheduleDays);
          
          // 使用Pinia存储行程数据
          tripStore.setCurrentItinerary({
            id: data.id?.toString() || Date.now().toString(),
            destination: data.destination || planContent.overview?.destination || '',
            days: data.days || planContent.overview?.days || formattedScheduleDays.length || 0,
            nights: (data.days || planContent.overview?.days || formattedScheduleDays.length || 1) - 1,
            budgetType: data.budget_type || '每人预算',
            budgetAmount: data.budget_amount || 0,
            budget: data.budget_type === '总预算' ? `总预算：¥${data.budget_amount}` : `每人预算：¥${data.budget_amount}`,
            planContent: typeof data.plan_content === 'string' ? data.plan_content : JSON.stringify(data.plan_content),
            createdAt: data.created_at || new Date().toISOString(),
            title: planContent.overview?.title || `${data.destination || '未知'}${data.days || 0}日自由行`,
            // AI返回的结构化数据
            overview: planContent.overview || {
              title: `${data.destination || '未知'}${data.days || 0}日自由行`,
              description: '',
              budget_summary: data.budget_type === '总预算' ? `总预算：¥${data.budget_amount}` : `每人预算：¥${data.budget_amount}`
            },
            scheduleDays: formattedScheduleDays,
            accommodation: accommodationList,
            budgetDetails: planContent.budget || {
              total: data.budget_type === '总预算' ? `¥${data.budget_amount}` : `¥${data.budget_amount}/人`,
              breakdown: []
            },
            tips: tipsText,
            // 扩展字段
            food: foodList,
            transportation: transportationTips,
            // 保持兼容性的字段
            dailyActivities: [],
            recommendations: []
          })

          // 跳转到结果页面
          router.push('/result')
        } else {
          loading.value = false
          ElMessage.error(message || '请求失败，请稍后重试')
        }
      } catch (error: any) {
        loading.value = false
        ElMessage.error(error?.message || '网络错误，请检查网络连接')
      }
    }
  })
}

// 处理URL参数更新
const updateFormFromQuery = () => {
  if (route.query.destination) {
    form.destination = route.query.destination as string
  }
  if (route.query.days) {
    form.days = Number(route.query.days)
  }
  if (route.query.budgetType) {
    form.budgetType = route.query.budgetType as string
  }
  if (route.query.budgetAmount) {
    form.budgetAmount = Number(route.query.budgetAmount)
  }
  if (route.query.travelType) {
    form.travelType = route.query.travelType as string
  }
  if (route.query.people) {
    form.people = Number(route.query.people)
  }
  if (route.query.startDate) {
    form.startDate = route.query.startDate as string
  }
  if (route.query.specialNeeds) {
    form.specialNeeds = route.query.specialNeeds as string
  }
}

// 初始化表单数据（从URL参数获取）
onMounted(() => {
  updateFormFromQuery()
})

// 监听路由参数变化
watch(() => route.query, () => {
  updateFormFromQuery()
}, { deep: true })
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
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
}

.form-control:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  transform: translateY(-1px);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
  transform: translateY(-1px);
}

/* 预算设置样式 */
.budget-section {
  margin-bottom: var(--spacing-md);
}

.budget-inputs {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.budget-amount {
  flex: 3.4;
  margin-bottom: 0;
}

.budget-type {
  flex: 2;
  margin-bottom: 0;
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
  padding-right: var(--spacing-md);
  width: 100px;
}

:deep(.el-form-item) {
  margin-bottom: var(--spacing-md);
  transition: all 0.3s ease;
}

:deep(.el-form-item.is-error .el-form-item__label) {
  color: #f56c6c;
}

:deep(.el-form-item__error) {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 4px;
  line-height: 1.2;
}

/* 提示信息 */
.form-tips {
  padding-left: var(--spacing-md);
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: var(--spacing-md);
  border-left: 4px solid var(--primary-color);
  margin-top: var(--spacing-md);
}

.tips-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tips-title::before {
  content: '💡';
  font-size: 18px;
}

.tips-list {
  list-style: none;
  margin-bottom: var(--spacing-lg);
  padding: 0;
}

.tips-list li {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.5;
  padding-left: var(--spacing-sm);
  position: relative;
  transition: all 0.2s ease;
}

.tips-list li:hover {
  color: var(--text-primary);
  transform: translateX(2px);
}

.tips-list li::before {
  content: '•';
  color: var(--primary-color);
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

.tips-image {
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: var(--spacing-md);
}

.tips-image:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.tips-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: all 0.3s ease;
}

.tips-image:hover img {
  transform: scale(1.02);
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

  .budget-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .budget-type,
  .budget-amount {
    flex: none;
    width: 100%;
  }
}
</style>