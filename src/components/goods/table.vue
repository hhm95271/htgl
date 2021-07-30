<template>
  <div class="goods_table">
    <div class="search">
      <el-input
        style="width:300px;"
        type="text"
        placeholder="请输入内容"
        v-model="text"
        maxlength="20"
      >
      </el-input>
      <el-button type="info" style="margin-right:20px">
        <i class="el-icon-search"></i>
      </el-button>
      <router-link to="shopping"
        ><el-button type="success" plain>添加商品</el-button></router-link
      >
    </div>
    <!-- 列表 -->
    <div class="list">
      <el-table :data="tableData" fixed border style="width: 100%">
        <el-table-column prop="goods_name" label="商品名称" width="400">
        </el-table-column>
        <el-table-column prop="goods_price" label="价格" width="100">
        </el-table-column>
        <el-table-column prop="" label="商品状态">
          <template slot-scope="scope">
            {{ scope.row.goods_state | goods_state }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="hot商品" align="center">
          <template slot-scope="scope">
            {{ scope.row.is_promote | is_promote }}
          </template>
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="" label="生产日期">
          <template slot-scope="scope">
            {{ scope.row.add_time | timeFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="200" align="center">
          <template slot-scope="scope1">
            <el-tooltip content="编辑" placement="top">
              <el-button
                @click="_compile(scope1.row.goods_id)"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                @click="_delete(scope1.row.goods_id)"
                type="primary"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { goodsList } from '@/api/goods';
export default {
  data() {
    return {
      text: '',
      total: 0,
      page: {
        pagesize: 10,
        pagenum: 1,
      },
      // 商品列表
      tableData: [],
    };
  },
  filters: {
    is_promote(e) {
      if (e === true) return (e = '是');
      else return (e = '否');
    },
    goods_state(state) {
      if (state === 2) return (state = '已审核');
      else if (state === 1) return (state = '审核中');
      else return (state = '未审核');
    },
    timeFormat(time) {
      time = new Date(time * 1000);
      return (
        time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
      );
    },
  },
  methods: {
    // 编辑
    _compile(val) {
      console.log(val);
    },
    // 删除
    _delete(val) {
      console.log(val);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.pagenum = val;
      this.getTableData();
    },
    getTableData() {
      goodsList(this.page).then((res) => {
        this.tableData = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 20px;
}
</style>
