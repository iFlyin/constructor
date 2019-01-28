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
      background: linear-gradient( #bbb, transparent 1px), linear-gradient( 90deg, #bbb, transparent 1px);
      background-size: 15px 15px;
      background-position: left top;
      background-attachment: fixed;
      overflow: auto;
   }
</style>
