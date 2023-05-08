<template>
  <section class="app-main">
    <div class="side-bar">
      <SideBar />
    </div>
    <div class="content" :class="{'show-content': breadList && breadList.length > 1}">
      <div v-if="breadList && breadList.length > 1" class="bread-list"><Breadcrumb /></div>
      <transition name="fade-transform" mode="out-in">
        <div style="height: calc(100% - 41px)">
          <keep-alive>
            <router-view v-if="$route.meta.title != '工作台'" :key="key" style="padding: 20px;background:#fff" />
          </keep-alive>
          <router-view v-if="$route.meta.title == '工作台'" :key="key" style="padding: 20px;background:#fff" />
        </div>
      </transition>
    </div>
    <loading v-if="loading" />
  </section>
</template>

<script>
import loading from './../../views/common/loading'
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from './Breadcrumb'
import SideBar from './Sidebar'
export default {
  name: 'AppMain',
  components: { loading, Breadcrumb, SideBar },
  computed: {
    key() {
      return this.$route.path
    },
    ...mapGetters([
      'loading'
    ]),
    ...mapState({
      breadList: state => state.bread.breadList
    })
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333333;
  display: flex;
  .side-bar {
    width: 15%;
    min-width: 200px;
  }
  .show-content {
    background: rgba(255,255,255,0.3);
  }
  .content{
    flex: 1;
    overflow: auto;
    box-shadow: 0 0 10px rgba(0,0,0,0.07);
     background: #fff;
    .bread-list{
      background: #fff;
      padding: 13px 10px;
      border-bottom: 1px solid #e2e2e2;
    }
  }
}
</style>

