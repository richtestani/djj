<template>
  <section ref="root" class="section assess" :class="{ 'section--surface': onSurface }" :style="accent ? { '--as-accent': accent } : null">
    <div ref="wrap" class="container assess-wrap">

      <!-- ── intro ── -->
      <div v-if="step === 'intro'" class="assess-card assess-intro">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title assess-q">{{ title }}</h2>
        <p v-if="intro" class="assess-help">{{ intro }}</p>
        <ul class="assess-facts">
          <li><b>{{ total }}</b> questions</li>
          <li><b>{{ cats.length }}</b> areas</li>
          <li>About <b>{{ minutes }}</b> min</li>
        </ul>
        <div class="assess-nav">
          <button type="button" class="btn" @click="start">{{ hasProgress ? 'Continue where you left off' : startLabel }}</button>
          <button v-if="hasProgress" type="button" class="btn btn--link" @click="restart">Start over</button>
        </div>
      </div>

      <!-- ── questions ── -->
      <template v-else-if="step === 'questions'">
        <div class="assess-progress">
          <p class="assess-count">
            Question {{ index + 1 }} of {{ total }}<span class="assess-dot" aria-hidden="true">·</span><span class="muted">{{ current.cat.name }}</span>
          </p>
          <div class="assess-bar" role="progressbar" :aria-valuenow="answeredCount" aria-valuemin="0" :aria-valuemax="total" :aria-label="`${answeredCount} of ${total} answered`">
            <span :style="{ width: `${(answeredCount / total) * 100}%` }"></span>
          </div>
        </div>

        <div class="assess-card" :key="index">
          <fieldset class="assess-field">
            <legend>
              <span class="eyebrow assess-cat">{{ current.cat.name }} · {{ current.qi + 1 }} of {{ current.cat.questions.length }}</span>
              <span ref="qHeading" tabindex="-1" class="h-title assess-q">{{ current.q.q }}</span>
            </legend>
            <p class="assess-help">{{ current.q.help || helpText }}</p>

            <div class="assess-options">
              <label
                v-for="(opt, oi) in current.options" :key="oi"
                class="assess-opt" :class="{ 'is-on': answers[index] === oi }"
              >
                <input type="radio" :name="`${uid}-q${index}`" :value="oi" :checked="answers[index] === oi" @change="choose(oi)" />
                <span class="assess-radio" aria-hidden="true"></span>
                <span class="assess-opt-text">{{ opt.label }}</span>
              </label>
            </div>
          </fieldset>

          <div class="assess-nav">
            <button type="button" class="btn btn--ghost" @click="prev">← {{ index === 0 ? 'Back' : 'Previous' }}</button>
            <div class="assess-next">
              <p v-if="nudge" class="assess-nudge" role="status">Choose an answer to continue.</p>
              <button type="button" class="btn" @click="next">{{ isLast ? resultsLabel : 'Next question →' }}</button>
            </div>
          </div>
        </div>
      </template>

      <!-- ── capture (before results, only when gated) ── -->
      <div v-else-if="step === 'gate'" class="assess-card">
        <p class="eyebrow">Almost done</p>
        <h2 class="h-title assess-q">{{ capture.title || 'Where should we send your results?' }}</h2>
        <p v-if="capture.text" class="assess-help">{{ capture.text }}</p>
        <form class="assess-form" @submit.prevent="submit(true)">
          <CaptureFields v-model="lead" :fields="captureFields" :uid="uid" />
          <input v-model="honeypot" type="text" name="_gotcha" class="assess-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <p v-if="sendError" class="assess-error" role="alert">{{ sendError }}</p>
          <div class="assess-nav">
            <button type="button" class="btn btn--ghost" @click="step = 'questions'">← Back</button>
            <button type="submit" class="btn" :disabled="sending">{{ sending ? 'Sending…' : (capture.submitLabel || 'See my results') }}</button>
          </div>
        </form>
      </div>

      <!-- ── results ── -->
      <div v-else class="assess-results">
        <div class="assess-card assess-summary">
          <p class="eyebrow">{{ resultsEyebrow }}</p>
          <div class="assess-score">
            <div class="assess-ring" :style="{ '--p': result.pct }" role="img" :aria-label="`Overall score ${result.pct} out of 100`">
              <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="assess-ring-track" /><circle cx="50" cy="50" r="44" class="assess-ring-fill" pathLength="100" /></svg>
              <span>{{ result.pct }}</span>
            </div>
            <div>
              <h2 class="h-title assess-level">{{ result.level.label }}</h2>
              <p v-if="result.level.text" class="assess-help">{{ result.level.text }}</p>
            </div>
          </div>
        </div>

        <div class="assess-card">
          <h3 class="h-sub">By area</h3>
          <ul class="assess-cats">
            <li v-for="(c, ci) in result.cats" :key="ci">
              <div class="assess-cat-head">
                <span class="assess-cat-name">{{ c.name }}</span>
                <span class="assess-cat-level">{{ c.level.label }} · {{ c.pct }}</span>
              </div>
              <div class="assess-track"><span :style="{ '--p': c.pct, '--d': `${200 + ci * 120}ms` }"></span></div>
              <p v-if="c.insight" class="assess-insight">{{ c.insight }}</p>
            </li>
          </ul>
        </div>

        <!-- capture after results (default): optional, never blocks the score -->
        <div v-if="capture.enabled && !capture.gate" class="assess-card">
          <template v-if="!sent">
            <h3 class="h-sub">{{ capture.title || 'Want a copy, and a second opinion?' }}</h3>
            <p class="assess-help">{{ capture.text || 'Send us your results and we’ll follow up with what we’d look at first.' }}</p>
            <form class="assess-form" @submit.prevent="submit(false)">
              <CaptureFields v-model="lead" :fields="captureFields" :uid="uid" />
              <input v-model="honeypot" type="text" name="_gotcha" class="assess-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
              <p v-if="sendError" class="assess-error" role="alert">{{ sendError }}</p>
              <div class="assess-nav assess-nav--end">
                <button type="submit" class="btn" :disabled="sending">{{ sending ? 'Sending…' : (capture.submitLabel || 'Send my results') }}</button>
              </div>
            </form>
          </template>
          <p v-else class="assess-thanks" role="status">{{ capture.thanks || 'Thanks — your results are on their way to us. We’ll be in touch.' }}</p>
        </div>
        <p v-else-if="sent" class="assess-thanks" role="status">{{ capture.thanks || 'Thanks — we’ll be in touch.' }}</p>

        <div class="assess-nav assess-nav--end">
          <button type="button" class="btn btn--link" @click="restart">Retake the assessment</button>
          <RouterLink v-if="cta" :to="cta.to" class="btn">{{ cta.label }}</RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
