<script lang="ts">
  import { MaterialApp } from 'svelte-materialify';
  import Login from './Login.svelte';
  import Servers from './Servers.svelte';
  import auth from './auth';
</script>

<MaterialApp>
  <main class="pa-16 mr-auto ml-auto" style="max-width: 750px;">
    {#if $auth}
      <Servers />
    {:else}
      <Login />
    {/if}
  </main>
</MaterialApp>
