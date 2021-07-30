<template>
  <div class="categories">
    <el-button style="margin:10px;0" type="primary" plain>添加分类</el-button>
    <vxe-table
      border
      resizable
      show-overflow
      keep-source
      ref="xTree"
      :loading="loading"
      :edit-config="{ trigger: 'default' }"
      :tree-config="{
        lazy: true,
        children: 'children',
      }"
      :data="tableData"
      :highlight-current-row="true"
    >
      >
      <vxe-table-column field="cat_id" width="60"></vxe-table-column>
      <vxe-table-column
        tree-node
        field="cat_name"
        title="名称"
      ></vxe-table-column>
      <vxe-table-column
        formatter="myAmount"
        field="cat_deleted"
        title="状态"
      ></vxe-table-column>
      <vxe-table-column
        formatter="myAmount1"
        field="cat_level"
        title="层级"
      ></vxe-table-column>
      <vxe-table-column field="" title="操作">
        <template #default="{ row }">
          <template v-if="row.cat_level === 2">
            <el-button
              @click="editEvent(row)"
              class="el-icon-edit-outline"
            ></el-button>
            <el-button
              @click="removeEvent(row)"
              class="el-icon-delete-solid"
            ></el-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>

    <el-dialog title="编辑分类" :visible.sync="rowDialogFormVisible">
      <el-form :model="row">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="row.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类id" label-width="120px">
          <el-input disabled v-model="row.cat_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类状态" label-width="120px">
          <el-switch v-model="row.cat_deleted" disabled></el-switch>
        </el-form-item>
        <el-form-item label="分类层级" label-width="120px">
          <el-input
            disabled
            v-model="row.cat_level"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rowDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialogForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  allCategoriesData,
  exitCategories,
  deleteCategories,
} from '../../api/categories';
import VXETable from 'vxe-table';
VXETable.formats.add('myAmount1', (event) => {
  return event.row.cat_level + 1;
});
VXETable.formats.add('myAmount', (params) => {
  if (params.row.cat_deleted === false) {
    var res = '在售';
    return res;
  }
});

export default {
  data() {
    return {
      rowDialogFormVisible: false,
      row: {},
      loading: false,
      // 编辑时,当前的分类选项
      currentPage: {},
      tableData: [],
    };
  },
  methods: {
    // 编辑完成提交
    submitDialogForm() {
      let { cat_id } = this.row;
      exitCategories(cat_id, this.row).then((res) => {
        if (res.data.meta.status === 200) {
          this.rowDialogFormVisible = false;
          this.getInfoCategories();
          this.$message.success(res.data.meta.msg);
        }
      });
    },
    // 打开编辑
    editEvent(row) {
      row.cat_deleted = true;
      row.cat_level++;
      this.row = row;
      this.rowDialogFormVisible = true;
    },
    // 删除
    removeEvent(row) {
      let { cat_id } = row;
      deleteCategories(cat_id).then((res) => {
        ////categories.vue
        this.$confirm('永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$message.warning(res.data.meta.msg);
            this.rowDialogFormVisible = false;
            this.getInfoCategories();
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          })
          .catch(() => {
            this.rowDialogFormVisible = false;
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      });
    },
    // 获取分类初始数据
    getInfoCategories() {
      allCategoriesData().then((res) => {
        this.tableData = res.data.data;
      });
    },
  },
  mounted() {
    this.getInfoCategories();
  },
};
</script>

<style lang="less" scoped></style>
