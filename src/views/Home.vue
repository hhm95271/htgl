<template>
  <div class="home">
    <el-container>
      <el-aside width="200px" v-show="showdom">
        <el-col :span="24">
          <div class="aside-top"></div>
          <el-menu
            default-active="1-2"
            :router="true"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            mode="vertical"
            :collapse-transition="true"
          >
            <el-submenu
              :index="index + ''"
              v-for="(item, index) in this.$store.state.menu"
              :key="index"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group>
                <!-- 在使用进行动态获取循环菜单栏数据时报如上异常，异常一直在页面控制台无限循环报错 -->
                <!-- 解决问题: 在属性 :index里面的参数后边追加一个空字符 :index="index+''" -->
                <el-menu-item
                  v-for="(item1, index1) in item.children"
                  :key="index1 + ''"
                  :index="'/home/' + item.path + '/' + item1.path"
                >
                  <i class="el-icon-s-tools"></i>
                  {{ item1.authName }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container style="">
        <el-header>
          <Header @asideShow="asideShow"></Header>
        </el-header>
        <el-main style="padding:10px">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '../components/header.vue';

// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    Header,
  },
  data() {
    return {
      showdom: true,
    };
  },
  mounted() {},
  methods: {
    asideShow(val) {
      this.showdom = val;
    },
  },
};
</script>
<style lang="less" scoped>
.aside-top {
  height: 70px;
  line-height: 70px;
  background: url('../images/logo.png') no-repeat 100% 100%;
  background-size: 100% 100%;
}
.home {
  height: 100%;
  section {
    height: 100%;
  }
}
.el-main {
  padding: 0;
}
.el-header {
  height: 70px !important;
  padding: 0;
}
.el-menu {
  width: auto;
  border-right: 0;
}
.el-aside {
  overflow: hidden;
  background-color: #545c64;
  color: #fff;
  text-align: center;
  line-height: 200px;
  .el-submenu {
    text-align: left;
    /deep/ .el-menu-item-group > ul > li {
      text-align: center;
    }
  }
}
</style>
