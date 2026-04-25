<template>
  <div class="chat-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">智能问答</h1>
        <p class="page-subtitle">随时向AI助手咨询旅行相关问题</p>
      </div>
    </section>

    <!-- 聊天界面 -->
    <section class="chat-section">
      <div class="container">
        <div class="chat-container">
          <!-- 聊天记录 -->
          <div class="chat-messages" ref="messagesContainer">
            <!-- 系统消息 -->
            <div class="message system-message">
              <div class="message-content">
                <p>你好！我是你的AI旅游助手，有什么可以帮助你的吗？</p>
                <p>你可以询问：</p>
                <ul>
                  <li>旅游目的地推荐</li>
                  <li>行程规划建议</li>
                  <li>酒店预订信息</li>
                  <li>当地美食推荐</li>
                  <li>旅行注意事项</li>
                </ul>
              </div>
            </div>

            <!-- 用户和AI消息 -->
            <div 
              v-for="(message, index) in messages" 
              :key="index"
              :class="['message', message.type]"
            >
              <div class="message-avatar">
                {{ message.type === 'user' ? '👤' : '🤖' }}
              </div>
              <div class="message-content">
                <p v-if="message.type === 'user'" class="message-text">{{ message.content }}</p>
                <div v-else class="ai-message">
                  <p v-if="!message.isTyping" class="message-text">{{ message.content }}</p>
                  <div v-else class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-area">
            <el-input
              v-model="inputMessage"
              type="textarea"
              placeholder="请输入你的问题..."
              rows="1"
              class="chat-input"
              @keyup.enter.exact="sendMessage"
              :disabled="isTyping"
            />
            <button
              class="btn btn-primary send-btn"
              @click="sendMessage"
              :disabled="!inputMessage.trim() || isTyping"
            >
              发送
            </button>
          </div>

          <!-- 快捷问题 -->
          <div class="quick-questions">
            <span class="quick-questions-title">快捷问题：</span>
            <button 
              v-for="(question, index) in quickQuestions" 
              :key="index"
              class="quick-question-btn"
              @click="sendQuickQuestion(question)"
              :disabled="isTyping"
            >
              {{ question }}
            </button>
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
const isTyping = ref(false)
const messages = ref<any[]>([])

// 快捷问题
const quickQuestions = [
  '北京有哪些必去景点？',
  '三亚的最佳旅游时间是什么时候？',
  '丽江有哪些特色美食？',
  '如何规划一次完美的旅行？'
]

// 模拟AI回复
const getAIResponse = (question: string) => {
  const responses: Record<string, string> = {
    '北京有哪些必去景点？': '北京必去的景点包括：故宫博物院、八达岭长城、颐和园、天坛、天安门广场、圆明园、恭王府等。这些景点展示了北京的历史文化和自然风光，建议安排3-5天时间游览。',
    '三亚的最佳旅游时间是什么时候？': '三亚的最佳旅游时间是10月至次年4月，这段时间气候温暖宜人，适合海滩活动。夏季（5-9月）虽然温度较高，但也是三亚的雨季，可能会有台风影响。',
    '丽江有哪些特色美食？': '丽江的特色美食包括：丽江粑粑、纳西烤肉、鸡豆凉粉、过桥米线、酥油茶、腊排骨火锅等。这些美食融合了纳西族和其他民族的风味，值得一试。',
    '如何规划一次完美的旅行？': '规划完美旅行的步骤：1. 确定目的地和旅行时间；2. 制定预算；3. 预订机票和酒店；4. 规划每日行程；5. 准备必要的证件和物品；6. 了解当地文化和注意事项；7. 购买旅游保险。'  
  }
  
  return responses[question] || '这是一个很好的问题！根据我的了解，...（AI正在思考）'
}

// 发送消息
const sendMessage = () => {
  const message = inputMessage.value.trim()
  if (!message || isTyping.value) return
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: message
  })
  
  inputMessage.value = ''
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
    isTyping: true
  })
  
  scrollToBottom()
  
  // 模拟延迟
  setTimeout(() => {
    const response = getAIResponse(question)
    // 模拟流式打字效果
    typeResponse(response, typingMessageIndex)
  }, 1000)
}

// 流式打字效果
const typeResponse = (response: string, index: number) => {
  let currentIndex = 0
  const typingSpeed = 50 // 打字速度（毫秒/字符）
  
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

// 页面加载时滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
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

/* 聊天界面 */
.chat-section {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
}

.chat-container {
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-messages {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* 消息样式 */
.message {
  display: flex;
  gap: var(--spacing-sm);
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.system-message {
  max-width: 100%;
  background-color: var(--primary-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  align-self: center;
}

.system-message p {
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.system-message ul {
  margin-left: var(--spacing-md);
  color: var(--text-secondary);
}

.system-message li {
  margin-bottom: var(--spacing-xs);
}

.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai {
  align-self: flex-start;
}

.message-avatar {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 4px;
}

.message-content {
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  position: relative;
}

.user .message-content {
  background-color: var(--primary-color);
  color: white;
}

.message-text {
  margin: 0;
  line-height: 1.5;
  word-wrap: break-word;
}

.user .message-text {
  color: white;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: var(--spacing-xs) 0;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background-color: var(--text-secondary);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 输入区域 */
.chat-input-area {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  background-color: var(--background-white);
}

.chat-input {
  flex: 1;
  resize: none;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm);
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.send-btn {
  flex-shrink: 0;
  align-self: flex-end;
  padding: var(--spacing-sm) var(--spacing-md);
}

/* 快捷问题 */
.quick-questions {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  background-color: var(--background-light);
  flex-wrap: wrap;
  align-items: center;
}

.quick-questions-title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
}

.quick-question-btn {
  background-color: var(--background-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-question-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: var(--primary-light);
}

.quick-question-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  
  .chat-container {
    height: 500px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .quick-questions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .quick-questions-title {
    margin-bottom: var(--spacing-xs);
  }
}
</style>