<template>
   <div class="layout-item-resizer" :style="{
      'outline-width' : 2 / zoom + 'px',
   }">
      <button 
         class="resizer-grid resizer-top-left" 
         @mousedown.stop="$emit('resize', {
            event: $event,
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
import { mapGetters } from 'vuex';
@Component({computed: { ...mapGetters('CMS', { zoom: 'getZoom' })}})

export default class SelectResize extends Vue { private zoom!: number; }
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
      }
   }

   .layout-item-resizer {
      height: 100%;
      width: 100%;
      outline: 2px solid red;
      position: absolute;
      top: 0;
      left: 0;
   }
</style>


