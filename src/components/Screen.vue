<template>
   <div 
      class="layout-item"
      :style="{
            left: (item.coord[0]) + 'px',
            top: item.coord[1] + 'px',
            width: item.width + 'px',
            height: item.height + 'px',
            'border-width': 2 / zoom + 'px'
         }"
      :data-id="item.id"
      @mousedown.stop.prevent="$emit('move')"
      @click.stop.prevent="$emit('select')"
   >
      <div class="layout-item-wrapper">
         <div class="layout-item-resizer" v-if="item.id == selected">
            <button 
               class="resizer-grid resizer-top-left" 
               @mousedown.stop="resize($event, item.id, ['top', 'left'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: -12 / zoom + 'px',
                  left: -12 /zoom + 'px',
               }"
            />
            <button 
               class="resizer-grid resizer-top" 
               @mousedown.stop="resize($event, item.id, ['top'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: -12 / zoom + 'px',
                  left: `calc(50% - ${6 / zoom}px)`,
               }"
            />  
            <button 
               class="resizer-grid resizer-top-right"
               @mousedown.stop="resize($event, item.id, ['top', 'right'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: -12 / zoom + 'px',
                  right: -12 /zoom + 'px',
               }"
            />
            <button 
               class="resizer-grid resizer-left" 
               @mousedown.stop="resize($event, item.id, ['left'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: `calc(50% - ${6 / zoom}px)`,
                  left: -12 /zoom + 'px',
               }"
            />  
            <button 
               class="resizer-grid resizer-right" 
               @mousedown.stop="resize($event, item.id, ['right'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: `calc(50% - ${6 / zoom}px)`,
                  right: -12 /zoom + 'px',
               }"
            />                   
            <button 
               class="resizer-grid resizer-bottom-left" 
               @mousedown.stop="resize($event, item.id, ['bottom', 'left'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  bottom: -12 / zoom + 'px',
                  left: -12 /zoom + 'px',
               }"
            />  
            <button 
               class="resizer-grid resizer-bottom" 
               @mousedown.stop="resize($event, item.id, ['bottom'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  bottom: -12 / zoom + 'px',
                  left: `calc(50% - ${6 / zoom}px)`,
               }"
            />   
            <button 
               class="resizer-grid resizer-bottom-right" 
               @mousedown.stop="resize($event, item.id, ['bottom', 'right'])"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  bottom: -12 / zoom + 'px',
                  right: -12 /zoom + 'px',
               }"
            />
         </div>
       </div>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
   props: {
      item: {
         type: Object,
         required: true,
      },
      zoom: {
         type: Number,
         required: true,
      },
      selected: {
         type: Number,
         required: true,
      }
   }
})
export default class Screen extends Vue {
   private drop(e: any): void {
      let item;
      try {
         item = JSON.parse(e.dataTransfer.getData('item')); 
      } catch (err) {
         console.log(err);
         return;
      }
      // console.log(e.target)
      const centerX = item.width/2;
      const centerY = item.height/2;
      const scrollY = e.target.scrollTop;
      item.coord = new Array();
      let posX = e.offsetX;
      if (posX < 0) { posX = 0 }
      let posY = e.offsetY ;
      if (posY < 0) { posY = 0 }
      item.coord.push(posX);
      item.coord.push(posY + scrollY);
      item.id = ++this.id;
      const id = e.target.offsetParent.offsetParent.offsetParent.dataset.id;
      item.parent = id;
      // const index = this.list.findIndex(item => item.id == id);
      this.list.push(item);
   }
}
</script>

<style lang="scss" scoped>
   .layout-item {
      border-style: solid;
      border-color: black;
      box-sizing: border-box;
      z-index: 100;
      position: absolute;

      &-wrapper {
         width: 100%;
         height: 100%;
         background: #fff;
         position: relative;
      }

      &-resizer {
         height: 100%;
         width: 100%;
         outline: 2px dashed grey;
         position: absolute;
         top: 0;
         left: 0;
      }
      
      &-content {
         position: absolute;
         top: 0;
         left: 0;
         height: 100%;
         width: 100%;
         display: flex;
         flex-flow: column nowrap;
      }

      &-header {
         min-height: 40px;
         padding: 10px;
         width: 100%;
         box-sizing: border-box;
         outline: 1px solid black;
         display: flex;
         justify-content: center;
         align-items: center;
         user-select: none;
      }

      &-canvas {
         flex: 1 1 auto;
         overflow: auto;
         position: relative;
      }
   }
</style>

