<template>
   <div 
      id="panel-footer"
      :style="{ height: height + 'px' }"
   >
      
      <div 
         class="ns-resize"
         :style="{ bottom: (height - 5) + 'px' }"
         @mousedown.prevent="resize()"
      />
      <!-- <span v-for="(item, index) of getWebLook" :key="index">{{item.name}}</span> -->
   </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
// import { mapGetters, mapActions } from 'vuex';

@Component({
   props: {
      height: {
         type: Number,
         required: true,
      }
   },
   // computed: {
   //    ...mapGetters('CMS', ['getWebLook']),
   // },
   // methods: {
   //    ...mapActions('CMS', ['asyncGetLook']),
   // },
})
export default class Footer extends Vue {
   // public height: number = 132;
   // public asyncGetLook!: any;
   // public getWebLook!: any[];

   // public created (): void {
   //    this.asyncGetLook();
   // }

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
      position: relative;
      height: calc(100% - 30px);
      // max-width: 800px;
      background-color: #b3b3b3;
      overflow: hidden;
   }

   .ns-resize {
      position: absolute;
      width: 100%;
      height: 10px;
      cursor: ns-resize;
   }
</style>
