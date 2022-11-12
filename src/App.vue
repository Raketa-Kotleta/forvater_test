<template>
 <div id="app">
   <drop-menu ref="drop_menu" :visible="menu_visibility" :top="menu_top" :left="menu_left"  :headers-array="menu_headers"></drop-menu>
  <div id="canvas">

  </div>
 </div>
</template>

<script>
import Konva from "konva";
// import CustomRect from "@/classes/CustomRect";
import DropMenu from "@/components/DropMenu";
import CustomRect from "@/classes/CustomRect";
export default {
  name: 'App',
  components: {
  DropMenu,
  },
  data(){
    return{
        stage: null,
        layout: null,
        menu_headers: ["Добавить квадрат", "Добавить стрелку"],
        menu_visibility: false,
        menu_top: 0,
        menu_left: 0,
    }
  },
  methods:{
    addRect(){

    }
  },
  mounted() {
    document.onclick = ()=>{
      this.menu_visibility = false;
    }
    document.addEventListener('contextmenu', (e)=>{
      e.preventDefault()

      this.menu_visibility = true;
      this.menu_left = window.innerWidth-e.x < 205 ? window.innerWidth - 205:e.x;
      this.menu_top = e.y;
    });



    this.stage = new Konva.Stage({
      container: 'canvas',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.layout = new Konva.Layer();
    this.stage.add(this.layout);
    this.rect1 = new CustomRect({
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 1,
      draggable: true
    });
    this.layout.add(this.rect1);

  }
}
</script>

<style>
#app {

}
body{
  margin: 0;
}
</style>