// ============================================================
// assessment — part of lodestar-pro-modules. A multi-step
// questionnaire: one question per screen, a progress bar, and a
// results page scored in the browser (overall level + a bar and
// a takeaway per area). Optional lead capture through the same
// Formspree endpoint as the contact form. No backend needed.
//
// { module: 'assessment', props: {
//     eyebrow: 'Free assessment', title: 'How ready is your technology?',
//     intro: 'Twenty questions, about five minutes.',
//     categories: [
//       { name: 'Technology Strategy',
//         insights: ['…ad hoc…', '…emerging…', '…defined…', '…optimized…'],  // one per level
//         questions: [
//           { q: 'How effective is your operating model…?',
//             options: ['Roles are unclear', 'Depends on heroics', 'Documented', 'Adapts predictably'] },
//         ] },
//     ],
//     levels: [ { min: 0, label: 'Ad hoc', text: '…' }, { min: 30, label: 'Emerging' }, … ],
//     capture: { enabled: true, gate: false },   // gate: true asks before showing results
//     cta: { label: 'Talk through your results', to: '/contact' },
// }}
//
// Options score 1, 2, 3… in order, worst first. Give { label, score }
// for anything else. Scores become 0–100 per area and overall; each
// level's `min` is on that scale. No `categories` → demo content
// (modules/pro/assessmentDemo.js).
//
// Progress is saved in the browser (localStorage, per page), so a
// refresh or a later visit picks up where the visitor left off.
// ============================================================
import { ref, computed, watch, nextTick, onMounted, defineComponent, h, useId } from 'vue'
import { site } from '@/site.config.js'
import { demoCategories, demoLevels } from './assessmentDemo.js'

