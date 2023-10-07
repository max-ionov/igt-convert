<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const curRoute = useRoute()
</script>

<template>
  <header class="top">
    <div class="wrapper container mt-4">
      <h3>{{ curRoute.meta.hasOwnProperty("title") ? curRoute.meta.title : "" }}</h3>
      <p>{{ curRoute.meta.hasOwnProperty("hint") ? curRoute.meta.hint : "" }}</p>
      <nav>
        <RouterLink to="/">Upload</RouterLink>
<!--        <RouterLink to="/settings">Settings</RouterLink>-->
      </nav>
    </div>
  </header>

  <RouterView/>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Old+Standard+TT");

body {
  font-family: "Old Standard TT", serif;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}


nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

</style>
