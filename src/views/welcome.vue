<template>
  <div class="welcome">
    <!-- 欢迎登陆界面及项目描述 -->
    <div class="bg">
      欢迎
      <span>{{ this.$store.state.user.username }}</span> 登陆商品后台管理系统
    </div>
  </div>
</template>

<style lang="less" scoped>
.welcome {
  width: 100%;
  height: 100%;
  background: url('../images/welcome1.gif') no-repeat 100% 100%;
  opacity: 0.7;
  background-size: 100% 100%;
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  font-family: serif;
  display: flex;
  justify-content: center;
  align-items: center;
  .bg {
    opacity: 0.7;
    color: #409eff;
    span {
      color: #fff;
    }
  }
}
</style>
