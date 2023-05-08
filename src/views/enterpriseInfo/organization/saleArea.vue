<template>
  <!-- 区域设置 -->
  <div id="sale-area">
    <p><i style="font-size: 14px;color:#FE9900;margin-right: 5px;" class="el-icon-warning" />设置“{{ currentRow.name }}”经销商的销售区域，以便监控商品是否出现窜货！</p>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color:#333;font-weight: 600;font-size: 16px">选择区域</span>
      </div>
      <el-tree
        ref="areaTree"
        node-key="value"
        :render-content="renderContent"
        :highlight-current="true"
        :data="countryAreaTreeCH"
        :props="{ checkStrictly: true, label: 'label', value: 'value'}"
        show-checkbox
        :default-expand-all="false"
        @node-expand="nodeExpand"
        @check-change="handleCheckChange"
      />
    </el-card>
    <div class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      currentRow: {},
      loading: false,
      treeData: [],
      privileges: []
    }
  },
  computed: {
    ...mapGetters([
      'countryAreaTree'
    ]),
    countryAreaTreeCH() {
      return this.countryAreaTree.filter(item => item.areaName.indexOf('中国') > -1)[0].child
    }
  },
  activated() {
    this.currentRow = this.$route.query || {}
    this.getCheckArea()
    this.getAreaTree()
  },
  methods: {
    handleSubmit() {
      this.loading = true
      const params = {
        id: this.currentRow.id,
        areaIds: this.privileges
      }
      this.$backend.request(this.$api.enterprise.addOrganizationArea, params).then(res => {
        this.loading = false
        if (res.success) {
          this.$router.back()
        }
        this.$util.TipsUtils.message(res)
      })
    },
    close() {
      this.$refs.areaTree.setCheckedKeys([])
      this.loading = false
      this.$router.back()
    },
    nodeExpand() {
      this.$nextTick(() => {
        this.changeCss()
      })
    },
    getAreaTree() {
      this.treeData = this.$util.ObjectUtils.deepCopy(this.countryAreaTree) || []
      this.$nextTick(() => {
        this.changeCss()
      })
    },
    getCheckArea() {
      this.$backend.request(this.$api.enterprise.getOrganizationArea, { entOrgId: this.currentRow.id }).then(response => {
        if (response.success && response.data) {
          console.log(response.data)
          this.$nextTick(() => {
            this.$refs.areaTree.setCheckedKeys([])
            response.data.map((item, index) => {
              var node = this.$refs.areaTree.getNode(item.areaId)
              if (node && node.isLeaf) {
                this.$refs.areaTree.setChecked(node, true)
              }
            })
          })
        }
      })
    },
    // 树节点最后一级横向排列
    renderContent(h, { node, data, store }) { // 树节点的内容区的渲染 Function
      let classname = ''
      if (!data.children || (data.children && data.children.length === 0)) {
        classname = 'foo'
      }
      return h('p', { class: classname }, node.label)
    },
    // 样式修改
    changeCss() {
      var levelName = document.getElementsByClassName('foo') // levelname是上面的最底层节点的名字
      for (var i = 0; i < levelName.length; i++) {
        levelName[i].parentNode.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
        levelName[i].parentNode.style.styleFloat = 'left'
        levelName[i].parentNode.onmouseover = function() {
          this.style.backgroundColor = '#fff'
        }
      }
    },
    handleCheckChange() {
      this.privileges = []
      var arr = this.$refs.areaTree.getCheckedNodes()
      var brr = this.$refs.areaTree.getHalfCheckedKeys()// 半节点
      arr.map(item => {
        this.privileges.push(item.value)
      })
      brr.map(item => {
        this.privileges.push(item)
      })
      this.privileges = [...this.privileges]
    }
  }
}
</script>

<style lang="scss" scoped>
#sale-area {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    >p {
        padding: 10px;
        border: 1px solid#FFCA79;
        color: #FE9900;
        background: #FFF5E5;
        margin-bottom: 10px;
        flex-shrink: 0;
    }
    .el-card {
        flex: 1;
        overflow: hidden;
        overflow-y: auto;
        >>> .el-card__body {
            padding-bottom: 80px;
        }
    }
    .dialog-footer{
        display: flex;
        justify-content: flex-end;
        position: absolute;
        bottom: 0px;
        right: 20px;
        width: calc(100% - 40px);
        padding: 15px 20px 15px 20px;
        background: #fff;
        box-shadow: 0px -8px 10px 0 rgba(17,27,57,0.3);
        z-index: 99;
    }
}
</style>
