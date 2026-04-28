<template>
  <div class="chat-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="brand-logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div class="brand-text">
              <h1 class="page-title">智能问答</h1>
              <p class="page-subtitle">AI旅游助手为您服务</p>
            </div>
          </div>
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">在线</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 聊天界面 -->
    <section class="chat-section">
      <div class="container">
        <div class="chat-container">
          <!-- 聊天记录 -->
          <div class="chat-messages" ref="messagesContainer">
            <!-- 系统欢迎消息 -->
            <div class="welcome-card">
              <div class="welcome-decoration"></div>
              <div class="welcome-content">
                <div class="welcome-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <circle cx="6.5" cy="17.5" r="2.5"/>
                    <circle cx="17.5" cy="17.5" r="2.5"/>
                    <path d="M7 10h10"/>
                  </svg>
                </div>
                <h3 class="welcome-title">您好！我是您的AI旅游助手</h3>
                <p class="welcome-desc">有什么可以帮助您的吗？</p>
                <div class="welcome-tags">
                  <span 
                    v-for="(tag, index) in welcomeTags" 
                    :key="index"
                    class="welcome-tag"
                    @click="sendQuickQuestion(tag)"
                  >
                    <span class="tag-icon">✦</span>
                    <span class="tag-text">{{ tag }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 用户和AI消息 -->
            <div 
              v-for="(message, index) in messages" 
              :key="index"
              class="message-wrapper"
              :class="[message.type === 'user' ? 'user-wrapper' : 'ai-wrapper']"
            >
              <div class="message">
                <div class="message-avatar" :class="message.type">
                  <svg v-if="message.type === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <circle cx="6.5" cy="17.5" r="2.5"/>
                    <circle cx="17.5" cy="17.5" r="2.5"/>
                    <path d="M7 10h10"/>
                  </svg>
                </div>
                <div class="message-content">
                  <div 
                    class="message-bubble"
                    :class="{ 'typing': message.isTyping, 'ai' : message.type === 'ai', 'user' : message.type === 'user' }">
                    <div v-if="message.type === 'user'" class="bubble-content">
                      <p>{{ message.content }}</p>
                    </div>
                    <div v-else class="bubble-content">
                      <div v-if="message.isTyping" class="typing-indicator">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="typing-text">正在思考...</span>
                      </div>
                      <div v-else class="ai-text">{{ message.content }}</div>
                    </div>
                    <div class="message-time">{{ message.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 快捷问题 -->
          <div class="quick-section">
            <div class="quick-header">
              <span class="quick-icon">💡</span>
              <span class="quick-title">热门问题</span>
            </div>
            <div class="quick-list">
              <button 
                v-for="(question, index) in quickQuestions" 
                :key="index"
                class="quick-item"
                @click="sendQuickQuestion(question)"
                :disabled="isTyping"
              >
                <span class="quick-dot"></span>
                <span class="quick-text">{{ question }}</span>
                <span class="quick-arrow">→</span>
              </button>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-section">
            <div class="input-bar">
              <button class="input-action emoji-btn" @click="toggleEmoji">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 10h4M9 10h4M12 12c2-2 2-2 0-4-2 0-2 2 0 4z"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </button>
              <div class="input-field">
                <textarea
                  v-model="inputMessage"
                  placeholder="输入您的问题..."
                  class="chat-input"
                  rows="1"
                  @keyup.enter.exact="sendMessage"
                  :disabled="isTyping"
                  @input="adjustHeight"
                  ref="inputRef"
                />
              </div>
              <button 
                class="input-action voice-btn" 
                :class="{ active: isRecording }"
                @mousedown="startRecording"
                @mouseup="stopRecording"
                @mouseleave="stopRecording"
                :disabled="isTyping"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <circle cx="12" cy="19" r="4"/>
                </svg>
              </button>
              <button
                class="send-button"
                @click="sendMessage"
                :disabled="!inputMessage.trim() || isTyping"
                :class="{ active: inputMessage.trim() && !isTyping }"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13"/>
                  <path d="M22 2L15 22L11 13L2 9"/>
                </svg>
              </button>
            </div>
            <div class="input-hint">
              <span>按 Enter 发送</span>
              <span class="divider">|</span>
              <span>支持语音输入</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

defineOptions({
  name: 'Chat'
})

const messagesContainer = ref<HTMLElement>()
const inputMessage = ref('')
const inputRef = ref<HTMLTextAreaElement>()
const isTyping = ref(false)
const isRecording = ref(false)
const messages = ref<any[]>([])

// 欢迎标签
const welcomeTags = [
  '旅游推荐',
  '行程规划',
  '美食推荐',
  '住宿建议'
]

// 快捷问题
const quickQuestions = [
  '北京有哪些必去景点？',
  '三亚的最佳旅游时间是什么时候？',
  '丽江有哪些特色美食？',
  '如何规划一次完美的旅行？',
  '成都三日游怎么安排？',
  '杭州西湖周边景点推荐'
]

// 模拟AI回复
const getAIResponse = (question: string) => {
  const responses: Record<string, string> = {
    '北京有哪些必去景点？': '北京必去的景点包括：故宫博物院、八达岭长城、颐和园、天坛、天安门广场、圆明园、恭王府等。这些景点展示了北京的历史文化和自然风光，建议安排3-5天时间游览。春季和秋季是最佳旅游季节。',
    '三亚的最佳旅游时间是什么时候？': '三亚的最佳旅游时间是10月至次年4月，这段时间气候温暖宜人，适合海滩活动。夏季（5-9月）虽然温度较高，但也是三亚的雨季，可能会有台风影响。冬季是旅游旺季，酒店价格可能会上涨。',
    '丽江有哪些特色美食？': '丽江的特色美食包括：丽江粑粑、纳西烤肉、鸡豆凉粉、过桥米线、酥油茶、腊排骨火锅等。这些美食融合了纳西族和其他民族的风味，值得一试。推荐去古城内的小吃街品尝。',
    '如何规划一次完美的旅行？': '规划完美旅行的步骤：1. 确定目的地和旅行时间；2. 制定预算；3. 预订机票和酒店；4. 规划每日行程；5. 准备必要的证件和物品；6. 了解当地文化和注意事项；7. 购买旅游保险。记得留出一些自由活动时间！',
    '成都三日游怎么安排？': '成都三日游推荐：第一天游览宽窄巷子、人民公园、锦里；第二天参观大熊猫基地、金沙遗址、杜甫草堂；第三天可以去都江堰或青城山一日游。成都美食众多，记得品尝火锅、串串香和各种小吃！',
    '杭州西湖周边景点推荐': '杭州西湖周边推荐景点：西湖十景（苏堤春晓、断桥残雪等）、灵隐寺、雷峰塔、西溪湿地、河坊街。建议安排2-3天时间游览，春天和秋天是最佳季节。西湖夜景也非常美丽，值得一看。',
    '旅游推荐': '当然！请问您想去哪里旅游呢？我可以根据您的喜好为您推荐适合的目的地。比如：喜欢自然风光可以去张家界、九寨沟；喜欢历史文化可以去西安、南京；喜欢海滨度假可以去三亚、青岛。',
    '行程规划': '好的！规划行程需要考虑几个方面：旅行天数、预算范围、出行时间以及您的兴趣偏好。您可以告诉我这些信息，我来帮您规划一份详细的行程安排。',
    '美食推荐': '没问题！每个地方都有独特的美食。请问您想去哪个城市旅游呢？我可以为您推荐当地的特色美食和必吃餐厅。',
    '住宿建议': '好的！选择住宿时通常需要考虑：预算、地理位置、酒店类型等因素。您可以告诉我您的目的地和预算，我来为您推荐合适的住宿选择。'
  }
  
  return responses[question] || '这是一个很好的问题！根据我的了解，旅行规划需要考虑多个方面，包括时间、预算、兴趣爱好等。您可以告诉我更多关于您想去的目的地或您的旅行偏好，我可以给您更详细的建议。'
}

// 发送消息
const sendMessage = () => {
  const message = inputMessage.value.trim()
  if (!message || isTyping.value) return
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: message,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })
  
  inputMessage.value = ''
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
  scrollToBottom()
  
  // 模拟AI思考和回复
  simulateAIResponse(message)
}

// 发送快捷问题
const sendQuickQuestion = (question: string) => {
  inputMessage.value = question
  sendMessage()
}

// 模拟AI回复过程
const simulateAIResponse = (question: string) => {
  isTyping.value = true
  
  // 添加AI正在输入的消息
  const typingMessageIndex = messages.value.length
  messages.value.push({
    type: 'ai',
    content: '',
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isTyping: true
  })
  
  scrollToBottom()
  
  // 模拟延迟
  setTimeout(() => {
    const response = getAIResponse(question)
    // 模拟流式打字效果
    typeResponse(response, typingMessageIndex)
  }, 800)
}

// 流式打字效果
const typeResponse = (response: string, index: number) => {
  let currentIndex = 0
  const typingSpeed = 35
  
  const typeInterval = setInterval(() => {
    if (currentIndex < response.length) {
      messages.value[index].content += response[currentIndex]
      messages.value[index].isTyping = true
      scrollToBottom()
      currentIndex++
    } else {
      clearInterval(typeInterval)
      messages.value[index].isTyping = false
      isTyping.value = false
      scrollToBottom()
    }
  }, typingSpeed)
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 调整输入框高度
const adjustHeight = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    const scrollHeight = inputRef.value.scrollHeight
    inputRef.value.style.height = Math.min(scrollHeight, 120) + 'px'
  }
}

