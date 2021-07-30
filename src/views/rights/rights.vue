<template>
  <div class="rights">
    <vxe-table
      border
      resizable
      :align="allAlign"
      row-id="id"
      ref="XTable"
      :loading="loading2"
      :checkbox-config="{ labelField: 'name' }"
      :tree-config="{
        lazy: true,
        children: 'children',
        hasChild: 'hasChild',
        expandRowKeys: defaultExpandRowKeys,
        iconOpen: 'el-icon-remove-outline',
        iconClose: 'el-icon-circle-plus-outline',
      }"
      :data="tableData2"
    >
      <vxe-table-column
        field="authName"
        title="权限"
        tree-node
      ></vxe-table-column>
      <vxe-table-column field="path" title="路径"></vxe-table-column>
      <vxe-table-column field="pid" title="层级 Id">
        <template #default="{ row }">
          <span>{{ row.pid | pid }}</span>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import { getAllRights } from '@/api/rights';
export default {
  data() {
    return {
      allAlign: 'center',
      loading2: false,
      tableData2: [],
      defaultExpandRowKeys: [],
    };
  },
  filters: {
    pid: (val) => {
      if (val === 0) return (val = '一级');
      if (val > 3) return (val = '二级');
      if (Object.prototype.toString.call(val) === '[object String]')
        return (val = '三级');
      else return val;
    },
  },
  mounted() {
    setTimeout(() => {
      let pid = this.tableData2[0].children[0].children[0].pid;
      console.log(Object.prototype.toString.call(pid) === '[object String]');
    }, 500);
  },
  created() {
    this.loading2 = true;
    setTimeout(() => {
      this.loading2 = false;
      this.defaultExpandRowKeys = [0, 101];
      getAllRights('tree').then((res) => {
        this.tableData2 = res.data.data;
        // console.log(res);
      });
    }, 300);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.rights {
  height: 100%;
}
</style>
