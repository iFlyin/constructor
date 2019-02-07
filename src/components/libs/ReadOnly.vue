<template>
   <span>{{val}}</span>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class ReadOnly extends Vue {} 
</script>
