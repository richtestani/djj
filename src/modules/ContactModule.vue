<template>
  <section class="section section--surface">
    <div class="container contact-wrap">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <RichText as="h2" class="h-title" :text="title" />
        <RichText as="p" v-if="text" :text="text" />
      </div>
      <ContactForm />
    </div>
  </section>
</template>

<script setup>
import RichText from '../components/prose/RichText.vue'
import ContactForm from '@/components/ui/ContactForm.vue'
defineProps({ eyebrow: String, title: { type: String, default: 'Get in touch' }, text: String })
</script>

<style scoped>
.contact-wrap { max-width: 620px; }
</style>
