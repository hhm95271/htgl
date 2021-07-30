<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  methods: {
    saveState() {
      sessionStorage.setItem('state', JSON.stringify(this.$store.state));
    },
  },
  mounted() {
    window.addEventListener('unload', this.saveState);
  },
};
</script>
<style lang="less"></style>
