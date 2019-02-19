<template>
   <textarea :style="{resize: 'vertical', width: '100%', flex: '1 1 auto'}" :disabled="(val === '')" :value="val"  @change="$emit('change', $event.target.value)"></textarea>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class TextArea extends Vue {} 
</script>