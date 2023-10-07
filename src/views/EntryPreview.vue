<script setup>

import { saveAs } from 'file-saver'

import MarkerDropdown from "@/views/MarkerDropdown.vue";
import {ref} from "vue";
import {useIGTStore} from "@/stores/igt";

const props = defineProps(['entry'])
const values = ref({})
const store = useIGTStore()

function formatEntry(entry, format) {
  const templates = {
    latex: `\\begin{samepage}
\\begin{exe}
\\ex\\label{%ref%}
%top%
\\gll %text% \\\\
%gloss% \\\\
\`%translation%'
\\hfill %cit%
\\end{exe}
\\end{samepage}`,
    tsv: `%top%
%text%
%gloss%
%translation%`,
    toolbox: `\\ref %ref%
\\tx %top%
\\mb %text%
\\gl %gloss%
\\ft %translation%`
  }

  if (!(format in templates))
    return ''

  let res = templates[format]

  console.log(values.value)
  for (let [key, val] of Object.entries(values.value))
    res = res.replace(`%${key}%`, val in entry ? entry[val] : '')

  return res
}

function getExtension(format) {
  const extentions = {
    'latex': '.tex',
    'tsv': '.csv',
    'toolbox': '.txt'
  }

  return format in extentions ? extentions[format] : '.txt'
}

function exportEntry(format, action) {
  const value = formatEntry(props.entry, format)
  if (action === 'copy')
    navigator.clipboard.writeText(value)

  if (action === 'save')
    saveAs(new Blob([value], {type: 'text/plain'}), store.selectedFile.name + getExtension(format))
}

function exportText(format, action) {
  const value = store.selectedFile.parsed.entries.map(entry => formatEntry(entry, format)).join('\n\n')
  if (action === 'copy')
    navigator.clipboard.writeText(value)

  if (action === 'save')
    saveAs(new Blob([value], {type: 'text/plain'}), store.selectedFile.name + getExtension(format))
}

</script>

<template>
  <div id="toolboxPreview">
  <div id="setup"><h4>Template</h4>
  <pre>
\begin{samepage}
\begin{exe}
    \ex\label{<MarkerDropdown placeholder="LABEL" :entry="props.entry" v-model="values.ref"/>}
    <MarkerDropdown placeholder="TOP LINE" :entry="props.entry" v-model="values.top"/>
    \gll <MarkerDropdown placeholder="TEXT LINE" :entry="props.entry" v-model="values.text"/> \\
    <MarkerDropdown placeholder="GLOSS LINE" :entry="props.entry" v-model="values.gloss"/> \\
    \trans `<MarkerDropdown placeholder="TRANSLATION" :entry="props.entry" v-model="values.translation"/>'
    \hfill {<MarkerDropdown placeholder="REFERENCE" :entry="props.entry" v-model="values.cit"/>}
\end{exe}
\end{samepage}
  </pre>
  </div>
  <div id="preview"><h4>Example</h4>
  <figure data-example-number="1">
    <div id="igt" data-gloss>
      <p class="top" v-if="values.top">{{ props.entry[values.top] }}</p>
      <p class="text" v-if="values.text">{{ props.entry[values.text] }}</p>
      <p class="gloss" v-if="values.gloss">{{ props.entry[values.gloss] }}</p>
      <p class="transl" v-if="values.translation">"{{ props.entry[values.translation] }}"</p>
      <p class="cit" v-if="values.cit">({{ props.entry[values.cit] }})</p>
    </div>
  </figure>
    <div class="btn-group">
      <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        Download
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#" @click="exportText('latex', 'save', $event)">Text as LaTeX</a></li>
        <li><a class="dropdown-item" href="#" @click="exportText('tsv', 'save', $event)">Text as TSV</a></li>
        <li><a class="dropdown-item" href="#" @click="exportText('toolbox', 'save', $event)">Text as Toolbox</a></li>
      </ul>
    </div>

    <div class="btn-group">
      <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        Copy to clipboard
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#" @click="exportEntry('latex', 'copy', $event)">Entry as LaTeX</a></li>
        <li><a class="dropdown-item" href="#" @click="exportEntry('tsv', 'copy', $event)">Entry as TSV</a></li>
        <li><a class="dropdown-item" href="#" @click="exportEntry('toolbox', 'copy', $event)">Entry as Toolbox</a></li>
        <li><hr class="dropdown-divider"/></li>
        <li><a class="dropdown-item" href="#" @click="exportText('latex', 'copy', $event)">Text as LaTex</a></li>
        <li><a class="dropdown-item" href="#" @click="exportText('tsv', 'copy', $event)">Text as TSV</a></li>
        <li><a class="dropdown-item" href="#" @click="exportText('toolbox', 'copy', $event)">Text as Toolbox</a></li>
      </ul>
    </div>
  </div>
  </div>
</template>
<style scoped>
#toolboxPreview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8rem;
}
figure {
  margin: 0 0 .5rem;
}

.btn {
  margin: .25rem .125rem ;
}

figure p {
  margin-bottom: 0
}

figure p.text, figure p.gloss {
  font-family: monospace;
}

figure p.transl {
  margin-top: .6rem ;
}

figure p.cit {
  text-align: right;
}

[data-example-number] {
  display: flex;
}

[data-example-number]::before {
  content: "(" attr(data-example-number) ")";
  //margin-top: 1em; /* match default <p> margin-top */
  margin-right: 1em;
}
</style>