const props = defineProps({
  eyebrow: { type: String, default: 'Free assessment' },
  title: { type: String, default: 'How well is your technology serving the business?' },
  intro: String,
  startLabel: { type: String, default: 'Start the assessment' },
  helpText: { type: String, default: 'Choose the statement that most closely reflects your organization’s current practice.' },
  resultsLabel: { type: String, default: 'See my results →' },
  resultsEyebrow: { type: String, default: 'Your results' },
  categories: Array,
  levels: Array,
  capture: { type: Object, default: () => ({}) },
  cta: Object,
  accent: String,
  onSurface: { type: Boolean, default: false },
  storageKey: String, // defaults to one per page path
})

const uid = `as-${useId()}`.replace(/[^a-z0-9-]/gi, '')

// ── content ────────────────────────────────────────────────
const cats = computed(() => (props.categories?.length ? props.categories : demoCategories).map(c => ({
  ...c,
  questions: (c.questions || []).map(q => ({
    ...q,
    options: (q.options || []).map((o, i) => typeof o === 'string' ? { label: o, score: i + 1 } : { label: o.label, score: Number(o.score ?? i + 1) }),
  })),
})))
const levels = computed(() => [...(props.levels?.length ? props.levels : demoLevels)].sort((a, b) => a.min - b.min))

const flat = computed(() => cats.value.flatMap((cat, ci) => cat.questions.map((q, qi) => ({ cat, ci, q, qi, options: q.options }))))
const total = computed(() => flat.value.length)
const minutes = computed(() => Math.max(1, Math.round(total.value * 0.25)))

// ── state ──────────────────────────────────────────────────
const step = ref('intro')          // intro | questions | gate | results
const index = ref(0)
const answers = ref([])            // option index per flat question
const nudge = ref(false)
const qHeading = ref(null)
const root = ref(null)
const wrap = ref(null)

const current = computed(() => flat.value[index.value])
const isLast = computed(() => index.value === total.value - 1)
const answeredCount = computed(() => answers.value.filter(a => a != null).length)
const hasProgress = ref(false)

function choose(oi) {
  const next = [...answers.value]; next[index.value] = oi; answers.value = next
  nudge.value = false
}
function start() {
  step.value = 'questions'
  const firstOpen = flat.value.findIndex((_, i) => answers.value[i] == null)
  index.value = firstOpen === -1 ? 0 : firstOpen
  focusQuestion()
}
function prev() {
  nudge.value = false
  if (index.value === 0) { step.value = 'intro'; return }
  index.value--; focusQuestion()
}
function next() {
  if (answers.value[index.value] == null) { nudge.value = true; return }
  if (!isLast.value) { index.value++; focusQuestion(); return }
  step.value = capture.value.enabled && capture.value.gate ? 'gate' : 'results'
  scrollToTop()
}
function restart() {
  answers.value = []; index.value = 0; sent.value = false; sendError.value = ''
  step.value = 'intro'; hasProgress.value = false
  save(); scrollToTop()
}
// Keyboard and screen-reader users land on the new question, and the
// card stays in view on phones where it can be taller than the screen.
function focusQuestion() {
  nextTick(() => {
    qHeading.value?.focus({ preventScroll: true })
    const top = wrap.value?.getBoundingClientRect().top ?? 0
    if (top < 0) scrollToTop()
  })
}
function scrollToTop() {
  nextTick(() => wrap.value?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }))
}

