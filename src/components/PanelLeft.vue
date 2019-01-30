<template>
   <div 
      id="panel-left"
      :style="{ width: width + 'px' }"
   >
      <slot></slot>
      <div 
         class="ew-resize"
         :style="{ left: (width - 5) + 'px' }"
         @mousedown.prevent="resize()"
      />
   </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';

@Component({
   props: {
      width: {
         type: Number,
         required: true,
      }
   }
})
export default class LeftAsidePanel extends Vue {
   public width!: number;

   public resize(this: any): void {
      const that: any = this;
      const rightPanel: Element = this.$el.parentNode.querySelector('#panel-right');
      const maxWidth: number = window.innerWidth - rightPanel.clientWidth;
      let emitWidth;

      function move(e: MouseEvent): void {
         const X: number = e.clientX;
         if (X < 1) {
            emitWidth = 1;
            that.$emit('resize', emitWidth);
         } else if (X > maxWidth) {
            emitWidth = maxWidth;
            that.$emit('resize', emitWidth);
         } else {
            emitWidth = X;
            that.$emit('resize', emitWidth);
         }
      }

      function clear(e: MouseEvent) {
         window.removeEventListener('mousemove', move);
         window.removeEventListener('mouseup', clear);
      }

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', clear);
   }
}
</script>


<style lang="scss" scoped>
   #panel-left {
      position: relative;
      height: calc(100% - 30px);
      // background-color: grey;
      // border-right: 1px solid #2c3e50;
      display: flex;
      overflow: hidden;
   }

   .ew-resize {
      position: absolute;
      width: 10px;
      height: 100%;
      cursor: ew-resize;
   }
</style>
