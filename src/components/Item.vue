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
      @click.stop.prevent="$emit('select', item.id)"
      @mousedown.stop.prevent="$emit('movement', {
         event: $event,
         id: item.id,
      })"
   >
      <div class="layout-item-wrapper">
         <div class="layout-item-resizer" v-if="item.id == selected">
            <button 
               class="resizer-grid resizer-top-left" 
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['top', 'left']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: -12 / zoom + 'px',
                  left: -12 /zoom + 'px',
               }"
            />
            <button 
               class="resizer-grid resizer-top" 
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['top']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: -12 / zoom + 'px',
                  left: `calc(50% - ${6 / zoom}px)`,
               }"
            />  
            <button 
               class="resizer-grid resizer-top-right"
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['top', 'right']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: -12 / zoom + 'px',
                  right: -12 /zoom + 'px',
               }"
            />
            <button 
               class="resizer-grid resizer-left" 
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['left']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: `calc(50% - ${6 / zoom}px)`,
                  left: -12 /zoom + 'px',
               }"
            />  
            <button 
               class="resizer-grid resizer-right" 
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['right']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  top: `calc(50% - ${6 / zoom}px)`,
                  right: -12 /zoom + 'px',
               }"
            />                   
            <button 
               class="resizer-grid resizer-bottom-left" 
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['bottom', 'left']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  bottom: -12 / zoom + 'px',
                  left: -12 /zoom + 'px',
               }"
            />  
            <button 
               class="resizer-grid resizer-bottom" 
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['bottom']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  bottom: -12 / zoom + 'px',
                  left: `calc(50% - ${6 / zoom}px)`,
               }"
            />   
            <button 
               class="resizer-grid resizer-bottom-right" 
               @mousedown.stop="$emit('resize', {
                  event: $event,
                  id: item.id,
                  direction: ['bottom', 'right']
               })"
               :style="{
                  'border-width': 2 / zoom + 'px',
                  padding: 4 / zoom + 'px',
                  bottom: -12 / zoom + 'px',
                  right: -12 /zoom + 'px',
               }"
            />
         </div>
         <div class="layout-item-content">
            <div 
               class="layout-item-header"
               @drop.stop
            >
               {{item.name}} {{item.id}} 
            </div>   
            <div 
               class="layout-item-canvas"
               @drop.stop="$emit('drop', {
                  event: $event,
                  id: item.id,
               })"
            >
            </div>
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
export default class Item extends Vue {

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

   .resizer {
      &-grid{
         position: absolute;
         box-sizing: border-box;
         border-style: dashed;
         border-color: grey;
         height: 0;
         outline: none;
         background: transparent;
         
         &:hover {
            border-color: red;
         }
      }
   }
</style>

