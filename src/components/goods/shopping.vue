<template>
  <div class="shopping">
    <!-- 返回条 -->
    <div class="goBack">
      <i @click="goBack" class="el-icon-back">返回</i>
    </div>
    <el-steps
      :active="active - 0"
      finish-status="success"
      style="margin-bottom:50px;"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品描述"></el-step>
    </el-steps>
    <div class="setting">
      <el-tabs
        :before-leave="beforeLeave"
        @tab-click="selectTab"
        v-model="active"
        id="el-tabs"
        tab-position="left"
        style="height: 100%"
      >
        <el-tab-pane label="商品基本信息">
          <div class="box">
            <el-form
              label-position="left"
              label-width="80px"
              :model="shoppingTable"
            >
              <el-form-item label="商品名称">
                <el-input
                  placeholder="请输入商品名称"
                  v-model="shoppingTable.goods_name"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input
                  v-model="shoppingTable.goods_price"
                  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品数量">
                <el-input
                  v-model="shoppingTable.goods_number"
                  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品重量">
                <el-input
                  v-model="shoppingTable.goods_weight"
                  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                ></el-input>
              </el-form-item>
              <!-- 商品分类 -->
              <el-form-item label="商品分类">
                <el-cascader
                  clearable
                  :options="cateList"
                  change-on-select
                  v-model="shoppingTable.goods_cat"
                  :props="cateProps"
                  @change="cateChange"
                ></el-cascader>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品参数设置">
          <el-form>
            <el-form-item
              class="formParams"
              :label="item.attr_name"
              v-for="item in asyncParams"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  border
                  v-for="(item1, index1) in item.attr_vals"
                  :key="index1"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性设置">
          <el-form>
            <el-form-item
              class="formParams"
              :label="item.attr_name"
              v-for="item in staticParams"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  border
                  v-for="(item1, index1) in item.attr_vals"
                  :key="index1"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片设置">
          <el-upload
            :on-change="handelonChange"
            drag
            accept=".jpg, .png"
            :auto-upload="false"
            :multiple="true"
            :limit="3"
            class="upload-demo"
            action="/upload"
            :on-exceed="handleExceed"
            :file-list="shoppingTable.pics"
            list-type="picture"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且只能上传 3 张
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品描述设置">
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            v-model="this.shoppingTable.goods_introduce"
          ></textarea>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="addshoppings">
      <el-button
        type="primary"
        @click="addShoppings"
        class="el-icon-circle-plus"
        >添加商品</el-button
      >
    </div>
  </div>
</template>