// ── scoring ────────────────────────────────────────────────
function levelFor(pct) {
  let found = levels.value[0]
  for (const l of levels.value) if (pct >= l.min) found = l
  return found
}
function pctOf(items) { // items: [{ q, a }]
  let got = 0, lo = 0, hi = 0
  for (const { q, a } of items) {
    const scores = q.options.map(o => o.score)
    const min = Math.min(...scores), max = Math.max(...scores)
    lo += min; hi += max
    got += a == null ? min : q.options[a].score
  }
  return hi === lo ? 0 : Math.round(((got - lo) / (hi - lo)) * 100)
}
const result = computed(() => {
  const items = flat.value.map((f, i) => ({ ...f, a: answers.value[i] }))
  const pct = pctOf(items)
  return {
    pct,
    level: levelFor(pct),
    cats: cats.value.map((cat, ci) => {
      const p = pctOf(items.filter(it => it.ci === ci))
      const lvl = levelFor(p)
      const li = levels.value.indexOf(lvl)
      const insight = Array.isArray(cat.insights) ? cat.insights[li] : (cat.insights?.[lvl.label] ?? '')
      return { name: cat.name, pct: p, level: lvl, insight }
    }),
  }
})

// ── capture (Formspree, same endpoint as the contact form) ─
const capture = computed(() => ({ enabled: false, gate: false, ...props.capture }))
const captureFields = computed(() => capture.value.fields || ['name', 'email', 'company'])
const lead = ref({})
const honeypot = ref('')
const sending = ref(false)
const sent = ref(false)
const sendError = ref('')
const endpoint = computed(() => capture.value.endpoint || site.contact?.formspree || '')

async function submit(fromGate) {
  sendError.value = ''
  if (honeypot.value) { sent.value = true; if (fromGate) step.value = 'results'; return }
  if (!endpoint.value) {
    // No endpoint yet: never trap someone behind a broken form.
    if (import.meta.env.DEV) console.warn('[lodestar-pro-modules] assessment capture has no endpoint — set capture.endpoint or site.contact.formspree')
    if (fromGate) { step.value = 'results'; return }
    sendError.value = 'Sending isn’t set up yet.'; return
  }
  sending.value = true
  try {
    const r = result.value
    const res = await fetch(endpoint.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...lead.value,
        _subject: `Assessment results: ${r.level.label} (${r.pct})`,
        overall: `${r.level.label} · ${r.pct}/100`,
        areas: r.cats.map(c => `${c.name}: ${c.level.label} · ${c.pct}/100`).join('\n'),
        answers: flat.value.map((f, i) => `${f.q.q}\n→ ${answers.value[i] == null ? '(skipped)' : f.options[answers.value[i]].label}`).join('\n\n'),
        page: typeof location !== 'undefined' ? location.pathname : '',
      }),
    })
    if (!res.ok) throw new Error(String(res.status))
    sent.value = true
    if (fromGate) { step.value = 'results'; scrollToTop() }
  } catch {
    sendError.value = 'Something went wrong sending that. Please try again.'
  } finally {
    sending.value = false
  }
}

// ── saved progress ─────────────────────────────────────────
// Per viewer, per browser. Wrapped: storage can be blocked or throw.
const key = computed(() => `lodestar-assessment:${props.storageKey || (typeof location !== 'undefined' ? location.pathname : 'page')}`)
function save() {
  try { localStorage.setItem(key.value, JSON.stringify({ v: 1, total: total.value, answers: answers.value, done: step.value === 'results' })) } catch {}
}
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(key.value) || 'null')
    // Questions changed since they were saved → start fresh rather than misalign answers.
    if (saved?.v === 1 && saved.total === total.value && Array.isArray(saved.answers)) {
      answers.value = saved.answers
      hasProgress.value = saved.answers.some(a => a != null)
      if (saved.done && saved.answers.filter(a => a != null).length === total.value) step.value = 'results'
    }
  } catch {}
})
watch([answers, step], save)

