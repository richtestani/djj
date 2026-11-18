<!--
  RichText — renders a config string with markdown inside the tag you
  name. Drop-in for `<h2 class="h-title">{{ title }}</h2>`:

    <RichText as="h2" class="h-title" :text="title" />

  Supports **bold**, *italic*, `code`, [links](/about) and ==highlight==
  (accent color — the two-tone title). Syntax and rules: richText.js.

  `block` is for body paragraphs: a string starting with "- ", "1. " or
  "> " renders as a list / quote (in a <div>) instead of inside `as`.
-->
<template>
  <div v-if="asBlock" class="prose-block" v-html="html" @click="onRichClick" />
  <component v-else :is="as" class="rich" v-html="html" @click="onRichClick" />
</template>

<script setup>
import { computed } from 'vue'
import { renderInline, renderBlock, isBlock } from './richText.js'
import { useRichLinks } from './useRichLinks.js'

const props = defineProps({
  text: { type: [String, Number], default: '' },
  as: { type: String, default: 'span' },
  block: { type: Boolean, default: false },
})

const asBlock = computed(() => props.block && isBlock(props.text))
const html = computed(() => (asBlock.value ? renderBlock(props.text) : renderInline(props.text)))
const { onRichClick } = useRichLinks()
</script>