<script>
import { getAllCategories, getCategories, addShoppingLists } from '@/api/goods';
export default {
  data() {
    return {
      size: 0,
      fileList: [],
      // 静态参数
      staticParams: [],
      // 动态参数
      asyncParams: [],
      // 导航栏及步骤条控制
      active: 0,
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        chidren: 'children',
      },
      // 级联菜单
      cateList: [],
      isCollapse: true,
      // 添加商品时的参数
      shoppingTable: {
        goods_name: '',
        goods_price: 1,
        goods_number: 1,
        goods_weight: 1,
        goods_cat: '',
        goods_introduce: '', // 可以为空
        pics: [], // 可以为空
        attrs: [], // 可以为空
      },
    };
  },

  mounted() {
    getAllCategories().then((res) => {
      this.cateList = res.data.data;
      // console.log(res);
    });
  },

  methods: {
    // 添加商品 发送请求
    addShoppings() {
      // var res = this.shoppingTable;
      // console.log(res);
      var parent = {
        attr_id: '',
        attr_vals: [],
      };
      if (this.asyncParams.length !== null) {
        var parents = this.asyncParams[0] ? this.asyncParams[0] : false;
        if (parents) {
          parent.attr_id = parents.attr_id;
          parent.attr_vals = parents.attr_vals;
          this.shoppingTable.attrs.push(parent);
        }
      }
      let data = this.shoppingTable.goods_cat.join(',');
      this.shoppingTable.goods_cat = data;
      // 富文本编辑问题未解决
      addShoppingLists(this.shoppingTable).then((res) => {
        if (res.data.meta.status === 201) {
          this.$message.success('添加商品成功');
          this.$router.push('goods');
        }
      });
    },
    // 图片上传前将数据存储
    handelonChange(file, fileList) {
      this.shoppingTable.pics.push(file);
      this.fileList = JSON.parse(JSON.stringify(fileList));
    },
    // 图片上传拦截
    handleExceed(files, fileList) {
      this.$message.warning(
        `本次上传${files.length}张图片，上传上限为 ${fileList.length}张图片`
      );
    },
    // 添加进数组中

    //_________________________
    // 判断用户是否添加完成基本信息
    estimateWaremessage() {
      let res = this.shoppingTable;
      if (res.goods_cat === '') {
        return false;
      }
      return true;
    },
    // 拦截判断是否添加商品分类
    beforeLeave(news) {
      if (news === '1' || news === '2') {
        if (this.shoppingTable.goods_cat === '') {
          this.$message({
            type: 'warning',
            message: '请先选择分类',
            duration: 2000,
          });
          return false;
        }
      }
    },
    // 控制侧边栏及步骤条
    async selectTab(obj) {
      if (obj.index === '1') {
        let res = await getCategories(this.shoppingTable.goods_cat[2], 'many');
        this.asyncParams = res.data.data;
        if (this.asyncParams) {
          this.asyncParams.forEach((e) => {
            // 如有值，该值以逗号分隔
            e.attr_vals = e.attr_vals ? e.attr_vals.split(',') : [];
            e.attr_vals = [...e.attr_vals];
          });
        }
      }
      if (obj.index === '2') {
        let res = await getCategories(this.shoppingTable.goods_cat[2], 'only');
        this.staticParams = res.data.data;
        if (this.staticParams) {
          this.staticParams.forEach((e) => {
            // 如有值，该值以逗号分隔
            e.attr_vals = e.attr_vals ? e.attr_vals.split(',') : [];
            e.attr_vals = [...e.attr_vals];
          });
        }
      }
    },
    // 级联菜单
    cateChange(obj) {
      console.log(obj);
      console.log(this.shoppingTable);
      // 以为','分割的分类列表 （添加商品时）
      // obj = JSON.parse(JSON.stringify(obj)).join(',');
      // this.shoppingTable.goods_cat = obj;
      // console.log(this.shoppingTable);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    goBack() {
      this.$router.push({ name: '_goods' });
    },
  },
};
</script>

<style lang="less">
.el-tabs--left .el-tabs__nav-wrap.is-left::after,
.el-tabs--left .el-tabs__nav-wrap.is-right::after,
.el-tabs--right .el-tabs__nav-wrap.is-left::after,
.el-tabs--right .el-tabs__nav-wrap.is-right::after {
  height: 100%;
  width: 2px;
  bottom: auto;
  top: 0;
}

.formParams > .el-form-item__label {
  font-size: 16px;
  font-weight: 800;
}
.upload-demo > ul > li {
  width: 300px;
}
</style>
<style lang="less" scoped>
.box {
  width: 80%;
  margin: auto;
}
.shopping {
  position: relative;
  height: 100%;
  .addshoppings {
    position: absolute;
    right: 5%;
    bottom: 15%;
  }
}
.setting {
  .el-menu-vertical-demo {
    background: #9d9d9d;
    border: 0;
    li:hover {
      background: #9d9d9d;
    }
    li > i {
      color: #fff;
      font-size: 14px;
    }
    li > i:hover {
      color: #409eff;
    }
  }
}
.goBack {
  font-size: 25px;
  cursor: pointer;
  margin-bottom: 20px;
  i {
    border: 1px solid #fff;
    background: snow;
    border-radius: 5px;
  }
}
</style>
