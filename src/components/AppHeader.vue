<script setup>
</script>

<template>
  <nav class="navbar navbar-dark bg-dark shadow-sm navbar-expand-lg">
    <div class="container-md">
      <a class="navbar-brand" href="#">The Best Banking Company</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Clients</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/accounts">Accounts</a>
          </li>
        </ul>
        <div class="mt-2 mt-md-0 user">
          John Doe
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
nav .navbar-collapse .user {
  color: #bbb;
  font-size: 80%;
}
</style>