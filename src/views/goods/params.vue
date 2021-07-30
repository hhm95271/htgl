<template>
  <div class="params">
    <!-- 商品分类 -->
    <div class="classify">
      <el-cascader
        :options="cascaderData"
        :props="staticParamsProps"
        clearable
        @change="getParams"
      ></el-cascader>
    </div>

    <div class="params">
      <!-- 分页 -->
      <el-menu
        default-active="1"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">静态属性</el-menu-item>
        <el-menu-item index="2">动态参数</el-menu-item>
      </el-menu>
      <!-- 添加button -->
      <el-button
        @click="addDynamicParams = true"
        style="margin:10px 0;"
        v-show="showBlock === 2"
        type="primary"
        >添加参数</el-button
      >
      <!-- 添加动态参数表单 -->
      <el-dialog
        title="添加动态参数"
        :visible.sync="addDynamicParams"
        @close="handleClose"
      >
        <el-form :model="addDynamicParamsForm" ref="addParams" :rules="rules">
          <el-form-item label="属性：" prop="attr_name" label-width="120px">
            <el-input
              v-model="addDynamicParamsForm.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="参数：" prop="attr_vals" label-width="120px">
            <el-input
              placeholder="多个参数请用,分割"
              v-model="addDynamicParamsForm.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="动态参数：" prop="attr_sel" label-width="120px">
            <el-input
              disabled
              v-model="addDynamicParamsForm.attr_sel"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addDynamicParams = false">取 消</el-button>
          <el-button type="primary" @click="submitParams">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑参数表单 -->
      <el-dialog title="编辑参数单" :visible.sync="exitDynamicParams">
        <el-form :model="exitRow" ref="exitParams" :rules="rules">
          <el-form-item label="属性：" prop="attr_name" label-width="120px">
            <el-input v-model="exitRow.attr_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数：" prop="attr_vals" label-width="120px">
            <el-input
              placeholder="多个参数请用,分割"
              v-model="exitRow.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="动态参数：" prop="attr_sel" label-width="120px">
            <el-input
              disabled
              v-model="exitRow.attr_sel"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="exitDynamicParams = false">取 消</el-button>
          <el-button type="primary" @click="exitParamsForm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除提示框 -->

      <!-- 动态列表 -->
      <el-table
        style="width:100%"
        v-show="showBlock === 2"
        border
        type="index"
        :data="asyncParams"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column align="center" prop="attr_name"> </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope3">
            {{ scope3.row.attr_vals | attr_vals }}
          </template>
        </el-table-column>
        <el-table-column align="center" v-show="showBlock === 2">
          <template slot-scope="scope1">
            <el-button
              type="primary "
              @click="
                handleEdit(scope1.$index, scope1.row),
                  (exitDynamicParams = true)
              "
              >编辑</el-button
            >
            <el-button
              type="primary "
              @click="handleDelete(scope1.$index, scope1.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 静态列表 -->
      <el-table
        v-show="showBlock === 1"
        border
        type="index"
        :data="staticParams"
        style="width: 100%"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column align="center" prop="attr_name"> </el-table-column>
        <el-table-column align="center" prop="attr_vals"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getAllCategories, getCategories } from '@/api/goods';
import { addParams, exitParams, deleteParams } from '@/api/params';

export default {
  data() {
    return {
      exitRow: {},
      // 编辑表单(开关)
      exitDynamicParams: false,
      // 验证规则
      rules: {
        attr_name: [
          {
            required: true,
            trigger: 'blur',
            message: '商品属性必填',
          },
        ],
        attr_vals: [
          {
            required: true,
            trigger: 'blur',
            message: '商品参数必填',
          },
        ],
      },
      // 添加动态属性的表单（开关）
      addDynamicParams: false,
      // 添加动态属性的表单
      addDynamicParamsForm: {
        attr_name: '',
        attr_vals: '',
        attr_sel: 'many',
        id: null,
      },
      // 切换静动态
      showBlock: 1,
      // 级联菜单数列
      cascaderList: [],
      // 级联菜单所有数据
      cascaderData: [],
      // 级联菜单需要显示的数据
      staticParamsProps: {
        label: 'cat_name', // 展示的是文字描述 大家电/电视/曲面电视
        value: 'cat_id', // 实际选取的是数据的id
        chidren: 'children', // 选取的子类
      },
      // 静态参数
      staticParams: [],
      // 动态参数
      asyncParams: [],
    };
  },
  filters: {
    attr_vals: (val) => {
      return val.replace(/,/g, ' /' + `  `);
    },
  },
  methods: {
    // 删除表单
    deleteParams(row) {
      this.$confirm('永久删除本条参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteParams(row.cat_id, row.attr_id).then((res) => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getParams(this.cascaderList);
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
    // 编辑表单
    exitParamsForm() {
      let row = this.exitRow;
      exitParams(row.cat_id, row.attr_id, row).then((res) => {
        this.$message.success(res.data.meta.msg);
        this.exitDynamicParams = false;
      });
    },
    // 关闭会话
    handleClose() {
      this.addDynamicParams = false;
      this.addDynamicParamsForm = {
        attr_name: '',
        attr_vals: '',
        attr_sel: 'many',
        id: null,
      };
    },
    // 添加动态属性
    submitParams() {
      this.$refs.addParams.validate((valid) => {
        if (valid) {
          if (this.staticParams.length > 0) {
            let id = this.staticParams[0].cat_id;
            this.addDynamicParamsForm.id = id;
            addParams(id, this.addDynamicParamsForm).then((res) => {
              if (res.data.meta.status === 201) {
                this.addDynamicParams = false;
                this.getParams(this.cascaderList);
                this.$message.success('添加参数成功');
              }
            });
          } else {
            this.$message.warning('请先选择分类');
          }
        } else {
          this.$message.warning('请正确添加');
        }
      });
    },
    // 编辑
    handleEdit(index, row) {
      this.exitRow = row;
    },
    // 删除
    handleDelete(index, row) {
      console.log(index, row);
      this.deleteParams(row);
    },
    // 当级联菜单发生变化时，获取到其中的值
    getParams(e) {
      // a = [1,3,6]
      this.cascaderList = JSON.parse(JSON.stringify(e));
      // only  many
      getCategories(
        this.cascaderList[this.cascaderList.length - 1],
        'only'
      ).then((res1) => {
        this.staticParams = res1.data.data;
        // console.log(this.staticParams, 'only');
      });
      getCategories(
        this.cascaderList[this.cascaderList.length - 1],
        'many'
      ).then((res) => {
        this.asyncParams = res.data.data;
        // console.log(this.asyncParams);
      });
    },
    handleSelect(key) {
      if (key == 1) {
        this.showBlock = 1;
      } else {
        this.showBlock = 2;
      }
    },
  },
  mounted() {
    getAllCategories().then((res) => {
      this.cascaderData = res.data.data;
    });
  },
};
</script>

<style lang="less" scoped></style>
