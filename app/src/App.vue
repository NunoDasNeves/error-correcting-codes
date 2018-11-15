<template>
  <div id="app">
    <div id="nav">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li>
          <ul>
            <li><router-link to="/encoder/">Convolutional Encoder</router-link></li>
            <li><router-link to="/decoder/">Viterbi Decoder</router-link></li>
            <li><router-link to="/pagerank/">PageRank</router-link></li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="less">
:root {
  // colors
  --color-theme: #4d96ff;
  --color-theme-light: #a7cdff;
  --color-white: #fefefe;
  --color-black: #111;
  --color-gray: #d5d5d5;
  --color-light-gray: #eaeaea;
  --color-very-light-gray: #f9f9f9;
  --color-invalid: #f36015;
  --color-warning: var(--color-invalid);
  --color-warning-light: #ff9552;
  --color-dark-green: #55cc11;
  --color-green: #33cc33;
  --color-light-green: #66ee66;
  --color-light-blue: #1144ff;

  --color-bit-input: #ff8888;
  --color-bit-state: #8888ff;
  --color-bit-output: #88ff88;

  // borders
  --border-dark: 1px solid var(--color-gray);
  --border: 1px solid var(--color-light-gray);
  --border-thick: 2px solid rgba(160, 178, 178, 0.5);
  --box-shadow-active: 0px 0px 0px 1px #ddd;
  // font format
  --font-monospace: monospace;
  --font-default: -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;

  --header-1: 600 3rem /1.2 var(--font-default);
  --header-1-mobile: 600 2rem /1.1 var(--font-default);
  --header-2: 600 2.25rem /1.2 var(--font-default);
  --header-2-mobile: 600 1.625rem /1.2 var(--font-default);
  --header-3: 400 1.6rem /1.3 var(--font-default);
  --header-3-mobile: 400 1.4rem /1.2 var(--font-default);
  --header-4: 400 1.15rem /1.4 var(--font-default);
  --body-copy-1: 400 1rem /1.6 var(--font-default);
  --body-copy-2: 400 0.85rem /1.6 var(--font-default);
  --font-large: 40px;
  --font-large-mobile: 24px;
  --font-medium: 20px;
  --font-medium-mobile: 16px;
  --font-small: 16px;
  --font-small-mobile: 12px;
}

#app {
  background-color: var(--color-very-light-gray);
  display:flex;
}

#nav, #content {
  height:100%;
  padding:10px;
}

#nav {
  width:260px;
}

#nav li {
  margin-left:20px;
}

html, body {
  margin: 0;
  padding: 0;
  letter-spacing: 0;
  font-weight: 400;
  font-style: normal;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-black);
  font-size: 16px;
  line-height: 1.9;
  font-family: var(--font-default);
}

section {
    padding: 20px;
}

h1, h2, h3, h4, h5, h6 {
  letter-spacing: normal;
  margin:0;
}

ol, ul {
  margin: 0;
  padding: 0;
}

li {
  list-style-type: none;
}

.main-content {
  /* arbitrary */
  min-height: calc(100vh - 85px);;
  max-width: 800px;
  margin: auto;
  margin-bottom: 20px;
}

input, textarea {
  outline: none;
  border: none;
}
</style>
