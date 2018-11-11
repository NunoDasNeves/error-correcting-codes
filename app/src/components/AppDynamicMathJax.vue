<template>
  <span ref="mathJaxElWrapper">
    <span>{{ data }}</span>
  </span>
</template>

<script type="text/javascript">
  export default {
    props:['data'],

    watch: {
      data () {
        // clumsily remove dom elements that mathjax replaced
        while(this.$refs.mathJaxElWrapper.childNodes.length) {
          this.$refs.mathJaxElWrapper.removeChild(this.$refs.mathJaxElWrapper.lastChild)
        }
        // add dom element with new data
        this.$refs.mathJaxElWrapper.innerHTML = `<span>${ this.data }</span>`
        // re-typeset
        this.renderMathJax()
      }
    },

    methods: {
      renderMathJax () {
        if (window.MathJax) {
          window.MathJax.Hub.Queue([
            'Typeset',
            window.MathJax.Hub,
            this.$refs.mathJaxElWrapper.firstChild
          ])
        }
      }
    },
    mounted() {
      this.renderMathJax()
    }
  }
</script>
