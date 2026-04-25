<template>
  <div class="user-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">用户中心</h1>
        <p class="page-subtitle">管理你的个人信息和旅行记录</p>
      </div>
    </section>

    <!-- 用户中心内容 -->
    <section class="user-section">
      <div class="container">
        <div class="to-login" v-if="!isLogin">
          <div class="login-tips">你还没有登录~</div>
          <router-link to="/login" class="btn btn-primary">去登录</router-link>
        </div>

        <div v-else class="user-container">
          <!-- 左侧导航 -->
          <div class="user-sidebar">
            <div class="user-profile">
              <div class="profile-avatar" @click="handleAvatarClick">
                <img v-if="userInfo.avatar" :src="getAvatarUrl(userInfo.avatar)" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <User />
                </el-icon>
                <div class="avatar-overlay">
                  <el-icon class="overlay-icon">
                    <View />
                  </el-icon>
                  <span class="overlay-text">查看</span>
                </div>
              </div>
              <h3 class="profile-name">{{ userInfo.username }}</h3>
              <p class="profile-email">{{ userInfo.email }}</p>
            </div>
            <div class="user-nav">
              <div v-for="item in navItems" :key="item.id" :class="['nav-item', { active: activeNav === item.id }]" @click="activeNav = item.id">
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-text">{{ item.text }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧内容 -->
          <div class="user-content">
            <!-- 个人信息 -->
            <div v-if="activeNav === 'profile'" class="content-section">
              <h2 class="section-title">个人信息</h2>
              <div class="profile-form">
                <el-form :model="userInfoEdit" label-width="120px">
                  <el-form-item label="姓名">
                    <el-input v-model="userInfoEdit.username" maxlength="20" minlength="1" class="form-control" :disabled="!isEdit" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="userInfoEdit.email" class="form-control" :disabled="!isEdit" />
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="userInfoEdit.phone" class="form-control" :disabled="!isEdit" />
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-select v-model="userInfoEdit.gender" class="form-control" :disabled="!isEdit">
                      <el-option label="男" :value="1" />
                      <el-option label="女" :value="0" />
                      <el-option label="保密" :value="2" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="生日">
                    <el-date-picker v-model="userInfoEdit.birthday" type="date" class="form-control" format="YYYY/MM/DD" value-format="YYYY-MM-DD" :disabled="!isEdit" />
                  </el-form-item>
                  <el-form-item label="个人简介">
                    <el-input v-model="userInfoEdit.personalProfile" type="textarea" rows="4" class="form-control" :disabled="!isEdit" />
                  </el-form-item>
                  <el-form-item v-if="!isEdit">
                    <button type="button" class="btn btn-primary" @click="isEdit = true">修改</button>
                  </el-form-item>
                  <el-form-item v-if="isEdit">
                    <div style="width: 100%;display: flex; justify-content: flex-end; margin-top: 10px; gap: 10px;">
                      <button type="button" class="btn btn-danger" @click="cancelEdit">
                        放弃修改
                      </button>
                      <button type="button" class="btn btn-primary" @click="saveProfile">
                        保存修改
                      </button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <!-- 我的收藏 -->
            <div v-if="activeNav === 'favorites'" class="content-section">
              <h2 class="section-title">我的收藏</h2>
              <div v-if="favorites.length === 0" class="empty-state">
                <div class="empty-icon">❤️</div>
                <p class="empty-text">暂无收藏的行程</p>
                <router-link to="/customize" class="btn btn-primary">去定制行程</router-link>
              </div>
              <div v-else class="favorites-list">
                <div v-for="item in favorites" :key="item.id" class="favorite-card">
                  <div class="favorite-image">
                    <img :src="item.image" :alt="item.title" />
                  </div>
                  <div class="favorite-content">
                    <h3 class="favorite-title">{{ item.title }}</h3>
                    <p class="favorite-desc">{{ item.description }}</p>
                    <div class="favorite-info">
                      <span class="info-item">{{ item.days }}天{{ item.nights }}晚</span>
                      <span class="info-item">{{ item.budget }}</span>
                      <span class="info-item">{{ item.rating }}⭐</span>
                    </div>
                    <div class="favorite-actions">
                      <router-link to="/result" class="btn btn-outline">查看详情</router-link>
                      <button type="button" class="btn btn-outline" @click="removeFavorite(item.id)">
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 历史行程 -->
            <div v-if="activeNav === 'history'" class="content-section">
              <h2 class="section-title">历史行程</h2>
              <div v-if="history.length === 0" class="empty-state">
                <div class="empty-icon">📅</div>
                <p class="empty-text">暂无历史行程</p>
                <router-link to="/customize" class="btn btn-primary">去定制行程</router-link>
              </div>
              <div v-else class="history-list">
                <div v-for="item in history" :key="item.id" class="history-card">
                  <div class="history-image">
                    <img :src="item.image" :alt="item.title" />
                  </div>
                  <div class="history-content">
                    <h3 class="history-title">{{ item.title }}</h3>
                    <p class="history-desc">{{ item.description }}</p>
                    <div class="history-info">
                      <span class="info-item">{{ item.days }}天{{ item.nights }}晚</span>
                      <span class="info-item">{{ item.budget }}</span>
                      <span class="info-item">{{ formatDate(item.createdAt) }}</span>
                    </div>
                    <div class="history-actions">
                      <router-link to="/result" class="btn btn-outline">查看详情</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 账户设置 -->
            <div v-if="activeNav === 'settings'" class="content-section">
              <h2 class="section-title">账户设置</h2>
              <div class="settings-list">
                <div class="settings-item">
                  <span class="settings-label">修改密码</span>
                  <button type="button" class="btn btn-outline" @click="showPasswordDialog = true">
                    修改
                  </button>
                </div>
                <div class="settings-item">
                  <span class="settings-label">通知设置</span>
                  <el-switch v-model="notificationSettings.email" />
                </div>
                <div class="settings-item">
                  <span class="settings-label">隐私设置</span>
                  <el-switch v-model="privacySettings.publicProfile" />
                </div>
                <div class="settings-item">
                  <span class="settings-label">删除账户</span>
                  <button type="button" class="btn btn-danger" @click="showDeleteDialog = true">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="500px" align-center>
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <button type="button" class="btn btn-outline" @click="showPasswordDialog = false">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="changePassword">确定</button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除账户对话框 -->
    <el-dialog v-model="showDeleteDialog" title="删除账户" width="500px">
      <p class="delete-warning">
        确定要删除你的账户吗？此操作不可恢复，所有数据将被永久删除。
      </p>
      <template #footer>
        <span class="dialog-footer">
          <button type="button" class="btn btn-outline" @click="showDeleteDialog = false">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteAccount">删除</button>
        </span>
      </template>
    </el-dialog>

    <!-- 头像预览弹窗 -->
    <el-dialog v-model="avatarDialogVisible" title="头像管理" width="600px" :close-on-click-modal="false">
      <div class="avatar-dialog-content">
        <!-- 头像预览 -->
        <div v-if="avatarDialogImage" class="avatar-preview-section">
          <h3>头像预览</h3>
          <div class="avatar-preview-container">
            <img :src="avatarDialogImage" class="avatar-large-preview" />
          </div>
          <div class="avatar-actions">
            <el-button type="primary" @click="downloadAvatar">
              <el-icon>
                <Download />
              </el-icon> 下载
            </el-button>
          </div>
        </div>

        <!-- 头像上传 -->
        <div class="avatar-upload-section">
          <div class="uploader-hint">
            <h3 style="display: inline-block;">更换头像</h3>
            <span style="font-size: 12px;color: #999;margin-left: 10px;">点击或拖拽上传头像</span>
          </div>
          <div class="profile-avatar uploader-container" style="display: flex; justify-content: center; align-items: center;">
            <input type="file" class="avatar-uploader-input" @change="handleAvatarChange" />
            <img v-if="avatarUpload" :src="avatarUpload" class="avatar-large" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </div>
          <div class="avatar-url-input">
            <el-input v-model="avatarUrl" placeholder="或输入图片URL" class="form-control" @blur="handleAvatarUrlChange" />
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="avatarDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAvatarChanges">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import type { FormInstance } from "element-plus"
import { Post, Get, Delete } from "@/main"
import { ElMessage, UploadProps } from "element-plus"
import { User, View, Plus, Download } from "@element-plus/icons-vue"

