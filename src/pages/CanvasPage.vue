<template>
  <div id="canvas">

  </div>
</template>

<script>
export default {
  name: "CanvasPage",
beforeDestroy() {
  this.$store.dispatch('setToLocalStorage');
}
}
</script>

<style scoped>

</style>