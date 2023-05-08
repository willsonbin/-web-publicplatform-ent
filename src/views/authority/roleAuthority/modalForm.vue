<template>
  <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" label-width="110px" label-position="top" style="margin: 0 10px">
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="basicForm.name" placeholder="请输入" maxlength="30" clearable style="width:50%" />
    </el-form-item>
    <el-form-item label="角色描述" prop="remarks">
      <el-input v-model="basicForm.remarks" type="textarea" maxlength="200" placeholder="请输入" clearable />
    </el-form-item>
    <el-form-item label="角色状态" prop="status">
      <el-switch
        v-model="basicForm.status"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="权限地图" prop="permission">
      <div class="permissionWrap">
        <div class="permissionHeader">
          <span><el-checkbox v-model="checkedAll" @change="selectedAll">批量全选</el-checkbox></span>
          <DebounceInput v-model="searchFuntionName" placeholder="请输入功能名称" clearable style="width: 218px !important; margin-left:12px" />
          <span class="counter">已选<b>{{ privileges.length > 0 ? privileges.length : 0 }}</b>个权限</span>
        </div>
        <div class="treeContent">
          <el-tree
            ref="roleTree"
            class="right-role-tree"
            node-key="id"
            :render-content="renderContent"
            :highlight-current="true"
            :data="treeData"
            :props="{ checkStrictly: true,label:'name',children:'children'}"
            show-checkbox
            :default-expand-all="false"
            :filter-node-method="filterNode"
            @node-expand="nodeExpand"
            @check-change="handleCheckChange"
          />
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import string from '@/utils/string'
export default {
  name: 'ModalForm',
  props: { undefined, roleid: { type: string, default: null }},
  data() {
    return {
      checkedAll: false,
      basicForm: {
        name: '',
        remarks: '',
        type: 1,
        status: 1,
        id: ''
      },
      basicFormRules: {
        name: [{ required: true, message: '请输入必填项', trigger: ['blur', 'change'] }
        ]
      },
      formType: 1, // 1新增，2编辑，3查看
      treeData: [], // 权限数结构
      privileges: [],
      searchFuntionName: '',
      menuLength: 0
    }
  },
  watch: {
    formType(newVal) {
      this.formType = newVal
    },
    searchFuntionName(val) {
      this.$refs.roleTree.filter(val)
    }
  },
  created() {
    // 获取角色菜单权限
    this.getPermissionTree()
  },
  methods: {
    nodeExpand() {
      this.$nextTick(() => {
        this.changeCss()
      })
    },
    // 批量全选
    selectedAll(val) {
      this.checkedAll = val
      if (val) {
        this.$nextTick(() => {
          this.$refs.roleTree.setCheckedNodes(this.treeData)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.roleTree.setCheckedNodes([])
        })
      }
    },
    filterNode(value, data, node) {
      if (!value) return true
      const arr = []
      this.getReturnNode(node, arr, value)
      return arr.includes(true)
    },
    // 模糊查询数据处理
    getReturnNode(node, arr, value) {
      const isPass =
        node.data &&
        node.data.name &&
        (node.data.name.indexOf(value.toUpperCase()) !== -1 ||
          node.data.name.indexOf(value.toLowerCase()) !== -1)
      if (isPass) {
        arr.push(isPass)
      }
      if (!isPass && node.level !== 1 && node.parent) {
        this.getReturnNode(node.parent, arr, value)
      }
    },
    getRolePermission(id) {
      // 获取角色的权限
      this.$backend.request(this.$api.roleAuthority.getRoleInfo, id).then((response) => {
        if (response.success) {
          // const newArr = []
          this.$nextTick(() => {
            this.$refs.roleTree.setCheckedKeys([])
            response.data.rolePrivileges.map((item, index) => {
              var node = this.$refs.roleTree.getNode(item.privilegeId)
              if (node && node.isLeaf) {
                this.$refs.roleTree.setChecked(node, true)
                if (this.menuLength === response.data.length) {
                  this.checkedAll = true
                } else {
                  this.checkedAll = false
                }
              }
            })
          })
        }
      })
    },
    getPermissionTree() {
      // 根据角色类型获取权限树
      this.$backend.request(this.$api.roleAuthority.getPermissionTree, { orgType: 1 }).then((response) => {
        if (response.success && response.data && response.data.menuTree) {
          this.treeData = response.data.menuTree.children || []
          this.menuLength = this.readNodes(response.data.menuTree.children)
        } else {
          this.treeData = []
        }
        this.$nextTick(() => {
          this.changeCss()
        })
      })
    },
    readNodes(nodes = [], arr = []) {
      for (const item of nodes) {
        arr.push(item.id)
        if (item.children) {
          this.readNodes(item.children, arr)
        }
      }
      return arr.length
    },
    // 点击右侧权限树节点
    handleCheckChange() {
      this.privileges = []
      var arr = this.$refs.roleTree.getCheckedNodes()
      var brr = this.$refs.roleTree.getHalfCheckedKeys()// 半节点
      arr.map(item => {
        this.privileges.push(item.id)
      })
      brr.map(item => {
        this.privileges.push(item)
      })
      this.privileges = [...this.privileges]
      if (this.menuLength === this.privileges.length) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
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
    // 树节点最后一级横向排列
    renderContent(h, { node, data, store }) { // 树节点的内容区的渲染 Function
      let classname = ''
      if (!data.children || (data.children && data.children.length === 0)) {
        classname = 'foo'
      }
      return h(
        'p',
        {
          class: classname
        },
        node.label
      )
    },
    close() {
      this.initData()
      this.clear()
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['basicForm'] && this.$refs['basicForm'].clearValidate()
      })
    },
    initData() {
      for (const item in this.basicForm) {
        this.basicForm[item] = ''
      }
    },
    // 点击编辑时获取角色权限
    getRoleId(id) {
      let curId = ''
      curId = id
      this.basicForm.id = curId
      setTimeout(() => {
        this.getRolePermission(id)
      }, 700)
    },
    submit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          let url
          // 新增
          if (this.formType === 1) {
            url = this.$api.roleAuthority.addRole
          } else if (this.formType === 2) {
            url = this.$api.roleAuthority.editRole
          }
          const param = {
            name: this.basicForm.name,
            type: this.basicForm.type,
            remarks: this.basicForm.remarks,
            status: this.basicForm.status,
            privileges: this.privileges,
            id: this.basicForm.id || ''
          }
          this.$backend.request(url, param).then((response) => {
            if (response.success) {
              this.$emit('handleSubmit')
              this.close()
            }
            this.$util.TipsUtils.message(response)
          })
        } else {
          this.$emit('error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-input{
  >>>.el-form-item__content{
      border: 1px solid #DCDFE6;
      // box-sizing: border-box;
      height: 44px;
      .el-switch{
          margin-left: 15px;
      }
  }
}
.permissionHeader{
  background: #dee7f7;
  border: 1px solid #dcdfe6;
  display: flex;
  padding: 0px 10px;
  .counter {
    width: 42%;
    text-align: right;
  }
}
>>> .el-form-item .el-input--medium .el-input__inner {
  width: 100% !important;
 }
 >>> .el-form-item--medium .el-form-item__label {
   font-weight: normal !important;
 }
 .treeContent{
   height: 400px;
   overflow-y: auto;
   border: 1px solid #dcdfe6;
   border-top: none;
 }
 >>> .el-form--label-top .el-form-item__label{
   padding: 0px !important;
 }
 >>> .el-form-item__error{
   position: unset;
   margin-top: 0px;
 }
 >>>.el-tree-node__content{
   padding: 20px;
 }
 >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  position: unset;
}
</style>