const router = useRouter()

// 定义组件名称
const name = 'User'

// 响应式变量
const user_id = ref(localStorage.getItem("user_id"))
const token = ref(localStorage.getItem("token"))
const flushPage = ref(localStorage.getItem('need_flush_user_page') === 'true')

// 初始化isLogin时检查token是否存在
const isLogin = ref(!!token.value && !!user_id.value)

// 激活的导航项
const activeNav = ref("profile")

const isEdit = ref(false)

const imgPrefix = import.meta.env.VITE_APP_IMAGE_URL

// 使用 ref 来声明 isFetchingProfile，确保在组件实例间保持状态
const isFetchingProfile = ref(false)

// 用户信息
const userInfo = reactive({
  username: '',
  email: '',
  phone: '',
  gender: 2,
  birthday: '',
  personalProfile: '',
  avatar: ''
})

// 编辑用户信息
const userInfoEdit = reactive({
  username: '',
  email: '',
  phone: '',
  gender: 2,
  birthday: '',
  personalProfile: '',
  avatar: ''
})

// 头像相关变量
const isDragActive = ref(false)
const avatarPreview = ref('')
const avatarUpload = ref('')
const avatarUrl = ref('')

// 头像预览弹窗
const showAvatarDialog = ref(false)
const avatarDialogImage = ref('')
const avatarDialogVisible = ref(false)

