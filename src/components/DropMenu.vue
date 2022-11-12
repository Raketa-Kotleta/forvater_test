<template>
    <nav class="menu drop-menu" v-if="Visible" :style="'top:'+Top+'px; left:'+Left+'px;'">
      <li class="drop-menu__item" v-for="(header,index) in this.HeadersArray" :key="index">
          {{header}}
      </li>
    </nav>
</template>


<script>
export default{
    name: "DropMenu",
    props:{
      HeadersArray: Array,
      Visible: Boolean,
      Top: {
        default: 0,
        type: Number,
      },
      Left:{
        default: 0,
        type: Number,
      },
    },
    data(){
        return{
        top:"",
        }
    },

}
</script>

<style scoped>
  .drop-menu{
    padding: 0;
    background-color: white;
    list-style: none;
    font-family: "Arial";
    border: 1px solid lightgray;
    display: inline-block;
    border-radius: 4px;
    box-shadow: 0px 0px 20px 2px rgba(34, 60, 80, 0.46);
    overflow: hidden;
    position: absolute;
    z-index: 100;
    width: 200px;
    cursor: pointer;
  }
  .drop-menu__item:last-child{
    border:none;
  }
  .drop-menu__item{
    font-weight: 600;
    padding: 12px 12px;
    border-bottom: 1px solid lightgray;
  }
  .drop-menu__item:hover{
    background-color: #3c3cff;
    color:white;
  }
</style>

