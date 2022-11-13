import Vue from 'vue'
import Vuex from 'vuex'
import Konva from "konva";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stage: null,
    layers: [],
  },
  getters: {
    stage: state => state.stage,
    layers: state => state.layers[0],
    layer: (state) => (layerId) => state.layers.find(it => it.id() == layerId),
    shape: (state) => (layerId,shapeId) => state.layers.find(it => it.id() == layerId).find(it => it.id() == shapeId),
  },
  mutations: {
    setStage(state,stage){
      if (stage.container != null)
        state.stage = stage;
      else console.log(new Error('Config container is null'));
    },
    addLayer(state, layer){
      if (state.stage) {
        if (!layer.id) layer.id = 'layer' + state.layers.length;
        state.stage.add(layer);
        state.layers.push(layer);
      }
    },
    addShape(state,{layer, shape}){
      layer.add(shape);
    },
    dropShape(state,{layer, shape}){
      layer.remove(shape);
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
    }
  },
  modules: {
  }
})
