<script>
import { Animations } from './js/animations';

export default {
  props: ['value'],
  data() {
    return {
      animations: Animations,
    }
  }
};
</script>

<template>
  <select :value="value" v-on:input="$emit('input', $event.target.value)">
    <option v-for="(animation, key) in animations" :value="key" :key="key">
      {{ animation.name }}
    </option>
  </select>
</template>