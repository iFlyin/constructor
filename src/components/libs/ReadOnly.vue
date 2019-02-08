<template>
   <span>{{value}}</span>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class ReadOnly extends Vue {
   private val!: any;
   private get value(): any {
      if(this.val === -1) {
         return ''
      } else {
         return this.val;
      }
   }
} 
</script>
