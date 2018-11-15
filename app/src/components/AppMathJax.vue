<template>
  <span ref="mathJaxElWrapper">
    <span><slot></slot></span>
  </span>
</template>

<script type="text/javascript">
  export default {

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
      }
    },
    mounted() {
      this.renderMathJax()
    }
  }
</script>
