<script src="../node_modules/konva/lib/shapes/Arrow.js"></script>
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
import ArrowLine from "@/classes/ArrowLine";
import DynamicArrow from "@/classes/DynamicArrow";
// import DynamicArrow from "@/classes/DynamicArrow";
// import ArrowLine from "@/classes/ArrowLine";
export default {
  name: 'App',
  components: {
  DropMenu,
  },
  data(){
    return{
        menu_headers: [],
        menu_visibility: false,
        menu_top: 0,
        menu_left: 0,
    }
  },
  methods:{
    addShape(){
      let rect = new CustomRect({
        id: this.$store.getters.layer('main').length,
        x: this.menu_left,
        y: this.menu_top,
        width: 100,
        height: 100,
        pointRadius: 7,
        pointFill: 'rgb(100,100,100)',
        rectFill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true
      });
      this.$store.commit('addShape',{
        layer: this.$store.getters.layer('main'),
        shape: rect,
      })
      rect.draw();
    },
    dropShape(shape){
      this.$store.commit('dropShape', shape);
    },
    removeRectPoint(side,shape){
      shape[side] = false;
      shape.draw()
    },
    addRectPoint(side,shape){
      shape[side] = true;
      shape.draw();
    },
    addArrow(){
      const halfwidth = 120;
      const group = new Konva.Group({
        id: 'arrow' + this.$store.getters.layer('main').children.filter(it => it instanceof Konva.Group).length,
      })
      const config = {
        x: 0,
        y: 0,
        strokeWidth: 4,
        fill: 'black',
        stroke: 'black',
        draggable: true,
      }
      const line1 = new ArrowLine({
        ...config,
        points: [this.menu_left, this.menu_top, this.menu_left+halfwidth, this.menu_top],
        direction: 'row'
      });
      const arrow = new DynamicArrow({
        ...config,
        points:[line1.points()[2],line1.points()[3], line1.points()[2]+halfwidth, line1.points()[3]],
        direction: 'row',
      });
      group.add(line1,arrow);

      this.$store.commit('addGroup',{
        container: this.$store.getters.layer('main'),
        group: group
      })

    },
    dropArrow(){

    }
  },
  mounted() {
    document.onclick = ()=>{
      this.menu_visibility = false;
    }
    this.$store.dispatch('initDefaultStage','canvas');
    this.$store.commit("addLayer",new Konva.Layer({id: 'main'}));
    this.$store.commit("setEventListener",{
      node: this.$store.getters.stage,
      event: 'contextmenu',
      func:  (e)=>{
        e.evt.preventDefault();
        if (e.target instanceof Konva.Stage)
          this.menu_headers = [{
            name: "Добавить квадрат",
            action: this.addShape,
          },
            {
              name: "Добавить стрелку",
              action: this.addArrow,
            }];
        this.menu_visibility = true;
        this.menu_left = window.innerWidth-e.evt.x < 205 ? window.innerWidth - 205:e.evt.x ;
        this.menu_top = e.evt.y;
      }
    });
    this.$store.commit('setEventListener',{
      node: this.$store.getters.layer('main'),
      event: 'contextmenu',
      func: (e) => {
        e.evt.preventDefault();
        this.menu_headers = [{
          name: (e.target.top ? "Удалить":"Добавить") + " розетку сверху",
          action: ()=>{
            e.target.top ? this.removeRectPoint('top', e.target):this.addRectPoint('top', e.target)
          }
        },
        {
          name: (e.target.right ? "Удалить":"Добавить") + ' розетку справа',
          action: ()=>{
            e.target.right ? this.removeRectPoint('right', e.target):this.addRectPoint('right', e.target)
          }
        },
        {
          name: (e.target.bottom ? "Удалить":"Добавить") + ' розетку снизу',
          action: ()=>{
            e.target.bottom ? this.removeRectPoint('bottom', e.target):this.addRectPoint('bottom', e.target)
          }
        },
        {
          name: (e.target.left ? "Удалить":"Добавить") + ' розетку слева',
          action: ()=>{
            e.target.left ? this.removeRectPoint('left', e.target):this.addRectPoint('left', e.target)
          }
        },
        {
          name: "Удалить квадрат",
          action: ()=>this.dropShape(e.target)
        }];
      }
    });

    this.$store.commit('setEventListener', {
      node: this.$store.getters.layer('main'),
      event: 'mouseover',
      func: (e) => {
        e.target.pointFill = 'black';
        e.target.draw()
      }
    });
    this.$store.commit('setEventListener', {
      node: this.$store.getters.layer('main'),
      event: 'mouseout',
      func: (e) => {
        e.target.pointFill = "gray";
        e.target.draw()
      }
    });

  },
  updated() {

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
