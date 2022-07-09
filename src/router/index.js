import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '../views/layout/Layout'

Vue.use(VueRouter)

export const constantRouterMap = [
  { 
    path: '/login',
    component: () => import('views/login/index'),
    hidden: true       //不显示在侧栏
  },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('views/home/index'),
      meta: {title: '首页', icon: 'fa fa-home'}       //图标均来自font awesome
      //每个不隐藏的路由都应该有图标
    }]
  },

]

export const asyncRouterMap = [
  {
    path: '/sale',
    component: Layout,
    redirect: '/sale/chance',
    name: 'sale',
    meta: {title: '营销管理', icon: 'fa fa-street-view'},
    children: [{
        path: 'chance',
        name: 'chance',
        component: () => import('@/views/sale/chance/index'),
        meta: {title: '营销机会管理', icon: 'fa fa-object-ungroup'}
      },
      {
        path: 'devpla',   //custmer develop plan
        name: 'devpla',    
        component: () => import('@/views/sale/devpla/index'),
        meta: {title: '客户开发计划', icon: 'fa fa-calendar-plus-o'}
      },
      {
        path: 'pid',   //custmer develop plan
        name: 'pid',    
        component: () => import('@/views/sale/devpla/planItemDisplay'),
        meta: {title: '计划项数据显示', icon: 'fa fa-calendar-plus-o'}
      },
      {
        path: 'pim',   //custmer develop plan
        name: 'pim',    
        component: () => import('@/views/sale/devpla/planItemMaintain'),
        meta: {title: '计划项数据维护', icon: 'fa fa-calendar-plus-o'}
      },
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/info',
    name: 'customer',
    meta: {title: '客户管理', icon: 'fa fa-users'},
    children: [{
        path: 'info',
        name: 'info',
        component: () => import('@/views/customer/info/index'),
        meta: {title: '客户信息管理', icon: 'fa fa-pencil-square-o'}
      },
      {
        path: 'cuslos',    //customer loss
        name: 'cuslos',
        component: () => import('@/views/customer/cuslos/index'),
        meta: {title: '客户流失管理', icon: 'fa fa-user-times'} 
      },
      {
        path: 'reprieve',    //customer loss
        name: 'reprieve',
        component: () => import('@/views/customer/cuslos/reprieve'),
        meta: {title: '暂缓流失计划', icon: 'fa fa-user-times'} 
      },
      {
        path: 'order',    //customer loss
        name: 'order',
        component: () => import('@/views/customer/info/order'),
        meta: {title: '订单查看', icon: 'fa fa-user-times'} 
      },
      {
        path: 'linkman',    //customer loss
        name: 'linkman',
        component: () => import('@/views/customer/info/linkman'),
        meta: {title: '联系人管理', icon: 'fa fa-user-times'} 
      },
      {
        path: 'contact',    //customer loss
        name: 'contact',
        component: () => import('@/views/customer/info/contact'),
        meta: {title: '交往记录', icon: 'fa fa-user-times'} 
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    redirect: '/service/info',
    name: 'service',
    meta: {title: '服务管理', icon: 'fa fa-desktop'},
    children: [{
        path: 'build',   
        name: 'build',
        component: () => import('@/views/service/build/index'),
        meta: {title: '服务创建', icon: 'fa fa-tachometer'}
      },
      {
        path: 'assign',    //
        name: 'assign',
        component: () => import('@/views/service/assign/index'),
        meta: {title: '服务分配', icon: 'fa fa-tachometer'} 
      },
      {
        path: 'handle',    //
        name: 'handle',
        component: () => import('@/views/service/handle/index'),
        meta: {title: '服务处理', icon: 'fa fa-tachometer'} 
      },
      {
        path: 'fedbak',    //feedback
        name: 'fedbak',
        component: () => import('@/views/service/fedbak/index'),
        meta: {title: '服务反馈', icon: 'fa fa-tachometer'} 
      },
      {
        path: 'file',    //
        name: 'file',
        component: () => import('@/views/service/file/index'),
        meta: {title: '服务归档', icon: 'fa fa-tachometer'} 
      }
    ]
  },
  {
    path: '/stats',
    component: Layout,
    redirect: '/stats/contrib',
    name: 'stats',
    meta: {title: '统计报表', icon: 'fa fa-bar-chart'},
    children: [{
        path: 'contrib', //customer contribution analy
        name: 'contrib',
        component: () => import('@/views/stats/contrib/index'),   
        meta: {title: '客户贡献分析', icon: 'fa fa-tty'}
      },
      {
        path: 'struct',    //customer structure analy
        name: 'struct',
        component: () => import('@/views/stats/struct/index'),
        meta: {title: '客户构成分析', icon: 'fa fa-tachometer'} 
      },
      {
        path: 'serve',    //customer service analy
        name: 'serve',
        component: () => import('@/views/stats/serve/index'),
        meta: {title: '客户服务分析', icon: 'fa fa-tachometer'} 
      },
      {
        path: 'loss',    //
        name: 'loss',
        component: () => import('@/views/stats/loss/index'),
        meta: {title: '客户流失分析', icon: 'fa fa-tachometer'} 
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/info',
    name: 'setting',
    meta: {title: '系统设置', icon: 'fa fa-gears'},
    children: [{
        path: 'dict',
        name: 'dict',
        component: () => import('@/views/setting/dict/index'),   
        meta: {title: '字典管理', icon: 'fa fa-tty'}
      },
      {
        path: 'user',    //custmer loss
        name: 'user',
        component: () => import('@/views/setting/user/index'),
        meta: {title: '用户管理', icon: 'fa fa-user'} 
      },
      {
        path: 'role',    //custmer loss
        name: 'role',
        component: () => import('@/views/setting/role/index'),
        meta: {title: '角色管理', icon: 'fa fa-tachometer'} 
      },
      {
        path: 'menu',    //custmer loss
        name: 'menu',
        component: () => import('@/views/setting/menu/index'),
        meta: {title: '菜单管理', icon: 'fa fa-tachometer'} 
      }
    ]
  }
]


const router = new VueRouter({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export default router