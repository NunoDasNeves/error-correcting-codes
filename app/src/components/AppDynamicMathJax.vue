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
        console.log("data changed!")
        while(this.$refs.mathJaxElWrapper.childNodes.length) {
          this.$refs.mathJaxElWrapper.removeChild(this.$refs.mathJaxElWrapper.lastChild)
        }
        this.$refs.mathJaxElWrapper.innerHTML = `<span>${ this.data }</span>`

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
