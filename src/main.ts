import '@/assets/styles/index.scss'
import 'tiktime-ui/index.css'
import 'virtual:uno.css'
import { MotionPlugin } from '@vueuse/motion'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router).use(MotionPlugin)

app.mount('#app')
