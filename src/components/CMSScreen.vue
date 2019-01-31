<template>
   <div 
      class="layout-item"
      :style="{
         'z-index': (item.id == selected) ? '1000000' : '',
         left: (item.coord[0]) + 'px',
         top: item.coord[1] + 'px',
         width: item.width + 'px',
         height: item.height + 'px',
         'border-width': 2 / zoom + 'px'
      }"
      @click.stop.prevent="$emit('select', item.id)"
   >
      <div class="layout-item-wrapper">
         <select-resize 
            v-if="item.id == selected"
            :zoom="zoom"
            :id="item.id"
            @resize="$emit('resize', $event)"
         />
         <div class="layout-item-content">
            <div 
               class="layout-item-header"
               @drop.stop
               @mousedown.stop.prevent="$emit('movement', {
                  event: $event,
                  id: item.id,
               })"
            >
               {{item.name}} {{item.id}} 
            </div>   
            <div 
               class="layout-item-canvas"
               @drop.stop="$emit('drop', {
                  event: $event,
                  id: item.id,
               })"
               @mousedown.stop.prevent
            >  
               <cms-element
                  v-for="(component, id) of list.filter(el => el.parent == item.id)"
                  :key="id"
                  :item="component"
                  :zoom="zoom"
                  :selected="selected"
                  :list="list"
                  @select="$emit('select', $event)"
                  @resize="resize($event)"
                  @movement="movement($event)"
                  @change="$emit('change', $event)"
               />
            </div>
         </div>  
      </div>
      <div class="fake"></div>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CmsElement from './CMSElement.vue';
import SelectResize from './SelectResize.vue';

@Component({
   components: {CmsElement, SelectResize},
   props: {
      selected: {
         type: Number,
         required: true,
      },
      item: {
         type: Object,
         required: true,
      },
      zoom: {
         type: Number,
         required: true,
      },
      list: {
         type: Array,
         required: true,
      }
   }
})
export default class CMSScreen extends Vue {
   private selected!: number;
   // добавить интерфейс объектов
   private item!: any;

   private resize(e: any): void {
      const parentX = this.item.coord[0];
      const parentY = this.item.coord[1] + 40;
      e.parentOffset = [parentX, parentY];
      this.$emit('resize', e);
   }

   private movement(e: any): void {
      const parentX = this.item.coord[0];
      const parentY = this.item.coord[1] + 40;
      e.parentOffset = [parentX, parentY];
      this.$emit('movement', e);
   }
}
</script>

<style lang="scss" scoped>
   .layout-item {
      border-style: solid;
      border-color: black;
      box-sizing: border-box;
      z-index: 1;
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
         cursor: move;
      }

      &-canvas {
         flex: 1 1 auto;
         overflow: auto;
         position: relative;
      }
   }
</style>
