<template>
  <div class="tableCellRender">
    <!-- array -->
    <div v-if="type=='array'">
      <div
        v-if="cellData[field] && cellData[field].length > 1"
        class="list-arrays"
      >
        <span class="list-left">{{ cellData[field][0][keyField] }}</span>
        <el-tooltip class="list-right" effect="light" placement="top-start" style="cursor: pointer;">
          <i class="el-icon-caret-bottom" style="color:#999" />
          <ul slot="content" style="min-width:60px">
            <li v-for="(item, index) in cellData[field]" v-show="item[keyField]" :key="index" style="font-size:14px;color:#606266;line-height:20px;">{{ item[keyField] }}</li>
          </ul>
        </el-tooltip>
      </div>
      <tableCellRender v-else-if="cellData[field] && cellData[field].length === 1" :cell-data="cellData[field][0]" :field="keyField" type="string" />
    </div>
    <div v-else-if="type=='arrays'">
      <div
        v-if="cellData[field] && cellData[field].length > 1"
        class="list-arrays"
      >
        <!--  class="flex-space-between-center" -->
        <span class="list-left">{{ cellData[field][0] }}</span>
        <el-tooltip class="list-right" effect="light" placement="top-start" style="cursor: pointer;">
          <i class="el-icon-caret-bottom" style="color:#999" />
          <ul slot="content" style="min-width:60px">
            <li v-for="(item, index) in cellData[field]" v-show="item" :key="index" style="font-size:14px;color:#606266;line-height:20px;">{{ item }}</li>
          </ul>
        </el-tooltip>
      </div>
      <tableCellRender v-else-if="cellData[field] && cellData[field].length === 1" :cell-data="cellData[field]" :field="'0'" type="string" />
    </div>
    <!-- string -->
    <div v-else-if="type=='string'" ref="popovers" class="str-popovers">
      <el-popover v-if="isOverFlow" placement="top-start" trigger="hover" :content="cellData[field]" :close-delay="0" class="str-popovers">
        <span slot="reference" class="str-popovers">{{ cellData[field] }}</span>
      </el-popover>
      <span v-else>{{ cellData[field] }}</span>
      <span ref="reference" style="visibility:hidden;position:fixed;top:0;left:0;">{{ cellData[field] }}</span>
    </div>
    <!-- list-array -->
    <div v-else-if="type=='list-array'">
      <div
        v-if="cellData[field] && cellData[field].indexOf(mark)>-1"
        class="list-arrays"
      >
        <span class="list-left">{{ cellData[field].split(mark)[0] }}</span>
        <el-tooltip class="list-right" effect="light" placement="top-start" style="cursor: pointer;">
          <i class="el-icon-caret-bottom" />
          <ul slot="content">
            <li v-for="(item, index) in cellData[field].split(mark)" v-show="item" :key="index">{{ item }}</li>
          </ul>
        </el-tooltip>
      </div>
      <tableCellRender v-else :cell-data="cellData" :field="field" type="string" />
    </div>
    <!-- else -->
    <div v-else>
      <div
        v-if="cellData[field].length > 10"
      >
        <span>{{ cellData[field].substring(0, 10) }}</span>
        <el-tooltip class="item" effect="light" :content="cellData[field]" placement="top" style="cursor: pointer;">
          <i class="el-icon-caret-bottom" />
        </el-tooltip>
      </div>
      <div v-else style="text-align:left">{{ cellData[field] }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableCellRender',
  props: ['cellData', 'field', 'type', 'keyField', 'mark'],
  data() {
    return {
      isOverFlow: true
    }
  },
  updated() {
    this.handlerParams()
  },
  mounted() {
    this.handlerParams()
  },
  methods: {
    // 数据处理
    handlerParams() {
      if (this.type === 'string') {
        this.$nextTick(() => {
          const backWidth = this.$refs.popovers.offsetWidth
          const countWidth = this.$refs.reference.offsetWidth
          if (countWidth >= backWidth * 2 - 2) {
            this.isOverFlow = true
          } else {
            this.isOverFlow = false
          }
        })
      }
      if (this.type === 'array') {
        var arr = this.cellData[this.field]
        var brr = []
        if (arr && arr.length > 0) {
        // 去重及非空处理
          arr.forEach((item, index) => {
            if (!item[this.keyField]) {
              this.cellData[this.field].splice(index, 1)
              index--
            } else {
              var _index = brr.findIndex(ele => {
                return ele[this.keyField] === item[this.keyField]
              })
              if (_index > -1) {
                this.cellData[this.field].splice(index, 1)
                index--
              } else {
                brr.push(item)
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-icon-caret-bottom:hover{
  color:#333 !important
}
.tableCellRender{
  .list-arrays{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .list-left{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .list-array{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .str-popovers{
    // display: block;
    width: 100%;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 这里是超出几行省略 */
    overflow: hidden;
  }
}
</style>
