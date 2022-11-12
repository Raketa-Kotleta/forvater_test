<template>
 <div id="app">
   <drop-menu ref="drop_menu" :visible="menu_visibility" :top="menu_top" :left="menu_left"  :headers-array="menu_headers"></drop-menu>
  <div id="canvas">

  </div>
 </div>
</template>

<script>
import Konva from "konva";
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
        menu_headers: [{
          name: "Добавить квадрат",
          action: this.addRect,
        },
        {
          name: "Добавить стрелку",
          action: this.addRect,
        }],
        menu_visibility: false,
        menu_top: 0,
        menu_left: 0,
    }
  },
  methods:{
    addRect(){
      let rect = new CustomRect({
        id: this.layout.children.length,
        x: this.menu_left,
        y: this.menu_top,
        width: 100,
        height: 100,
        pointFill: 'rgb(100,100,100)',
        rectFill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true
      });
      this.layout.add(rect);
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
    this.layout.on('mouseover', function (e) {
      e.target.drawPoints('black');
      e.target.draw()
    });
    this.layout.on('mouseout', function (e) {
      e.target.drawPoints('gray');
      e.target.draw()
    });
    this.stage.add(this.layout);

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