// 密码修改相关
const showPasswordDialog = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})

// 删除账户相关
const showDeleteDialog = ref(false)

// 通知设置
const notificationSettings = reactive({
  email: true,
})

// 隐私设置
const privacySettings = reactive({
  publicProfile: false,
})

// 收藏的行程
const favorites = ref([
  {
    id: 1,
    title: "北京经典5日游",
    description: "探索北京的历史文化，感受帝都的魅力",
    days: 5,
    nights: 4,
    budget: "¥3000/人",
    rating: 4.8,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20Forbidden%20City%20landscape%2C%20tourist%20attraction%2C%20beautiful%20scenery&image_size=landscape_4_3",
  },
  {
    id: 2,
    title: "三亚阳光海滩4日游",
    description: "享受阳光、沙滩和海浪的完美假期",
    days: 4,
    nights: 3,
    budget: "¥4000/人",
    rating: 4.9,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sanya%20beach%20tropical%20paradise%2C%20clear%20blue%20water%2C%20white%20sand&image_size=landscape_4_3",
  },
])

// 历史行程
const history = ref([
  {
    id: 1,
    title: "丽江古镇3日游",
    description: "体验纳西族文化，漫步古镇小巷",
    days: 3,
    nights: 2,
    budget: "¥2500/人",
    createdAt: "2026-04-01",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lijiang%20ancient%20town%2C%20traditional%20Chinese%20architecture%2C%20cobblestone%20streets&image_size=landscape_4_3",
  },
  {
    id: 2,
    title: "上海都市2日游",
    description: "感受国际化大都市的魅力",
    days: 2,
    nights: 1,
    budget: "¥2000/人",
    createdAt: "2026-03-15",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shanghai%20city%20skyline%2C%20modern%20architecture%2C%20night%20view&image_size=landscape_4_3",
  },
])