// ── capture fields (tiny local component) ──────────────────
const FIELD = {
  name:    { label: 'Name',    type: 'text',  autocomplete: 'name' },
  email:   { label: 'Email',   type: 'email', autocomplete: 'email', required: true },
  company: { label: 'Company', type: 'text',  autocomplete: 'organization' },
  phone:   { label: 'Phone',   type: 'tel',   autocomplete: 'tel' },
  role:    { label: 'Role',    type: 'text',  autocomplete: 'organization-title' },
}
const CaptureFields = defineComponent({
  props: { fields: Array, modelValue: Object, uid: String },
  emits: ['update:modelValue'],
  setup(p, { emit }) {
    return () => h('div', { class: 'assess-fields' }, p.fields.map((f) => {
      const def = typeof f === 'string' ? { name: f, ...(FIELD[f] || { label: f, type: 'text' }) } : f
      const id = `${p.uid}-${def.name}`
      return h('div', { class: 'assess-input' }, [
        h('label', { for: id }, def.label + (def.required ? '' : ' (optional)')),
        h('input', {
          id, name: def.name, type: def.type || 'text', autocomplete: def.autocomplete, required: !!def.required,
          value: p.modelValue?.[def.name] || '',
          onInput: e => emit('update:modelValue', { ...p.modelValue, [def.name]: e.target.value }),
        }),
      ])
    }))
  },
})
</script>

<style scoped>
.assess { --as-accent: var(--primary); }
.assess-wrap { max-width: 860px; scroll-margin-top: calc(var(--nav-height) + 1rem); } /* clear the fixed nav when scrolled to */

.assess-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow); padding: clamp(1.5rem, 5vw, 3.5rem);
}
.assess-card + .assess-card { margin-top: 1.25rem; }

/* progress */
.assess-progress { margin-bottom: 1.5rem; }
.assess-count { font-weight: 600; font-size: 0.95rem; }
.assess-dot { margin-inline: 0.45em; color: var(--text-muted); }
.assess-bar { margin-top: 0.85rem; height: 6px; border-radius: 99px; background: color-mix(in srgb, var(--text) 9%, transparent); overflow: hidden; }
.assess-bar span { display: block; height: 100%; background: var(--as-accent); border-radius: inherit; transition: width 450ms cubic-bezier(.2, .8, .2, 1); }

/* question */
.assess-field { border: 0; padding: 0; margin: 0; min-width: 0; }
.assess-field legend { padding: 0; display: block; width: 100%; }
.assess-cat { display: block; color: var(--text-muted); }
.assess-q { display: block; margin-top: 0.9rem; line-height: 1.15; letter-spacing: -0.01em; outline: none; }
.assess-help { margin-top: 0.9rem; color: var(--text-muted); max-width: 60ch; }
.assess-card { animation: assess-in 380ms cubic-bezier(.2, .8, .2, 1) both; }

.assess-options { display: grid; gap: 0.75rem; margin-top: clamp(1.5rem, 4vw, 2.25rem); }
.assess-opt {
  position: relative; display: flex; align-items: center; gap: 1rem; cursor: pointer;
  padding: 1.05rem 1.25rem; border: 1px solid var(--border); border-radius: calc(var(--radius) + 2px);
  background: var(--surface); font-weight: 600; line-height: 1.35;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}
.assess-opt:hover { border-color: color-mix(in srgb, var(--as-accent) 55%, var(--border)); }
.assess-opt input { position: absolute; opacity: 0; pointer-events: none; }
.assess-radio {
  flex: 0 0 auto; width: 1.3rem; height: 1.3rem; border-radius: 50%;
  border: 1.5px solid color-mix(in srgb, var(--text) 45%, transparent); display: grid; place-items: center;
  transition: border-color 0.15s;
}
.assess-radio::after { content: ''; width: 0.6rem; height: 0.6rem; border-radius: 50%; background: var(--as-accent); transform: scale(0); transition: transform 0.18s cubic-bezier(.3, 1.6, .5, 1); }
.assess-opt.is-on { border-color: var(--as-accent); background: color-mix(in srgb, var(--as-accent) 7%, var(--surface)); box-shadow: 0 0 0 1px var(--as-accent); }
.assess-opt.is-on .assess-radio { border-color: var(--as-accent); }
.assess-opt.is-on .assess-radio::after { transform: scale(1); }
.assess-opt:has(input:focus-visible) { outline: 2px solid var(--as-accent); outline-offset: 2px; }

