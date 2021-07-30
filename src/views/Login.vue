<template>
  <div class="login">
    <div class="form">
      <div class="userAvatar">
        <img src="../images/user.png" alt="" />
      </div>
      <el-form
        :rules="rules"
        ref="userInfo"
        :model="userInfo"
        status-icon
        class="demo-ruleForm"
      >
        <el-form-item prop="user" label="用户名">
          <el-input type="user" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-button @click="login" class="login-button" type="info"
          >登陆</el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
import { user_login } from '@/api/user_login';
import { getMenus, getAuth } from '../api/user_roles';
export default {
  data() {
    return {
      userInfo: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    login() {
      this.$refs.userInfo.validate((valid) => {
        if (valid) {
          // this.userInfo __ob__数据是vue这个框架对数据设置的监视器，一般都是不可枚举的。
          var userInfo = JSON.parse(JSON.stringify(this.userInfo));
          // 登陆验证
          user_login(userInfo)
            .then((res) => {
              console.log(res);
              if (res.data.meta.status == 200) {
                this.$store.state.user = res.data.data;
                sessionStorage.setItem('super_user_ttzy', res.data.data.token);
                getAuth().then((res) => {
                  let { data } = res.data;
                  let arr = [];
                  for (let i in data) {
                    if (data[i].level == 2) {
                      arr.push(data[i]);
                    }
                  }
                  console.log(arr);
                  this.$store.state.auth_btn = arr;
                });
                getMenus().then((res) => {
                  this.$store.state.menu = res.data.data;
                });
                this.$router.push('/home');
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'error',
                });
              }
            })
            .catch((err) => {
              console.log(new Error(err + '登陆失败'));
              this.$message({
                type: 'error',
                message: '登陆失败',
              });
            });
        } else {
          this.$message({
            message: '数据输入不合法',
            type: 'error',
          });
          // 只有return false才能阻止请求
          return false;
        }
      });
    },
    // 登陆成功之后获取对应的路由权限
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.login {
  background: #2f4050;
  height: 100%;
  position: relative;
  .userAvatar {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 43%;
    top: -20%;
    img {
      height: 100%;
    }
  }
  .form {
    position: absolute;
    left: 35%;
    top: 25%;
    width: 400px;
    height: 300px;
    background: #fff;
    padding: 0 40px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    border-radius: 10px;
    .login-button {
      width: 100%;
    }
  }
}
</style>
