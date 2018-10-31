<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/encoder">Convolutional Encoder</router-link> |
      <router-link to="/decoder">Viterbi Decoder</router-link>
    </div>
    <router-view/>
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
  // borders
  --border-dark: 1px solid var(--color-gray);
  --border: 1px solid var(--color-light-gray);
  --border-thick: 2px solid rgba(160, 178, 178, 0.5);
  --box-shadow-active: 0px 0px 0px 1px #ddd;
  // font format
  --header-1: 600 3rem /1.2 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --header-1-mobile: 600 2rem /1.1 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --header-2: 600 2.25rem /1.2 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --header-2-mobile: 600 1.625rem /1.2 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --header-3: 400 1.6rem /1.3 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --header-3-mobile: 400 1.4rem /1.2 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --header-4: 400 1.15rem /1.4 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --body-copy-1: 400 1rem /1.6 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --body-copy-2: 400 0.85rem /1.6 -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-large: 40px;
  --font-large-mobile: 24px;
  --font-medium: 20px;
  --font-medium-mobile: 16px;
  --font-small: 16px;
  --font-small-mobile: 12px;
}

#app {
  background-color: var(--color-very-light-gray);
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
  color: rgba(0,0,0,.84);
  font-size: 16px;
  line-height: 1.4;
  font-family: -apple-system, BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
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
