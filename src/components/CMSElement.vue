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
               @mousedown.stop
            >
               <label>Эффект
                  <select @mousedown.stop v-model="model">
                     <option :value="0">0</option>
                     <option
                        v-for="(obj, index) of list.filter(el => el.hasOwnProperty('parent') === false)"
                        :key="index"
                        :value="obj.id"
                     >
                        {{obj.id}}
                     </option>
                  </select>
               </label>
            </div>
         </div>
      </div>
   
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SelectResize from './SelectResize.vue';

@Component({
   components: { SelectResize },
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
      },
      list: {
         type: Array,
         required: true,
      }
   }
})
export default class CMSElement extends Vue {
   private item!: any;

   private get model(): number {
      return this.item.effect;
   }

   private set model(v: number) {
      this.$emit('change', {
         value: v,
         id: this.item.id,
      })
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
         cursor: move;
      }

      &-canvas {
         flex: 1 1 auto;
         overflow: auto;
         position: relative;
      }
   }
</style>

