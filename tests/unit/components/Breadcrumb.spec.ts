import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import i18n from '@/lang' // Internationalization

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ElementUI, {
  i18n: (key: string, value: string) => i18n.t(key, value)
})

const routes = [
  {
    path: '/',
    name: 'home',
    children: [{
      path: 'dashboard',
      name: 'dashboard'
    }]
  }
]

const router = new VueRouter({
  routes
})

const wrapper = mount(Breadcrumb, {
  localVue,
  router,
  mocks: {
    $t: (msg: string) => msg
  }
})

describe('Breadcrumb.vue', () => {
  it('dashboard', async() => {
    router.push('/dashboard')
    await wrapper.vm.$nextTick()
    const len = wrapper.findAll('.el-breadcrumb__item').length
    expect(len).toBe(1)
  })
})