/* nav */
.assess-nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: clamp(1.75rem, 4vw, 2.5rem); }
.assess-nav--end { justify-content: flex-end; }
.assess-next { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: flex-end; margin-left: auto; }
.assess-nudge { font-size: 0.88rem; color: var(--text-muted); }
.assess .btn { --btn-case: none; --btn-tracking: 0.01em; --btn-size: 0.95rem; }

/* intro */
.assess-facts { list-style: none; padding: 0; margin: 1.75rem 0 0; display: flex; flex-wrap: wrap; gap: 0.6rem 1.75rem; color: var(--text-muted); }
.assess-facts b { color: var(--text); }

/* results */
.assess-score { display: flex; align-items: center; gap: clamp(1.25rem, 4vw, 2.5rem); margin-top: 1.25rem; flex-wrap: wrap; }
.assess-level { margin-top: 0; }
.assess-ring { position: relative; width: clamp(110px, 18vw, 150px); flex: 0 0 auto; }
.assess-ring svg { display: block; width: 100%; transform: rotate(-90deg); }
.assess-ring-track { fill: none; stroke: color-mix(in srgb, var(--text) 9%, transparent); stroke-width: 8; }
.assess-ring-fill {
  fill: none; stroke: var(--as-accent); stroke-width: 8; stroke-linecap: round;
  stroke-dasharray: var(--p) 100; animation: assess-ring 1200ms cubic-bezier(.4, .1, .2, 1) 150ms both;
}
.assess-ring span { position: absolute; inset: 0; display: grid; place-items: center; font-family: var(--font-display); font-weight: var(--display-weight, 700); font-size: clamp(1.8rem, 4vw, 2.4rem); }

.assess-cats { list-style: none; padding: 0; margin: 1.5rem 0 0; display: grid; gap: 1.6rem; }
.assess-cat-head { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; font-weight: 600; }
.assess-cat-level { color: var(--text-muted); font-weight: 500; font-variant-numeric: tabular-nums; }
.assess-track { margin-top: 0.6rem; height: 10px; border-radius: 99px; background: color-mix(in srgb, var(--text) 8%, transparent); overflow: hidden; }
.assess-track span {
  display: block; height: 100%; width: calc(var(--p) * 1%); min-width: 4px; border-radius: inherit; background: var(--as-accent);
  transform-origin: left center; animation: assess-grow 1000ms cubic-bezier(.2, .8, .2, 1) var(--d, 0ms) both;
}
.assess-insight { margin-top: 0.6rem; color: var(--text-muted); font-size: 0.95rem; }
.assess-thanks { margin-top: 1rem; font-weight: 600; }

/* capture */
.assess-form { margin-top: 1.5rem; }
:deep(.assess-fields) { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
:deep(.assess-input) { display: grid; gap: 0.4rem; min-width: 0; }
:deep(.assess-input label) { font-size: 0.85rem; font-weight: 600; }
:deep(.assess-input input) {
  font: inherit; width: 100%; min-width: 0; box-sizing: border-box; padding: 0.75rem 0.9rem; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--bg); color: var(--text);
}
:deep(.assess-input input:focus) { outline: 2px solid var(--as-accent); outline-offset: 1px; border-color: transparent; }
.assess-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.assess-error { margin-top: 1rem; color: #c0392b; font-size: 0.9rem; }

@keyframes assess-in   { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes assess-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes assess-ring { from { stroke-dasharray: 0 100; } }

@media (max-width: 560px) {
  .assess-nav .btn:not(.btn--link) { flex: 1 1 auto; text-align: center; }
  .assess-next { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .assess-card, .assess-track span, .assess-ring-fill { animation: none !important; }
  .assess-bar span, .assess-radio::after { transition: none !important; }
}
</style>
