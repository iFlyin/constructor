<template>
   <div 
      id="panel-footer"
      :style="{ 
         height: height + 'px',
         width: width + 'px',
      }"
   >
      
      <div 
         class="ns-resize"
         :style="{ bottom: (height - 5) + 'px' }"
         @mousedown.prevent="resize()"
      />
         
   </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import cmsForm from './CMSform.vue';

@Component({
   components: { cmsForm },
   props: {
      height: {
         type: Number,
         required: true,
      },
      width: {
         type: Number,
         required: true,
      }
   },
})
export default class Footer extends Vue {
   public resize(): void {
      const that: any = this;

      function move(this: any, e: MouseEvent): void {
         const innerHeight = this.innerHeight;
         const Y: number = innerHeight - e.clientY;
         let emitHeight;
         if (Y < 1) {
            emitHeight = 1;
           that.$emit('resize', emitHeight);
         } else if (Y > (innerHeight - 30)) {
            emitHeight = innerHeight - 30;
            that.$emit('resize', emitHeight);
         } else {
            emitHeight = Y;
            that.$emit('resize', emitHeight);
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
   #panel-footer {
      box-sizing: border-box;
      position: relative;
      height: calc(100% - 30px);
      background-color: #fff;
      overflow: hidden;
      border-top: 1px solid #2c3e50;
   }

   .ns-resize {
      position: absolute;
      width: 100%;
      height: 10px;
      cursor: ns-resize;
   }
</style>
