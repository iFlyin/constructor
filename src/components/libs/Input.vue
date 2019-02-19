<template>
   <input type="text" :disabled="(val === '')" :value="val" @change="$emit('change', $event.target.value)">
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class Input extends Vue {} 
</script>
