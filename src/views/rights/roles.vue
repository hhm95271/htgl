<template>
  <div class="roles">
    <vxe-modal
      v-model="showEdit"
      title="新增&角色"
      width="600"
      min-width="500"
      min-height="300"
      resize
      destroy-on-close
    >
      <template #default>
        <vxe-form
          :data="formData"
          :items="formItems"
          :rules="formRules"
          title-align="right"
          title-width="100"
          @submit="submitAddRoleEvent"
        ></vxe-form>
      </template>
    </vxe-modal>
    <vxe-toolbar ref="xToolbar1" custom>
      <template #buttons>
        <vxe-button
          @click="addRolesEventList"
          status="primary"
          round
          icon="el-icon-circle-plus"
          >添加角色</vxe-button
        >
      </template>
    </vxe-toolbar>
    <vxe-table
      border
      resizable
      keep-source
      ref="xTable"
      :data="tableData"
      :edit-config="{ trigger: 'manual', mode: 'row' }"
    >
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <!-- 展开行 -->
      <vxe-table-column type="expand" width="60">
        <template #content="{ row }">
          <span style="font-weight:800">权限说明:</span>
          <span v-if="row.children.length <= 0">暂无权限数据</span>
          <div
            class="child1"
            v-for="(item, index) in row.children"
            :key="index"
          >
            <el-tag class="elTag" type="success">{{ item.authName }}</el-tag>
            <div class="child2">
              <div
                class="child22"
                v-for="(item1, index1) in item.children"
                :key="index1"
              >
                <el-tag class="elTag1" type="info">{{ item1.authName }}</el-tag>
                <div
                  class="child3"
                  v-for="(item2, index2) in item1.children"
                  :key="index2"
                >
                  <el-tag class="elTag2">{{ item2.authName }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vxe-table-column>

      <vxe-table-column
        field="roleName"
        title="角色名称"
        :edit-render="{ name: 'input' }"
      ></vxe-table-column>
      <vxe-table-column
        field="roleDesc"
        title="角色描述"
        :edit-render="{ name: 'input' }"
      ></vxe-table-column>
      <!-- 操作 -->
      <vxe-table-column title="操作" width="200">
        <template #default="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button
              title="保存"
              icon="el-icon-check"
              status="primary"
              circle
              @click="saveRowEvent(row)"
            ></vxe-button>
          </template>
          <template v-else>
            <vxe-button
              title="编辑"
              circle
              icon="el-icon-edit-outline"
              @click="editRowEvent(row)"
            ></vxe-button>
          </template>
          <vxe-button
            icon="el-icon-delete-solid"
            title="删除"
            circle
            @click="removeRowEvent(row)"
          ></vxe-button>
          <vxe-button
            @click="settingRowEvent(row)"
            icon="el-icon-s-tools"
            title="设置"
            circle
          ></vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 状态树 -->

    <div class="tree">
      <el-dialog
        title="角色权限授权"
        :visible.sync="centerDialogVisible"
        width="30%"
      >
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          :default-expand-all="true"
          :default-checked-keys="roleTreeData"
          :props="defaultProps"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEventTree">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  EditSubmitRole,
  deleteRole,
  roleAuthorization,
  addListRole,
} from '@/api/roles';
import { getAllRights } from '@/api/rights';
export default {
  data() {
    return {
      formItems: [
        {
          title: '新增列表角色',
          span: 24,
          titleAlign: 'left',
          titleWidth: 200,
          titlePrefix: { icon: 'el-icon-user-solid' },
        },
        {
          field: 'roleName',
          title: '角色名称',
          span: 24,
          itemRender: {
            name: '$input',
            props: { placeholder: '请输入角色名称' },
          },
        },
        {
          field: 'roleDesc',
          title: '角色描述',
          span: 24,
          itemRender: {
            name: '$input',
            props: { placeholder: '请输入角色描述' },
          },
        },
        {
          align: 'center',
          span: 24,
          titleAlign: 'left',
          itemRender: {
            name: '$buttons',
            children: [
              { props: { type: 'submit', content: '提交', status: 'primary' } },
              { props: { type: 'reset', content: '重置' } },
            ],
          },
        },
      ],
      formRules: {
        roleName: [{ required: true, message: '请输入角色名称' }],
        roleDesc: [{ required: true, message: '请输入角色描述' }],
      },
      formData: {
        roleName: '',
        roleDesc: '',
      },
      showEdit: false,
      centerDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      // 树形控件的默认权限树
      treeData: [],
      // 当前角色所拥有的权限树
      roleTreeData: [],
      tableData: [],
      roleId: null,
    };
  },
  created() {
    setTimeout(() => {
      this.getRoles();
    }, 300);
  },
  methods: {
    // 新增角色提交
    async submitAddRoleEvent() {
      console.log(this.formData);
      let res = await addListRole(this.formData);
      console.log(res);
      if (res.data.meta.status === 201) {
        setTimeout(() => {
          this.$message.success('创建角色成功');
          this.showEdit = false;
          this.getRoles();
        }, 300);
      } else {
        this.$message.warning('创建角色失败');
        this.showEdit = false;
      }
    },
    // 新增角色对话框弹出
    addRolesEventList() {
      this.showEdit = true;
    },
    // 提交状态树
    async submitEventTree() {
      var arr = this.$refs.tree.getCheckedNodes();
      let temp = [];
      arr.forEach((e) => {
        temp.push(e.id + ',' + e.pid);
      });
      // console.log(temp);
      let tempstr = temp.join(',');
      let temparr = tempstr.split(',');
      // console.log(temparr);
      let finalarr = [...new Set(temparr)];
      let res = await roleAuthorization(this.roleId, finalarr.join(','));
      if (res.data.meta.status === 200) {
        this.centerDialogVisible = false;
        this.getRoles();
        this.$message.success('更新成功');
      } else {
        this.$message.warning('更新失败');
        this.centerDialogVisible = false;
      }
    },
    // 获取数据,获取树形控件所需数据
    getRoles() {
      getRoleList().then((res) => {
        this.tableData = res.data.data;
      });
    },
    // 打开角色授权设置
    async settingRowEvent(row) {
      console.log(row, 'setting');
      this.centerDialogVisible = true;
      // 每次拿数据时，先将之前的数据清除
      let res = await getAllRights('tree');
      this.treeData = res.data.data;
      this.roleTreeData.length = 0;
      // 获取当前角色id
      this.roleId = row.id;
      if (row.children && row.children.length > 0) {
        row.children.forEach((e) => {
          if (e.children && e.children.length > 0) {
            e.children.forEach((i) => {
              this.roleTreeData.push(i.id);
            });
          }
        });
      }
    },
    // 移除角色
    removeRowEvent(row) {
      this.$confirm('是否永久删除角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteRole(row.id).then((res) => {
            if (res.data.meta.status === 200) {
              this.$message.success('删除角色成功');
              this.getRoles();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 提交
    saveRowEvent(row) {
      const $xTable = this.$refs.xTable;
      let { updateRecords } = $xTable.getRecordset();
      $xTable.clearActived().then(() => {
        if (updateRecords.length > 0) {
          if (row.roleDesc !== '' && row.roleName !== '') {
            let data = {
              id: row.id,
              roleName: row.roleName,
              roleDesc: row.roleDesc,
            };
            EditSubmitRole(data).then((res) => {
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.data.roleName + `编辑成功`);
              }
            });
          } else {
            this.$message.warning('不能提交空信息！');
            return this.getRoles();
          }
        }
      });
    },
    // 打开编辑行
    editRowEvent(row) {
      const $xTable = this.$refs.xTable;
      $xTable.setActiveRow(row);
    },
  },
};
</script>

<style lang="less" scoped>
.child1 {
  display: flex;
  flex-direction: row;
  padding: 10px 0;
  border-bottom: 2px dashed #ccc;
  .elTag {
    margin-right: 60px;
  }
  .child2 {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .elTag1 {
      margin-right: 60px;
    }
    .child22 {
      display: flex;
      margin-bottom: 10px;
      .elTag2 {
        margin-right: 10px;
      }
    }
  }
}
</style>