// 切换表情面板
const toggleEmoji = () => {
}

// 开始录音
const startRecording = () => {
  isRecording.value = true
}

// 停止录音
const stopRecording = () => {
  isRecording.value = false
}

// 页面加载时滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* 全局样式变量 */
:root {
  --primary-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  --secondary-gradient: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  --bg-gradient-start: #0f0c29;
  --bg-gradient-end: #302b63;
  --bg-gradient-mid: #24243e;
  --text-primary: #1e1b4b;
  --text-secondary: #6366f1;
  --text-muted: #64748b;
  --bg-light: #f8fafc;
  --bg-white: #ffffff;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}

/* 页面背景 */
.chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0a1a 0%, #1a1635 30%, #2d2650 60%, #1a1635 100%);
  background-attachment: fixed;
  position: relative;
  overflow-x: hidden;
}

.chat-page::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background-image: 
    radial-gradient(circle at 20% 10%, rgba(99, 102, 241, 0.2) 0%, transparent 30%),
    radial-gradient(circle at 80% 90%, rgba(139, 92, 246, 0.18) 0%, transparent 35%),
    radial-gradient(circle at 45% 50%, rgba(168, 85, 247, 0.12) 0%, transparent 45%),
    radial-gradient(circle at 10% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 30%),
    radial-gradient(circle at 90% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 30%);
  pointer-events: none;
  z-index: 0;
  animation: bgShift 20s ease-in-out infinite;
}

