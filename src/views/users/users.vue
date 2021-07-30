<template>
  <div class="users">
    <vxe-grid
      :toolbar-config="gridOptions.tableToolbar"
      ref="xGrid"
      v-bind="gridOptions"
      @edit-closed="editClosedEvent"
      @page-change="handlePageChange"
      @toolbar-button-click="toolbarButtonClickEvent"
    >
      <template #state="{row}">
        <vxe-switch
          @change="statusSwitchingInstruction(row)"
          open-label="开启"
          close-label="关闭"
          v-model="row.mg_state"
        ></vxe-switch>
      </template>
      <template #operate="{ row }">
        <template v-if="$refs.xGrid.isActiveByRow(row)">
          <vxe-button
            icon="el-icon-check"
            status="primary"
            title="保存"
            circle
            @click="saveRowEvent(row)"
          ></vxe-button>
        </template>
        <template v-else>
          <vxe-button
            icon="el-icon-edit-outline"
            title="编辑"
            circle
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
    </vxe-grid>
    <!-- 设置分配角色菜单 -->
    <el-dialog width="400px" title="分配角色" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名:" label-width="70px">
          <span>{{ form.username }}</span>
        </el-form-item>
        <el-form-item label="角色:" label-width="70px">
          <el-select v-model="form.rid" placeholder="角色授权">
            <el-option
              v-for="i in allOptions"
              :key="i.id"
              :label="i.roleName"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色表单 -->
    <vxe-modal
      v-model="showEdit"
      title=" 新增&保存"
      width="600"
      min-width="600"
      min-height="300"
      resize
      destroy-on-close
    >
      <vxe-form
        :data="addFormData"
        :items="formItems"
        :rules="formRules"
        title-align="right"
        title-width="100"
        @submit="submitEvent"
      >
        <template #addform>
          <vxe-form-item>
            <vxe-button type="submit">确认</vxe-button>
            <vxe-button type="reset">重置</vxe-button>
          </vxe-form-item>
        </template>
      </vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
