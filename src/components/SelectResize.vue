<template>
   <div class="layout-item-resizer">
      <button 
         class="resizer-grid resizer-top-left" 
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['top', 'left'],
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            top: -12 / zoom + 'px',
            left: -12 /zoom + 'px',
            cursor: 'nwse-resize',
         }"
      />
      <button 
         class="resizer-grid resizer-top" 
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['top']
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            top: -12 / zoom + 'px',
            left: `calc(50% - ${6 / zoom}px)`,
            cursor: 'ns-resize',
         }"
      />  
      <button 
         class="resizer-grid resizer-top-right"
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['top', 'right']
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            top: -12 / zoom + 'px',
            right: -12 /zoom + 'px',
            cursor: 'nesw-resize',
         }"
      />
      <button 
         class="resizer-grid resizer-left" 
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['left']
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            top: `calc(50% - ${6 / zoom}px)`,
            left: -12 /zoom + 'px',
            cursor: 'ew-resize',
         }"
      />  
      <button 
         class="resizer-grid resizer-right" 
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['right']
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            top: `calc(50% - ${6 / zoom}px)`,
            right: -12 /zoom + 'px',
            cursor: 'ew-resize',
         }"
      />                   
      <button 
         class="resizer-grid resizer-bottom-left" 
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['bottom', 'left']
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            bottom: -12 / zoom + 'px',
            left: -12 /zoom + 'px',
            cursor: 'nesw-resize',
         }"
      />  
      <button 
         class="resizer-grid resizer-bottom" 
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['bottom']
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            bottom: -12 / zoom + 'px',
            left: `calc(50% - ${6 / zoom}px)`,
            cursor: 'ns-resize',
         }"
      />   
      <button 
         class="resizer-grid resizer-bottom-right" 
         @mousedown.stop="$emit('resize', {
            event: $event,
            id: id,
            direction: ['bottom', 'right']
         })"
         :style="{
            'border-width': 2 / zoom + 'px',
            padding: 4 / zoom + 'px',
            bottom: -12 / zoom + 'px',
            right: -12 /zoom + 'px',
            cursor: 'nwse-resize',
         }"
      />
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({props: { 
   zoom: { type: Number, default: 1 },
   id: {type: Number, required: true },
}})
export default class SelectResize extends Vue { 
   private zoom!: number; 
   private id!: number;
}
</script>

<style lang="scss" scoped>
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