@keyframes bgShift {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(2%, -2%) rotate(1deg);
  }
  50% {
    transform: translate(-1%, 1%) rotate(0deg);
  }
  75% {
    transform: translate(1%, 2%) rotate(-1deg);
  }
}

/* 页面标题 */
.page-header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  margin: 0 auto;
  padding: 0 24px;
  max-width: 900px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: var(--primary-gradient);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.logo-icon svg {
  width: 20px;
  height: 20px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin: 2px 0 0 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-radius: var(--radius-full);
  border: 1px solid rgba(34, 197, 94, 0.2);
  transition: transform 0.3s ease;
}

.status-indicator:hover {
  transform: scale(1.02);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
}

.status-text {
  font-size: 13px;
  font-weight: 600;
  color: #22c55e;
}

/* 聊天区域 */
.chat-section {
  padding: 28px 0 40px;
  position: relative;
  z-index: 1;
}

.chat-container {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(24px);
  border-radius: var(--radius-xl);
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.2), 
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 220px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 消息列表 */
.chat-messages {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: linear-gradient(180deg, #fafbfc 0%, #f1f5f9 50%, #f8fafc 100%);
  position: relative;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: var(--radius-full);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 欢迎卡片 */
.welcome-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a855f7 70%, #d946ef 100%);
  border-radius: var(--radius-xl);
  padding: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 25px 50px rgba(99, 102, 241, 0.35),
    0 0 60px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.welcome-decoration {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-10px, -10px) scale(1.05);
  }
}

