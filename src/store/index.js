import Vue from 'vue'
import Vuex from 'vuex'
import Konva from "konva";

Vue.use(Vuex)
const LOCALSTORAGE_STAGE_KEY = "STAGE_SAVE";
export default new Vuex.Store({
  state: {
    stage: null,
    layers: [],
  },
  getters: {
    stage: state => state.stage,
    layers: state => state.layers[0],
    layer: (state) => (layerId) => state.layers.find(it => it.attrs.id == layerId),
  },
  mutations: {
    setStage(state,stage){
        state.stage = stage;
    },
    addLayers(state,layers){
      state.layers = layers;
    },
    addLayer(state, layer){
      if (state.stage) {
        if (!layer.id) layer.id = 'layer' + state.layers.length;
        state.stage.add(layer);
        state.layers.push(layer);
      }
    },
    addGroup(state, {container,group}){
      if (container) {
        if (!group.id) group.id = 'group' + state.layers.length;
        container.add(group);
      }
    },
    addShape(state,{layer, shape}){
      layer.add(shape);
    },
    dropShape(state, shape){
      shape.destroy();
    },
    setEventListener(state,{node, event, func}){
      node.on(event, func);
    },
  },
  actions: {
    initDefaultStage(context, container){
      let initStage = new Konva.Stage({
        container: container,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      context.commit('setStage', initStage);
    },
    setToLocalStorage(context){
      const json_str = context.state.stage.toJSON()
      window.localStorage.setItem(LOCALSTORAGE_STAGE_KEY, json_str);
    },
    getFromLocalStorage(context){
      const json_str = window.localStorage.getItem(LOCALSTORAGE_STAGE_KEY);
      const stage_obj = JSON.parse(json_str);
       console.log(stage_obj);
      if (stage_obj) {
        context.commit('setStage', Konva.Stage.create(stage_obj,'canvas'));
        context.commit('addLayers', context.state.stage.children);
      }
    },
  },
  modules: {
  }
})
