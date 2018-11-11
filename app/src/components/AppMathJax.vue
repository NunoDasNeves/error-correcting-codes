<template>
  <span ref="mathJaxEl"><slot></slot></span>
</template>

<script type="text/javascript">
  export default {
    /*props:['data'],*/

    /*watch: {
      data () {
        this.renderMathJax()
      }
    },*/

    methods: {
      renderMathJax () {
        if (window.MathJax) {
          window.MathJax.Hub.Queue([
            'Typeset',
            window.MathJax.Hub,
            this.$refs.mathJaxEl
          ])
        }
      }
    },
    mounted() {
      this.renderMathJax()
    }
  }
</script>