.welcome-card::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  border-radius: 50%;
  animation: float2 8s ease-in-out infinite;
}

@keyframes float2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(15px, 10px) scale(1.1);
  }
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  border-radius: 50%;
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-avatar {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.welcome-avatar:hover {
  transform: scale(1.08);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.welcome-avatar svg {
  width: 34px;
  height: 34px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.welcome-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 10px 0;
}

.welcome-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.welcome-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.welcome-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 22px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.welcome-tag:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.tag-icon {
  font-size: 12px;
  opacity: 0.8;
}

.tag-text {
  letter-spacing: 0.3px;
}

/* 消息包装器 */
.message-wrapper {
  display: flex;
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-wrapper {
  justify-content: flex-end;
}

.ai-wrapper {
  justify-content: flex-start;
}

/* 消息 */
.message {
  display: flex;
  gap: 14px;
  max-width: 78%;
}

.message-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  box-shadow: 
    var(--shadow-sm),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.message-avatar:hover {
  transform: scale(1.08);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.message-avatar svg {
  width: 22px;
  height: 22px;
  color: #64748b;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.message-avatar.user {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 
    0 6px 20px rgba(99, 102, 241, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.message-avatar.user svg {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-bubble {
  position: relative;
  padding: 18px 24px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-bubble.user {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: var(--radius-xl) 8px var(--radius-xl) var(--radius-xl);
  box-shadow: 
    0 6px 24px rgba(99, 102, 241, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.message-bubble.user::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  border-radius: inherit;
  pointer-events: none;
}

.message-bubble.ai {
  background: white;
  border-radius: 8px var(--radius-xl) var(--radius-xl) var(--radius-xl);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.message-bubble.typing {
  padding: 16px;
}

.bubble-content p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-primary);
}

.message-bubble.user .bubble-content p {
  color: white;
}

.ai-text {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 8px;
  padding: 0 8px;
}

.user .message-time {
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background: var(--text-secondary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.typing-text {
  font-size: 14px;
  color: var(--text-muted);
}

/* 快捷问题区域 */
.quick-section {
  padding: 24px 28px;
  background: linear-gradient(180deg, white 0%, #fafbfc 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.quick-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.quick-icon {
  font-size: 18px;
}

.quick-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: var(--radius-full);
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.quick-item:hover:not(:disabled) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 10px 30px rgba(99, 102, 241, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: transparent;
}

.quick-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-dot {
  width: 6px;
  height: 6px;
  background: var(--text-secondary);
  border-radius: 50%;
  transition: background 0.3s ease;
}

.quick-item:hover:not(:disabled) .quick-dot {
  background: white;
}

.quick-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.quick-item:hover:not(:disabled) .quick-text {
  color: white;
}

.quick-arrow {
  font-size: 12px;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.quick-item:hover:not(:disabled) .quick-arrow {
  color: white;
  transform: translateX(4px);
}

/* 输入区域 */
.input-section {
  padding: 20px 28px 24px;
  background: linear-gradient(180deg, #fafbfc 0%, white 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.input-bar {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: #f8fafc;
  border-radius: var(--radius-full);
  padding: 8px;
  border: 2px solid transparent;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.input-bar:focus-within {
  border-color: #6366f1;
  background: white;
  box-shadow: 
    0 0 0 4px rgba(99, 102, 241, 0.12),
    0 4px 20px rgba(99, 102, 241, 0.1);
}

.input-action {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: none;
  background: rgba(0, 0, 0, 0.03);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.input-action svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.input-action:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: scale(1.05);
}

.input-action:hover svg {
  transform: scale(1.1);
}

.voice-btn.active {
  background: #ef4444;
  color: white;
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.input-field {
  flex: 1;
  padding: 8px 0;
}

.chat-input {
  width: 100%;
  border: none;
  background: transparent;
  resize: none;
  font-size: 15px;
  line-height: 1.5;
  outline: none;
  color: var(--text-primary);
  max-height: 120px;
}

.chat-input::placeholder {
  color: #94a3b8;
}

.chat-input:disabled {
  opacity: 0.5;
}

.send-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.send-button svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.send-button.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 
    0 6px 20px rgba(99, 102, 241, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.send-button:hover:not(:disabled) {
  transform: scale(1.1);
}

.send-button.active:hover:not(:disabled) {
  box-shadow: 
    0 8px 25px rgba(99, 102, 241, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.send-button.active:hover:not(:disabled) svg {
  transform: translateX(2px);
}

.send-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 输入提示 */
.input-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.input-hint span {
  font-size: 12px;
  color: #94a3b8;
}

.divider {
  opacity: 0.4;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }

  .page-header {
    padding: 16px 0;
  }

  .page-title {
    font-size: 20px;
  }

  .logo-icon {
    width: 38px;
    height: 38px;
  }

  .logo-icon svg {
    width: 18px;
    height: 18px;
  }

  .status-indicator {
    padding: 8px 14px;
  }

  .chat-container {
    height: calc(100vh - 160px);
    border-radius: var(--radius-lg);
  }

  .chat-messages {
    padding: 20px;
    gap: 20px;
  }

  .welcome-card {
    padding: 24px;
  }

  .welcome-avatar {
    width: 52px;
    height: 52px;
    margin-bottom: 16px;
  }

  .welcome-avatar svg {
    width: 26px;
    height: 26px;
  }

  .welcome-title {
    font-size: 18px;
  }

  .message {
    max-width: 88%;
  }

  .message-avatar {
    width: 40px;
    height: 40px;
  }

  .message-avatar svg {
    width: 18px;
    height: 18px;
  }

  .message-bubble {
    padding: 14px 18px;
  }

  .message-bubble.user,
  .message-bubble.ai {
    border-radius: var(--radius-lg) 6px var(--radius-lg) var(--radius-lg);
  }

  .ai-text,
  .bubble-content p {
    font-size: 14px;
  }

  .quick-section {
    padding: 16px 20px;
  }

  .quick-item {
    padding: 9px 14px;
  }

  .quick-text {
    font-size: 12px;
  }

  .input-section {
    padding: 16px 20px 20px;
  }

  .input-bar {
    gap: 8px;
    padding: 6px;
  }

  .input-action {
    width: 38px;
    height: 38px;
  }

  .input-action svg {
    width: 18px;
    height: 18px;
  }

  .send-button {
    width: 42px;
    height: 42px;
  }

  .send-button svg {
    width: 18px;
    height: 18px;
  }

  .input-hint {
    display: none;
  }
}

@media (max-width: 480px) {
  .chat-messages {
    padding: 16px;
  }

  .message-avatar {
    width: 36px;
    height: 36px;
  }

  .message-avatar svg {
    width: 16px;
    height: 16px;
  }

  .message-bubble {
    padding: 12px 14px;
  }

  .welcome-tag {
    padding: 8px 14px;
    font-size: 12px;
  }

  .quick-item {
    padding: 8px 12px;
  }
}
</style>