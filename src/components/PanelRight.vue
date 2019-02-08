<template>
   <div 
      id="panel-right"
      :style="{ 
         width: width + 'px',
         height: height + 'px',
      }"
   >
      
      <div 
         class="ew-resize"
         :style="{ right: (width - 5) + 'px' }"
         @mousedown.prevent="resize()"
      />
      <cms-form/>
   </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import cmsForm from './CMSform.vue';
// import { mapGetters } from 'vuex';

@Component({
   components: { cmsForm },
   props: {
      width: {
         type: Number,
         required: true,
      },
      height: {
         type: Number,
         required: true,
      }
   },
   // computed: { ...mapGetters('businessLogic', ['getWebLook']) }
})
export default class RightAsidePanel extends Vue {
   public width!: number;

   public resize(this: any): void {
      const that: any = this;
      const maxWidth: number = this.$el.parentNode.clientWidth;

      function move(this: any, e: MouseEvent): void {
         const innerWidth = this.innerWidth;
         const X: number = this.innerWidth - e.clientX;
         let emitWidth;
         if (X < 2) {
            emitWidth = 2;
            that.$emit('resize', emitWidth)
         } else if (X > maxWidth) {
            emitWidth = maxWidth;
            that.$emit('resize', emitWidth)
         } else {
            emitWidth = X;
            that.$emit('resize', emitWidth)
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
   #panel-right {
      position: relative;
      background-color: #fff;
      overflow: hidden;
      border-left: 1px solid #2c3e50;
      box-sizing: border-box;
   }

   .ew-resize {
      position: absolute;
      width: 10px;
      height: 100%;
      cursor: ew-resize;
   }
</style>
