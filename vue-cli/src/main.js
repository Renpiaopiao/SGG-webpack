import {createApp} from "vue"
import App from './App'
import router from './router'
// import Element from 'element-plus'
// import "element-plus/dist/index.css"

createApp(App).use(router).mount(document.getElementById("app"))