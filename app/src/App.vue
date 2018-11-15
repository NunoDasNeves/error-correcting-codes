<template>
  <div id="app">
    <div id="nav">
      <div id="header">
        <h3>Interactive Algorithms</h3>
        <span style="font-size:12px;">by Nuno Das Neves</span>
      </div>
      <div style="padding-bottom:8px;border-bottom:solid var(--color-dark-gray) 1px;width:170px;">
        <router-link to="/">Info</router-link>
      </div>
      <div style="padding-top:8px;">
        <router-link to="/encoder/">Convolutional Codes</router-link><br>
        <router-link to="/decoder/">Viterbi Algorithm</router-link><br>
        <router-link to="/pagerank/">PageRank</router-link>
      </div>
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
  --color-dark-gray: #858585;
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
  display:flex;
  min-height:100%;
}

#content {
  padding:20px;
  height:100%;
  margin:0 auto;
}

#nav {
  min-height:100%;
  padding:20px;
  width:220px;
  background-color: var(--color-light-gray);
}

#header {
  line-height: 1.2;
  margin-bottom: 20px;
}

#nav h3 {
  margin:0;
}

#nav li {
  margin-left:20px;
}

html, body {
  background-color: var(--color-very-light-gray);
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
  height:100%;
}

section {
  margin-top:12px;
  padding: 10px 25px;
  background: var(--color-white);
  text-align: left;
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

a {
  color:var(--color-theme);
  text-decoration: none;
}

a:hover {
  color:var(--color-theme-light);
}

.main-content {
  /* arbitrary */
  min-height: calc(100vh - 85px);
  width: 1000px;
  text-align: center;
}

input, textarea {
  outline: none;
  border: none;
}
</style>
