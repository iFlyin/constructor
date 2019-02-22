<template>
   <div 
      id="canvas"
      :style="{
         width: width + 'px',
         height: height + 'px',
      }"
   >
      <slot></slot>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
   props: {
      width: {
         type: Number,
         required: true,
      },
      height: {
         type: Number,
         required: true,
      }
   }
})
export default class Canvas extends Vue {}
</script>


<style lang="scss" scoped>
   #canvas {
      background: linear-gradient( #bbbbbb, transparent .6px), linear-gradient( 90deg, #bbbbbb, transparent .6px);
      background-size: 10px 10px;
      background-position: left top;
      background-attachment: fixed;
      overflow: auto;
   }
</style>
