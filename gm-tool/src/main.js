import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerLinkifyDirective } from './directives/linkify'

const app = createApp(App)

// Register v-linkify directive globally
registerLinkifyDirective(app)

app.mount('#app')
