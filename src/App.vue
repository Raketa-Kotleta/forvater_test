
<template>
  <div id="app">

    <drop-menu ref="drop_menu" :visible="menu_visibility" :top="menu_top" :left="menu_left"  :headers-array="menu_headers"></drop-menu>
    <nav class="navbar">
      <a class="brand" href="#">RS</a>
      <ul>
        <li v-for="(header,index) in navbar_headers" :key="index">
          <router-link :to="header.to">{{header.name}}</router-link>
        <li>
          <button @click="$store.dispatch('setToLocalStorage')" class="btn btn-save">Save</button>
        </li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import Konva from "konva";
import DropMenu from "@/components/DropMenu";
import CustomRect from "@/classes/CustomRect";
import ArrowLine from "@/classes/ArrowLine";
import DynamicArrow from "@/classes/DynamicArrow";
import store from "@/store";

// import DynamicArrow from "@/classes/DynamicArrow";
// import ArrowLine from "@/classes/ArrowLine";
export default {
  name: 'App',
  components: {
    DropMenu,
  },
  data(){
    return{
      navbar_headers: [
        {name:'Canvas', to: '/'},
        {name: 'About', to: '/about'}
      ],
      menu_headers: [],
      menu_top:0,
      menu_left: 0,
      menu_visibility: false
    }
  },

  methods:{
    addShape(){
      let rect = new CustomRect({
        id: store.getters.layer('main').length,
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
      store.commit('addShape',{
        layer: store.getters.layer('main'),
        shape: rect,
      })
      rect.draw();
      console.log(store.getters.layer('main').children);
      store.getters.stage.draw();
    },
    dropShape(shape){
      store.commit('dropShape', shape);
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
        id: 'arrow' + store.getters.layer('main').children.filter(it => it instanceof Konva.Group).length,
      })
      const config = {
        x: 0,
        y: 0,
        strokeWidth: 4,
        fill: 'black',
        stroke: 'black',
        draggable: true,
      }
      const line = new ArrowLine({
        ...config,
        points: [this.menu_left, this.menu_top, this.menu_left+halfwidth, this.menu_top],
        direction: 'row'
      });
      const arrow = new DynamicArrow({
        ...config,
        points:[line.points()[2],line.points()[3], line.points()[2]+halfwidth, line.points()[3]],
        direction: 'row',
      });
      group.add(line,arrow);

      store.commit('addGroup',{
        container: store.getters.layer('main'),
        group: group
      })
      console.log(group);

    },
  },
  created() {

  },
  mounted() {
    store.dispatch('getFromLocalStorage');
    document.onclick = ()=>{
      this.menu_visibility = false;
    }
    let init = ()=>{

      store.commit("setEventListener",{
        node: store.getters.stage,
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
      store.commit('setEventListener',{
        node: store.getters.layer('main'),
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

      store.commit('setEventListener', {
        node: store.getters.layer('main'),
        event: 'mouseover',
        func: (e) => {
          e.target.pointFill = 'black';
          e.target.draw()
        }
      });
      store.commit('setEventListener', {
        node: store.getters.layer('main'),
        event: 'mouseout',
        func: (e) => {
          e.target.pointFill = "gray";
          e.target.draw()
        }
      });
    }
    if (!store.getters.stage)
    {
      store.dispatch('initDefaultStage','canvas');
      store.commit("addLayer",new Konva.Layer({id: 'main'}));
    }
    init();
    // console.log( store.getters.stage);
  },
  updated() {
  },
  beforeDestroy() {
    // store.dispatch('setToLocalStorage');
  }
}
</script>

<style>
#app {

}
body{
  margin: 0;
}
a {
  text-decoration: none;
}

.navbar {
  background-color: #333333;
  display: flex;
  align-items:center;
}

.navbar a {
  color: #e7e7e7;
}

.navbar .brand {
  display: block;
  padding: 0 24px;
  font-size: 24px;
}

.navbar ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  align-items:center;
  justify-content: flex-start;
}

.navbar ul li a {
  color: #e7e7e7;
  padding: 24px;
  display: block;
}
.btn{
  border-radius: 4px;
  padding: 12px 16px;
  border: none;
}
.btn-save{
  background-color: orange;
}

.navbar ul a:hover,
.navbar ul a:focus,
.navbar ul .active {
  background-color: #272727;
}
</style>
