<template>
   <form class="cms-form">
      <app-input 
         v-for="(item, key, index) of paramsList" :key="index"
         :label="key"
         :component="item.type"
         :cms="CMS"
         @change="change()"
      />
   </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import AppInput from './libs/_InputView.vue';
@Component({
   components: { AppInput },
   computed: {...mapGetters('CMS', { 
      paramsList: 'getPropList',
      checkSelected: 'getSelectedType',
      selected: 'getSelected',
      cmsList: 'getCMSlist',
   })}
})
export default class CMSform extends Vue {
   private paramsList!: any;
   private checkSelected!: string;
   private selected!: number;
   private cmsList!: any[];

   private get CMS() :any {
      const type: string = this.checkSelected;
      const id: number = this.selected;
      if (type === 'CMS') {
         const index = this.cmsList.findIndex((el: any) => el.props.id === id);
         return this.cmsList[index];
      } else {
         return {};
      }
   }

   private change(): void {
      console.log('change');
   }
}
</script>

<style lang="scss" scoped>
   .cms-form {
      box-sizing: border-box;
      padding: 5px;
      width: 100%;
      height: 100%;
      // background-color: red;
      overflow-x: hidden;
      overflow-y: auto;
      // display: flex;
      // flex-flow: column nowrap;
   }
</style>
