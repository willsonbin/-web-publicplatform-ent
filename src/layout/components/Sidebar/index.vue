<template>
  <!-- style="box-shadow: 0 0 10px rgba(0,0,0,0.07);" -->
  <div class="scrollbar">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <p class="scrollbar-wrapper-title">服务导航</p>
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpenedsArray"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
      <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
// import Hamburger from '@/components/Hamburger'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data() {
    return {
      defaultOpenedsArray: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return false
    }
  },
  watch: {
    $route: {
      handler(newRouter) {
        if (newRouter.name === 'Dashboard') {
          this.defaultOpenedsArray = []
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.scrollbar {
  height: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.07);
  margin-right: 20px;
  overflow: hidden;
  overflow-y: auto;
}
.scrollbar-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  color: #333333;
  background: #fff;
  display: flex;
  .scrollbar-wrapper-title{
    height: 42px;
    line-height: 42px;
    font-size: 16px;
    padding: 0 20px;
    color: #333;
    background: #fff;
    border-bottom: 1px solid #E2E2E2 ;
    font-family: SourceHanSansCN-Regular;
  }
}
</style>
<style lang="scss">
.el-menu {
  border-right: none;
}
</style>
