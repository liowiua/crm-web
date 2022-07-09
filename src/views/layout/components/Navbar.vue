<template>
  <el-menu class="navbar" mode="horizontal"><!-- el-icon-s-fold   fa fa-outdent-->
    <div class="fold-container">
      <i class="fa fa-outdent fold" 
      :class="{'is-active':sidebar.opened}"
      @click="toggleSideBar"
      ></i>
    </div>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  date(){
    return {
      isActive: false
    }
  },
  components: {
    Breadcrumb,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .fold-container {
    font-size: 15px;
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
    position: relative;
    top: -3px;
    .fold {
      display: inline-block;
      cursor: pointer;
      transform: rotate(180deg);
      transition: .76s;
      transform-origin: 50% 48%;
    }
    .fold.is-active {
      transform: rotate(0deg);
    }
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}


</style>

