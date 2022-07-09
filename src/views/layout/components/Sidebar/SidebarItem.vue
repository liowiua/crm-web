<template>
  <div class="menu-wrapper">
    <template v-for="(item) in activeRoutes">

      <router-link v-if="singleChild(item.children) && !item.children[0].children&&!item.alwaysShow" 
        :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" 
          :class="{'submenu-title-noDropdown':!isNest}">
          <!-- <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon> -->
            <i class="fa fa-home"></i>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" 
            slot="title">{{item.children[0].meta.title}}
          </span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in activechildren(item)">
          <sidebar-item 
            :is-nest="true" 
            class="nest-menu" 
            v-if="child.children&&child.children.length>0" 
            :routes="[child]" :key="child.path">
          </sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <i v-if="child.meta&&child.meta.icon" :class="child.meta.icon"></i>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  computed: {

    activeRoutes() {
      return this.routes.filter((route) => {
        return !route.hidden&&route.children;
      })
    },

  },
  methods: {
    activechildren(obj){    //二重嵌套不能放在for里面  obj一级路由
      const t_arr = obj.children.filter(item => {return !item.hidden});
      return t_arr;
    },
    singleChild(children) {
      const displayedChildren = children.filter(item => {
        return !item.hidden
      })
      return displayedChildren.length === 1;
    }
  },
  created() {
  }
}
</script>
