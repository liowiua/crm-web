import Vue from 'vue'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import { VePie } from 'v-charts'
import VeBar from 'v-charts/lib/bar.common'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css';




import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.scss' // global css
import '@/permission' // permission control

Vue.use(ElementUI)
Vue.component(VeLine.name, VeLine)
Vue.component(VeBar.name, VeBar)
Vue.component(VeHistogram.name, VeHistogram)
Vue.component(VePie.name, VePie)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
