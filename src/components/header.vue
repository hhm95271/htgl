<template>
  <div id="header">
    <div id="menu_btn">
      <el-button class="el-icon-menu" @click="toshow"></el-button>
    </div>
    <div class="menu_txt">
      <span>seven私素电商 <i>&copy;</i></span> 后台管理系统
    </div>
    <div class="menu_user">
      <img src="../images/user.png" alt="显示失败" />
      <span class="username">{{ this.$store.state.user.username }}</span>
      <el-dropdown trigger="click" @command="exit_user">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      menu: [],
    };
  },
  methods: {
    toshow() {
      this.show = !this.show;
      this.$emit('asideShow', this.show);
    },
    // 退出账号
    exit_user() {
      sessionStorage.clear();
      this.$router.push('/');
    },
  },
};
</script>

<style lang="less" scope>
.username:hover {
  color: #66b1ff !important;
  cursor: pointer;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
#header {
  width: 100%;
  height: 70px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .menu_txt {
    font-size: 25px;
    font-weight: 800;
    font-style: oblique;
    color: #545c64;
    i {
      font-size: 14px;
    }
  }
  #menu_btn {
    button {
      font-size: 40px;
      border: 0;
    }
  }
  .menu_user {
    margin-right: 20px;
    img {
      height: 90%;
      border-radius: 50%;
      vertical-align: middle;
    }
    span {
      color: #9d9d9d;
      margin-left: 5px;
    }
  }
}
</style>
