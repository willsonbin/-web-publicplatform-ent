<template>
  <div id="tags-view-container" class="tags-view-container">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <scroll-pane id="tags-view-wrapper" ref="scrollPane" class="tags-view-wrapper" :class="{'show-tags-wrapper':showTabsBtn}">
      <div v-if="showTabsBtn" id="st-tabs-prev" @click.stop="tabsContentLeft">
        <i class="el-icon-arrow-left" aria-hidden="true" />
      </div>
      <div v-if="showTabsBtn" id="st-tabs-next" @click.stop="tabsContentRight">
        <i class="el-icon-arrow-right" aria-hidden="true" />
      </div>
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ generateTitle(tag.title) }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <!--<li @click="refreshSelectedTag(selectedTag)">{{ $t('tagsView.refresh') }}</li>-->
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
// import Hamburger from '@/components/Hamburger'
import { generateTitle } from '@/utils/i18n'
import path from 'path'
import { mapGetters, mapState } from 'vuex'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      showTabsBtn: false,
      disableTabsLBtn: false,
      disableTabsRBtn: false,
      tabsWidth: 0
    }
  },
  computed: {
    ...mapState({
      sidebarOpen: state => state.app.sidebar.opened
    }),
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    },
    scrollWrapper() {
      // return this.$refs.scrollPane.$refs.wrap
      return this.$refs.scrollPane.$refs.scrollContainer.wrap
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    sidebarOpen: {
      handler(val) {
        if (val) {
          this.tabsWidth = document.body.offsetWidth - 260
        } else {
          this.tabsWidth = document.body.offsetWidth - 100
        }
        this.isShowTabsBtn()
      },
      immediate: true
    }
    // scrollWrapper:{
    //   handler(val){
    //     if(val.scrollLeft && val.scrollLeft===0){
    //        this.disableTabsLBtn = true
    //     }else{
    //        this.disableTabsLBtn = false
    //     }
    //   },
    //    immediate:true
    // }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        that.tabsWidth = document.getElementById('tags-view-wrapper') && document.getElementById('tags-view-wrapper').offsetWidth ? document.getElementById('tags-view-wrapper').offsetWidth : 0
        that.isShowTabsBtn()
      })()
    }
    this.tabsWidth = document.getElementById('tags-view-wrapper') && document.getElementById('tags-view-wrapper').offsetWidth ? document.getElementById('tags-view-wrapper').offsetWidth : 0
    this.initTags()
    this.addTags()
  },
  methods: {
    tabsContentRight(e) {
      this.scrollWrapper.scrollLeft = this.scrollWrapper.scrollLeft + 220
    },
    tabsContentLeft(e) {
      if (this.scrollWrapper.scrollLeft > 0) {
        this.scrollWrapper.scrollLeft = this.scrollWrapper.scrollLeft - 220
      }
    },
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      this.isShowTabsBtn()
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    isShowTabsBtn() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (!tags) {
          return
        }
        var totalWidth = 30
        tags.map(item => {
          totalWidth += item.$el.offsetWidth + 5
        })
        if (totalWidth >= this.tabsWidth) {
          this.showTabsBtn = true
        } else {
          this.showTabsBtn = false
        }
      })
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
        this.isShowTabsBtn()
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      // console.log(visitedViews.slice(-1))
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      console.log(e.clientY)
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 80
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #fff;
  display: flex;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 28px;
      line-height: 28px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding:0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 6px;
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
          background-color: rgb(37,90,165);
        /*background-color: #42b983;*/
        color: #fff;
        /*border-color: #42b983;*/
          border-color: rgb(37,90,165);
        // &::before {
        //   content: '';
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .show-tags-wrapper{
     .tags-view-item {
        &:first-of-type {
        margin-left: 25px;
      }
      &:last-of-type {
        margin-right: 45px;
      }
     }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
    #st-tabs-prev{
    width:20px;
    height:28px;
    line-height: 28px;
    position: absolute;
    top:6px;
    left:0;
    z-index:99;
    background: #fff;
     border:1px solid #d8dce5;
    cursor: pointer;
  }
  #st-tabs-next{
    top:6px;
    width:20px;
    height:28px;
    line-height: 28px;
    position: absolute;
    right:0;
    z-index:99;
    background: #fff;
     border:1px solid #d8dce5;
    cursor: pointer;
  }
  .isDisabled i{
    color: #ddd;
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  position: relative;
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        font-size: 16px;
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