// 导航项
const navItems = [
  { id: "profile", icon: "👤", text: "个人信息" },
  { id: "favorites", icon: "❤️", text: "我的收藏" },
  { id: "history", icon: "📅", text: "历史行程" },
  { id: "settings", icon: "⚙️", text: "账户设置" },
]

// 密码验证规则
const passwordRules = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 8, message: "密码长度至少8位", trigger: "blur" },
    { max: 50, message: "密码长度不能超过50位", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
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
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error("两次输入的密码不一致"))
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
}

// 生命周期钩子
onMounted(() => {
  // 页面加载时，重新从localStorage获取token和user_id
  token.value = localStorage.getItem("token")
  user_id.value = localStorage.getItem("user_id")
  isLogin.value = !!token.value && !!user_id.value
  
  // 每次页面加载都尝试获取用户信息，不再使用sessionStorage标记
  // 这样可以确保刷新页面后也能获取最新的用户数据
  if (token.value && user_id.value) {
    getProfile()
  } else {
    // 如果token或user_id不存在，清除可能的标记
    sessionStorage.removeItem('user_profile_fetched')
    isLogin.value = false
  }
})

onActivated(() => {
  // 从缓存中激活时，检查是否需要刷新用户信息
  const needFlush = localStorage.getItem('need_flush_user_page') === 'true'
  if (needFlush) {
    getProfile()
  }
})

// 获取用户信息
async function getProfile() {
  // 防止重复请求
  if (isFetchingProfile.value) {
    return
  }

  if (!user_id.value) {
    ElMessage.error("请先登录")
    // 清除可能存在的无效数据
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    sessionStorage.removeItem('user_profile_fetched')
    // 清除响应式变量的值
    token.value = null
    user_id.value = null
    // 延迟导航，避免无限循环
    setTimeout(() => {
      router.push("/login")
    }, 100)
    return
  }

  try {
    isFetchingProfile.value = true
    const { code, data, message } = await Get("user/me", { user_id: user_id.value })

    if (code === 200 && data) {
      // 更新用户信息
      const userData = {
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender !== undefined ? data.gender : 2,
        birthday: data.birthday || '',
        personalProfile: data.personalProfile || '',
        avatar: data.avatar || ''
      }

      // 同时更新userInfo和userInfoEdit
      Object.assign(userInfo, userData)
      Object.assign(userInfoEdit, userData)

      isLogin.value = true
      flushPage.value = false
      localStorage.setItem('need_flush_user_page', 'false')
    } else {
      isLogin.value = false
      ElMessage.error(message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息出错:', error)
    isLogin.value = false
    // 如果是401错误（未授权），清除token和user_id
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      // 清除响应式变量的值
      token.value = null
      user_id.value = null
    }
    ElMessage.error('获取用户信息失败，请稍后重试')
  } finally {
    // 无论请求成功或失败，都将标志设为false
    isFetchingProfile.value = false
  }
}

// 保存个人信息
async function saveProfile() {
  // 验证用户信息
  if (!userInfoEdit.username) {
    ElMessage.error('请输入用户名')
    return
  }
  if (userInfoEdit.username.length > 20) {
    ElMessage.error('用户名长度不能超过20位')
    return
  }
  if (!/^[\w\u4e00-\u9fa5]+$/.test(userInfoEdit.username)) {
    ElMessage.error('用户名只能包含字母、数字、下划线和中文')
    return
  }
  if (userInfoEdit.phone && !/^1[3-9]\d{9}$/.test(userInfoEdit.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }
  if (userInfoEdit.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userInfoEdit.email)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }
  if (userInfoEdit.personalProfile && userInfoEdit.personalProfile.length > 500) {
    ElMessage.error('个人简介长度不能超过500位')
    return
  }

  try {
    const data = { ...userInfoEdit }
    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        delete data[key]
      }
    })

    // 删除avatar字段，因为已经单独上传
    delete data.avatar

    const { code, message } = await Post('user/update', {
      user_id: user_id.value,
      ...data
    })
    if (code === 200) {
      // 更新用户信息
      if (data.avatar) {
        userInfo.avatar = data.avatar
        userInfoEdit.avatar = data.avatar
      }
      Object.assign(userInfo, data)
      isEdit.value = false
      ElMessage.success('个人信息更新成功')
    } else {
      ElMessage.error(message)
    }
  } catch (error) {
    console.error('更新个人信息失败', error)
    ElMessage.error('更新个人信息失败')
  }
}

