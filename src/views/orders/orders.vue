<template>
  <div class="orders">
    <vxe-grid ref="xGrid" v-bind="gridOptions" @page-change="handlePageChange">
      <template #operate="{ row }">
        <template v-if="$refs.xGrid.isActiveByRow(row)">
          <el-button
            icon="el-icon-check"
            circle
            @click="saveRowEvent(row)"
          ></el-button>
        </template>
        <template v-else>
          <el-button
            icon="el-icon-edit-outline"
            circle
            @click="editRowEvent(row)"
          ></el-button>
        </template>
        <el-button
          icon="el-icon-view"
          @click="outlineRowEvent(row)"
          circle
        ></el-button>
      </template>
      <template #toolbar_buttons>
        <el-button type="primary" round @click="saveEvent">保存更改</el-button>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import { getAllOrders, modifyOrders } from '../../api/orders';

export default {
  data() {
    return {
      gridOptions: {
        border: true,
        resizable: true,
        keepSource: true,
        showOverflow: true,
        height: 560,
        loading: false,
        pagerConfig: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 50],
        },
        editConfig: {
          // 设置触发编辑为手动模式
          trigger: 'manual',
          // 设置为整行编辑模式
          mode: 'row',
          // 显示修改状态和新增状态
          showStatus: true,
        },

        // 按钮设置
        toolbarConfig: {
          custom: true,
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        columns: [
          { type: 'seq', width: 50 },
          {
            field: 'order_id',
            title: '订单 ID',
          },
          {
            field: 'is_send',
            title: '是否发货',
            editRender: { name: '$select', options: [] },
          },
          {
            field: 'order_pay',
            title: '订单支付',
            editRender: { name: '$select', options: [] },
          },
          {
            field: 'order_price',
            title: '订单价格',
            editRender: { name: 'input' },
          },
          {
            field: 'order_number',
            title: '订单号',
            showOverflow: true,
            editRender: { name: 'input' },
          },
          {
            field: 'pay_status',
            title: '支付状态',
            showOverflow: true,
            editRender: { name: '$select', options: [] },
          },
          { title: '操作', width: 200, slots: { default: 'operate' } },
        ],
        data: [],
      },
    };
  },
  created() {
    setTimeout(() => {
      const $grid = this.$refs.xGrid;
      // 异步更新下拉选项
      if ($grid) {
        const is_send = $grid.getColumnByField('is_send');
        const order_pay = $grid.getColumnByField('order_pay');
        const pay_status = $grid.getColumnByField('pay_status');
        const order_number = $grid.getColumnByField('order_number');
        console.log(order_number);
        is_send.editRender.options = [
          { value: '是', label: '已发货' },
          { value: '否', label: '未发货' },
        ];
        order_pay.editRender.options = [
          { value: '0', label: '未支付' },
          { value: '1', label: '支付宝' },
          { value: '2', label: '微信' },
          { value: '3', label: '银行卡' },
        ];
        pay_status.editRender.options = [
          { value: '1', label: '已付款' },
          { value: '0', label: '未付款' },
        ];
      }
    }, 300);
    this.findList();
  },
  methods: {
    // 查看当前行信息
    outlineRowEvent(row) {
      this.$store.state.particulars = row;
      this.$router.push({ name: 'particulars' });
    },
    // 编辑提交完成
    saveEvent() {
      const $grid = this.$refs.xGrid;
      const { updateRecords } = $grid.getRecordset();
      if (updateRecords.length > 0) {
        for (let i in updateRecords) {
          let {
            order_id,
            is_send,
            order_pay,
            order_price,
            order_number,
            pay_status,
          } = updateRecords[i];
          let data = {
            is_send,
            order_pay,
            order_price,
            order_number,
            pay_status,
          };
          if (data.is_send === '是') {
            data.is_send = 1;
          } else {
            data.is_send = 0;
          }
          // data.order_number = data.order_number.replace(/[^0-9]/gi, '');
          modifyOrders(order_id, data).then((res) => {
            if (res.data.meta.status === 201) {
              this.$message.success('保存成功');
              this.findList();
            }
          });
        }
      }
    },
    findList() {
      this.gridOptions.loading = true;
      setTimeout(() => {
        this.gridOptions.loading = false;
        let params = {
          pagenum: this.gridOptions.pagerConfig.currentPage,
          pagesize: this.gridOptions.pagerConfig.pageSize,
        };
        getAllOrders(params).then((res) => {
          // 获取总数
          this.gridOptions.pagerConfig.total = res.data.data.total;
          this.gridOptions.data = res.data.data.goods;
        });
      }, 300);
    },
    // 分页设置
    handlePageChange({ currentPage, pageSize }) {
      // console.log(currentPage, pageSize);
      this.gridOptions.pagerConfig.currentPage = currentPage;
      this.gridOptions.pagerConfig.pageSize = pageSize;
      this.findList();
    },
    // 开启编辑
    editRowEvent(row) {
      const $grid = this.$refs.xGrid;
      $grid.setActiveRow(row);
    },
    // 保存成功
    saveRowEvent() {
      const $grid = this.$refs.xGrid;
      $grid.clearActived().then(() => {
        this.gridOptions.loading = true;
        setTimeout(() => {
          this.gridOptions.loading = false;
          this.$message.success('设置成功');
        }, 300);
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