import {
  getAllUsers,
  modificationState,
  editSubmission,
  deleteRowUsers,
  getRoles,
  allocationUser,
  netLocalgourp,
} from '../../api/users';
export default {
  data() {
    return {
      formRules: {
        username: [{ required: true, message: '用户名必须填写' }],
        password: [{ required: true, message: '密码必须填写' }],
        mobile: [
          {
            required: true,
            message: '请填写正确的手机号',
            pattern: /^1[3-9][0-9]\d{8}$/,
          },
        ],
        email: [
          {
            required: true,
            message: '请填写正确的email',
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          },
        ],
      },
      formItems: [
        {
          title: '添加用户',
          span: 24,
          titleAlign: 'left',
          titleWidth: 200,
          titlePrefix: { icon: 'el-icon-user-solid' },
        },
        {
          field: 'username',
          title: '用户名',
          span: 24,
          itemRender: { name: '$input', props: { placeholder: '请输入名称' } },
        },
        {
          field: 'password',
          title: '密码',
          span: 24,
          itemRender: { name: '$input', props: { placeholder: '请输入密码' } },
        },
        {
          field: 'email',
          title: 'email',
          span: 24,
          itemRender: { name: '$input', props: { placeholder: '请输入email' } },
        },
        {
          field: 'mobile',
          title: '手机号',
          span: 24,
          itemRender: {
            name: '$input',
            props: { placeholder: '请输入手机' },
          },
        },
        {
          align: 'center',
          span: 18,
          slots: { default: 'addform' },
        },
      ],
      addFormData: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      showEdit: false,
      allOptions: [],
      dialogFormVisible: false,
      form: {},
      gridOptions: {
        border: true,
        resizable: true,
        keepSource: true,
        showOverflow: true,
        height: 530,
        loading: false,
        pagerConfig: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 50],
        },
        tableToolbar: {
          buttons: [
            {
              code: 'myInsert',
              icon: 'el-icon-user-solid',
              name: '新增用户',
              status: 'success',
            },
          ],
          zoom: true,
          custom: true,
        },
        editConfig: {
          // 设置触发编辑为手动模式
          trigger: 'manual',
          // 设置为整行编辑模式
          mode: 'row',
          // 显示修改状态和新增状态
          showStatus: true,
          // 自定义可编辑列头的图标
          icon: 'el-icon-edit',
        },
        columns: [
          { type: 'seq', width: 60 },
          { field: 'username', title: '用户名', editRender: { name: 'input' } },
          {
            field: 'mobile',
            title: '电话号码',
            editRender: { name: 'input' },
          },
          { field: 'email', title: 'email', editRender: { name: 'input' } },
          {
            title: '用户状态',
            width: 200,
            slots: { default: 'state' },
          },
          { title: '操作', width: 200, slots: { default: 'operate' } },
        ],

        data: [],
      },
    };
  },
  created() {
    setTimeout(() => {
      this.findList();
      this.getOptions();
    }, 300);
  },
  mounted() {},
  methods: {
    // 添加用户
    async submitEvent() {
      let res = await netLocalgourp(this.addFormData);
      if (res.data.meta.status === 201) {
        this.$message.success(res.data.meta.msg);
        this.showEdit = false;
        this.findList();
      } else {
        this.$message.warning('暂无权限');
        this.showEdit = false;
      }
    },
    // 获取options
    getOptions() {
      getRoles().then((res) => {
        this.allOptions = res.data.data;
      });
    },
    // 选择tableToolbar的按钮
    toolbarButtonClickEvent({ code }) {
      switch (code) {
        case 'myInsert': {
          this.showEdit = true;
        }
      }
    },
    // 设置角色授权
    async submitRole() {
      if (!this.form.rid) {
        this.$message.warning('请选择一个角色');
      } else {
        let res = await allocationUser(this.form);
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg);
          this.dialogFormVisible = false;
          this.findList();
        }
      }
    },
    // 设置用户可用角色
    settingRowEvent(row) {
      this.dialogFormVisible = true;
      this.form = {
        id: row.id,
        rid: row.rid,
        username: row.username,
      };
    },
    // 实时保存
    editClosedEvent({ row, column }) {
      const $table = this.$refs.xGrid;
      const field = column.property;
      // 判断单元格值是否被修改
      if ($table.isUpdateByRow(row, field)) {
        setTimeout(() => {
          // 局部更新单元格为已保存状态
          $table.reloadRow(row, null, field);
        }, 300);
      }
    },
    // 修改用户状态
    statusSwitchingInstruction(row) {
      modificationState(row.id, row.mg_state).then((res) => {
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: `用户:${row.username} ` + res.data.meta.msg,
          });
        } else {
          this.$message({
            type: 'info',
            message: res.data.meta.msg,
          });
        }
      });
    },
    // 获取表单数据初始化
    findList() {
      this.gridOptions.loading = true;
      setTimeout(() => {
        this.gridOptions.loading = false;
        let params = {
          pagesize: this.gridOptions.pagerConfig.pageSize,
          pagenum: this.gridOptions.pagerConfig.currentPage,
        };

        getAllUsers(params).then((res) => {
          this.gridOptions.pagerConfig.total = res.data.data.total;
          this.gridOptions.data = res.data.data.users;
        });
      }, 300);
    },
    searchEvent() {
      this.gridOptions.pagerConfig.currentPage = 1;
      this.findList();
    },
    // 分页设置
    handlePageChange({ currentPage, pageSize }) {
      this.gridOptions.pagerConfig.currentPage = currentPage;
      this.gridOptions.pagerConfig.pageSize = pageSize;
      this.findList();
    },
    // 列表可编辑
    editRowEvent(row) {
      const $grid = this.$refs.xGrid;
      $grid.setActiveRow(row);
    },
    // 编辑提交
    saveRowEvent(row) {
      console.log(row);
      const $grid = this.$refs.xGrid;
      const { updateRecords } = $grid.getRecordset();
      $grid
        .clearActived()
        .then(() => {
          this.gridOptions.loading = true;
          if (updateRecords.length > 0) {
            setTimeout(() => {
              let data = { email: row.email, mobile: row.mobile };
              editSubmission(row.id, data).then((res) => {
                console.log(res);
              });
              this.gridOptions.loading = false;
              this.$message({ message: '修改成功！', type: 'success' });
            }, 300);
          } else {
            this.gridOptions.loading = false;
            this.$message({ message: '未修改任何值', type: 'info' });
            return false;
          }
        })
        .catch(() => {
          console.log('err');
        });
    },
    // 删除用户
    removeRowEvent(row) {
      console.log(row);
      this.$confirm('您确定要删除' + row.username + '用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then((type) => {
          deleteRowUsers(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除用户成功!',
            });
          });
          const $grid = this.$refs.xGrid;
          if (type === 'confirm') {
            $grid.remove(row);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