// 取消修改
const cancelEdit = () => {
  isEdit.value = false
  // 重置编辑数据为当前用户数据
  Object.assign(userInfoEdit, userInfo)
}

// 处理头像文件选择
const handleAvatarChange = (e: any) => {
  // 获取上传的文件
  const file = e.target.files[0]
  handleFileUpload(file)
}

// 处理文件上传
const handleFileUpload = (file: File) => {
  // 检查文件类型是否为图片
  if (!file || !file.type.match('image.*')) {
    ElMessage.error('请上传图片文件')
    return
  }

  // 检查文件大小（限制为2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过2MB')
    return
  }

  // 预览头像
  const reader = new FileReader()
  reader.onload = (e: any) => {
    avatarPreview.value = e.target.result
    // 保存Base64编码
    avatarUpload.value = e.target.result
  }
  reader.readAsDataURL(file)

  // 清空URL输入
  avatarUrl.value = ''
}

// 处理头像点击事件
const handleAvatarClick = () => {
  if (userInfo.avatar) {
    avatarDialogImage.value = getAvatarUrl(userInfo.avatar)
  }
  avatarDialogVisible.value = true
}

// 处理头像URL输入
const handleAvatarUrlChange = () => {
  if (avatarUrl.value) {
    // 验证URL格式
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i
    if (!urlPattern.test(avatarUrl.value)) {
      ElMessage.error('请输入有效的图片URL')
      return
    }

    // 设置头像为URL
    avatarUpload.value = avatarUrl.value
    avatarPreview.value = ''
  }
}

// 下载头像
const downloadAvatar = () => {
  if (avatarDialogImage.value) {
    const link = document.createElement('a')
    link.href = avatarDialogImage.value
    link.download = 'tripsy_avatar.png'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }
}

// 保存头像更改
const saveAvatarChanges = async () => {
  if (!avatarUpload.value) {
    ElMessage.error('请选择头像')
    return
  }

  try {
    let uploadData: any = {}

    if (typeof avatarUpload.value === 'string') {
      if (avatarUpload.value.startsWith('data:image/')) {
        // Base64方式上传
        uploadData = {
          base64: avatarUpload.value
        }
      } else {
        // URL方式上传
        uploadData = {
          avatar_url: avatarUpload.value
        }
      }

      const { code, message, data: uploadResult } = await Post('avatar/upload', uploadData)
      if (code === 200) {
        // 更新头像URL
        userInfo.avatar = uploadResult.avatar_url
        userInfoEdit.avatar = uploadResult.avatar_url
        avatarDialogImage.value = getAvatarUrl(uploadResult.avatar_url)
        ElMessage.success('头像更新成功')
        avatarDialogVisible.value = false
      } else {
        ElMessage.error(message || '头像上传失败')
      }
    }
  } catch (error) {
    console.error('头像上传失败', error)
    ElMessage.error('头像上传失败')
  }
}

// 移除收藏
const removeFavorite = (id: number) => {
  const index = favorites.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    favorites.value.splice(index, 1)
    ElMessage.success('已取消收藏')
  }
}

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const { code, message } = await Post('user/change_password', {
          user_id: user_id.value,
          old_password: passwordForm.oldPassword,
          new_password: passwordForm.newPassword
        })
        if (code === 200) {
          showPasswordDialog.value = false
          ElMessage.success('密码已修改')
          // 清空表单
          passwordForm.oldPassword = ""
          passwordForm.newPassword = ""
          passwordForm.confirmPassword = ""
        } else {
          ElMessage.error(message)
        }
      } catch (error) {
        console.error('修改密码失败', error)
        ElMessage.error('修改密码失败')
      }
    }
  })
}

