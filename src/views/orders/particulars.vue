<template>
  <div class="particulars">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="订单 ID" name="1">
        <div class="ddiv">
          {{ order.order_id }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="订单是否发货" name="2">
        <div class="ddiv">
          {{ order.is_send }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="订单支付方式" name="3">
        <div class="ddiv">
          {{ order.order_pay | order_pay }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="	订单价格" name="4">
        <div class="ddiv">
          {{ order.order_price }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="订单数量" name="5">
        <div class="ddiv">
          {{ order.order_number | order_number }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="支付状态" name="6">
        <div class="ddiv">
          {{ order.pay_status | pay_status }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="订单公司/个人" name="7">
        <div class="ddiv">
          {{ order.order_fapiao_title }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="公司发票" name="8">
        <div class="ddiv">
          {{ order.order_fapiao_company }}
        </div>
      </el-collapse-item>

      <el-collapse-item title="订单发票内容" name="9">
        <div class="ddiv">
          {{ order.order_fapiao_content }}
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getParticulars } from '@/api/orders';
export default {
  data() {
    return {
      order: {},
      activeNames: ['1'],
    };
  },
  filters: {
    order_number: (str) => {
      if (str) {
        return str.replace(/[^0-9]/gi, '');
      }
    },
    order_pay: (val) => {
      if (val === '0') return (val = '未支付');
      if (val === '1') return (val = '支付宝');
      if (val === '2') return (val = '微信');
      else return (val = '银行卡');
    },
    pay_status: (val) => {
      if (val === '0') return (val = '未付款');
      else return (val = '已付款');
    },
  },
  methods: {
    getOrder() {
      let id = this.$store.state.particulars.order_id;
      getParticulars(id).then((res) => {
        let { data } = res.data;
        for (let i in data) {
          if (data[i] == '') {
            data[i] = '暂无数据';
          }
        }
        this.order = data;
      });
    },
  },
  mounted() {
    this.getOrder();
  },
};
</script>

<style lang="less" scoped>
.ddiv {
  text-align: center;
}
</style>
