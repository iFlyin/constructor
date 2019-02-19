<template>
   <div class="input-view">
      <label 
         class="input-label" 
         v-html="label + ': '"
         :style="{'width': labelWidth + 'px'}"
      />
      <components class="input" :is="component" :val="value" @change="setValue({
         id: cms.props.id,
         key: label,
         v: $event,
      })"/>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters, mapMutations }from 'vuex';
import ElReadonly from './ReadOnly.vue';
import ElInput from './Input.vue';
import ElInputNumber from './InputNumber.vue';
import ElTextarea from './TextArea.vue';
import ElDatepicker from './DatePicker.vue';
import ElSelect from './ElSelect.vue';

@Component({
   components: { ElReadonly, ElInput, ElTextarea, ElDatepicker, ElSelect, ElInputNumber },
   props: {
      label: {
         type: String,
         default: 'Имя поля',
      },
      labelWidth: {
         type: Number,
         default: 120,
      },
      component: {
         type: String,
         required: true,
      },
      cms: {
         type: Object,
         required: true,
      }
   }, 
   computed: {...mapGetters('CMS', { lookName: 'getLookName', effectName: 'getEffectName'})},
   methods: {...mapMutations('CMS',{ setValue: 'setValue'})},
})
export default class InputView extends Vue {
   private label!: string;
   private cms!: any; 
   private lookName!: any;
   private effectName!: any;

   private get value(): any {
      if (this.cms.props) {
         // console.log(this.label + ' : ' + this.cms.props[this.label]);
         if( this.label === 'look') {
            return this.lookName(this.cms.props[this.label]);
         } else if ( this.label === 'effect') {
            return this.effectName(this.cms.props[this.label]);
         }
         return this.cms.props[this.label];
      } else return '';
   }

   private console(v: any) {
      console.log(`${this.label} ${v}`);
   }
}
</script>


<style lang="scss" scoped>
   .input-view {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 5px 20px;
      border-bottom: 1px solid grey;
      margin: 5px;
   }

   .input-label {
      box-sizing: border-box;
      padding: 5px 0;
      display: flex;
   }

   .input {
      box-sizing: border-box;
      padding: 5px 0;
      flex: 1 1 auto;
      display: flex;
      justify-content: flex-start;
      text-align: left;
      max-width: 100%;
   }

</style>
