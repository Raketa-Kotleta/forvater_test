<template>
  <div id="canvas">

  </div>
</template>

<script>

export default {
  name: "CanvasPage",
  mounted() {
   if (this.$store.getters.stage)
     this.$store.getters.stage.setContainer('canvas');
  },
  beforeDestroy() {
    //this.$store.dispatch('setToLocalStorage');
  }
}
</script>

<style scoped>

</style>