<template>
  <span ref="mathJaxElWrapper">
    <span><slot></slot></span>
  </span>
</template>

<script type="text/javascript">
  export default {

    methods: {
      renderMathJax () {
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