// 删除账户
const deleteAccount = async () => {
  try {
    const { code, message } = await Delete('user', { user_id: user_id.value })
    if (code === 200) {
      showDeleteDialog.value = false
      ElMessage.success('账户已删除')
      // 清除本地存储并跳转到登录页面
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      sessionStorage.removeItem('user_profile_fetched')
      // 清除响应式变量的值
      token.value = null
      user_id.value = null
      isLogin.value = false
      // 延迟导航，避免无限循环
      setTimeout(() => {
        router.push('/login')
      }, 100)
    } else {
      ElMessage.error(message)
    }
  } catch (error) {
    console.error('删除账户失败', error)
    ElMessage.error('删除账户失败')
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// 获取头像URL
const getAvatarUrl = (avatar: string) => {
  // 检查是否是Base64编码
  if (avatar.startsWith('data:image/')) {
    return avatar
  }
  // 否则添加图片前缀
  return imgPrefix + avatar
}
</script>

<style scoped lang="scss">
.user-page {
  min-height: 100vh;
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

/* 用户中心内容 */
.user-section {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
}

.to-login {
  width: 100%;
  height: 560px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .login-tips {
    color: #666666;
    margin-bottom: 5px;
  }
}

.user-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-lg);
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

/* 左侧导航 */
.user-sidebar {
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.user-profile {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.avatar-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-sm);
  background-color: #eee;
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.1);
  }
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all var(--transition-fast);
  color: white;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.overlay-text {
  font-size: 12px;
}

.uploader-container {
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);
  background-color: var(--background-light);

  .avatar-uploader-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    transition: all var(--transition-fast);

    &:hover {
      transform: scale(1.1);
    }
  }
}

.profile-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.profile-email {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.user-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.user-nav .nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-nav .nav-item:hover,
.user-nav .nav-item.active {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

/* 右侧内容 */
.user-content {
  min-height: 500px;
}

.content-section {
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

/* 个人信息表单 */
.profile-form {
  max-width: 600px;
}

.form-control {
  width: 100%;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* 收藏列表 */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.favorite-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--spacing-md);
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  transition: all var(--transition-normal);
}

.favorite-card:hover {
  box-shadow: var(--shadow-sm);
}

.favorite-image {
  height: 120px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.favorite-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.favorite-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.5;
}

.favorite-info {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.favorite-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* 历史行程列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.history-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--spacing-md);
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  transition: all var(--transition-normal);
}

.history-card:hover {
  box-shadow: var(--shadow-sm);
}

.history-image {
  height: 120px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.history-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.history-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.history-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.5;
}

.history-info {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.history-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* 设置列表 */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.settings-item:hover {
  box-shadow: var(--shadow-sm);
}

.settings-label {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.btn-danger {
  background-color: #ff4d4f;
  color: white;
}

.btn-danger:hover {
  background-color: #cf1322;
}

/* 对话框 */
.dialog-footer {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.delete-warning {
  color: #ff4d4f;
  font-weight: var(--font-weight-medium);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-container {
    grid-template-columns: 1fr;
  }

  .user-sidebar {
    position: static;
  }

  .user-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .user-nav .nav-item {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }

  .favorite-card,
  .history-card {
    grid-template-columns: 1fr;
  }

  .favorite-image,
  .history-image {
    height: 200px;
  }
}

/* 头像弹窗样式 */
.avatar-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.avatar-preview-section h3,
.avatar-upload-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.avatar-preview-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.avatar-large-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--border-color);
}

.avatar-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.avatar-upload-section {
  border-top: 1px solid var(--border-color);
  padding-top: 24px;
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
</style>