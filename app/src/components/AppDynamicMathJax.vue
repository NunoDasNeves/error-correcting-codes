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
        //while(this.$refs.mathJaxElWrapper.childNodes.length) {
        //  this.$refs.mathJaxElWrapper.removeChild(this.$refs.mathJaxElWrapper.lastChild)
        //}
        // add dom element with new data
        //this.$refs.mathJaxElWrapper.innerHTML = `<span>${ this.data }</span>`
        // re-typeset
        this.updateMathJax()
      }
    },

    methods: {
      async waitForMathJax() {
        let i = 0
        while (!window.MathJax) {
          await new Promise(resolve => setTimeout(resolve, 100))
          i++
          if (i > 50) throw Error("MathJax not loaded")
        }
      },
      async renderMathJax () {
        await this.waitForMathJax()
        window.MathJax.Hub.Queue([
          'Typeset',
          window.MathJax.Hub,
          this.$refs.mathJaxElWrapper.firstChild
        ])
      },
      // kind of a hack
      strip_dollars(s) {
        while(s.startsWith('$') && s.endsWith('$')) s = s.slice(1,-1)
        return s
      },
      async updateMathJax () {
        await this.waitForMathJax()
        window.MathJax.Hub.Queue([
          'Text',
          window.MathJax.Hub.getAllJax(this.$refs.mathJaxElWrapper)[0],
          this.strip_dollars(this.data)
        ])
      }
    },
    mounted () {
      this.renderMathJax()
    }
  }
</script>
