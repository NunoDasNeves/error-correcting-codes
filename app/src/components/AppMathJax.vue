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
          window.MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            tex2jax: {
              inlineMath: [['$', '$'], ['(', ')']],
              displayMath: [['$$', '$$'], ['[', ']']],
              processEscapes: true,
              processEnvironments: true
            },
            // Center justify equations in code and markdown cells. Elsewhere
            // we use CSS to left justify single line equations in code cells.
            displayAlign: 'center',
            'HTML-CSS': {
              fonts: ['TeX'],
              styles: { '.MathJax_Display': { margin: 0 } },
              linebreaks: { automatic: true }
            }
          })
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
