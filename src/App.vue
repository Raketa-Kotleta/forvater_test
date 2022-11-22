
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
import ArrowLine from "@/classes/ArrowLine";
import DynamicArrow from "@/classes/DynamicArrow";
import store from "@/store";
import Element from "@/classes/Element";

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
        {name: 'Instruction', to: '/about'}
      ],
      menu_headers: [],
      menu_top:0,
      menu_left: 0,
      menu_visibility: false
    }
  },

  methods:{
    addElement(){
      let element = new Element({
        id: 'element' + store.getters.layer('main').children.filter(it => it instanceof Element).length,
        x: this.menu_left,
        y: this.menu_top,
        fill: 'black',
        width: 100,
        height: 100,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
      });
      store.commit('addGroup',{
        container: store.getters.layer('main'),
        group: element,
      });

      console.log(store.getters.layer('main'))
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
              name: "Добавить элемент",
              action: this.addElement,
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
          //e.evt.preventDefault();
          console.log(e.target.parent.findSocket);
          if (e.target instanceof  ArrowLine || e.target instanceof  DynamicArrow)
            this.menu_headers = [
              {
                name: 'Удалить стрелку',
                action: ()=>{e.target.parent.destroy()}
              }
            ];
          if (e.target instanceof Konva.Rect)
            this.menu_headers = [{
              name: (e.target.parent.findSocket('top').visible() ? "Удалить":"Добавить") + " розетку сверху",
              action: ()=>{
                e.target.parent.findSocket('top').visible() ? e.target.parent.dropSocket('top'):e.target.parent.addSocket('top')
              }
            },
              {
                name: (e.target.parent.findSocket('right').visible() ? "Удалить":"Добавить") + ' розетку справа',
                action: ()=>{
                  e.target.parent.findSocket('right').visible() ? e.target.parent.dropSocket('right'):e.target.parent.addSocket('right')
                }
              },
              {
                name: (e.target.parent.findSocket('bottom').visible() ? "Удалить":"Добавить") + ' розетку снизу',
                action: ()=>{
                  e.target.parent.findSocket('bottom').visible() ? e.target.parent.dropSocket('bottom'):e.target.parent.addSocket('bottom')
                }
              },
              {
                name: (e.target.parent.findSocket('left').visible() ? "Удалить":"Добавить") + ' розетку слева',
                action: ()=>{
                  e.target.parent.findSocket('left').visible() ? e.target.parent.dropSocket('left'):e.target.parent.addSocket('left')
                }
              },
              {
                name: "Удалить элемент",
                action: ()=>{e.target.parent.destroy()},
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
      this.$store.getters.layer('main').children.filter((it)=>!(it instanceof Element)).forEach(it=>{
        it.children[0].recoverConnection();
        console.log(it.children.length);
        it.children[it.children.length - 1].recoverConnection();
      });
    }
    if (!store.getters.stage)
    {
      store.dispatch('initDefaultStage','canvas');
      store.commit("addLayer", new Konva.Layer({id: 'main'}));
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
  position: fixed;
  width: 100%;
  z-index: 5;
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
