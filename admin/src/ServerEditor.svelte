<script lang="ts">
  import { Button, TextField, Textarea } from 'svelte-materialify';
  export let server;
  export let save: (server) => void;
  export let cancel: () => void;
</script>

<form on:submit|preventDefault={() => save(server)}>
  <h4>Редактор серверов</h4>
  <TextField class="mt-4 mb-4" required bind:value={server.name}>Название</TextField>
  <Textarea required autogrow rows={1} bind:value={server.description}>Описание</Textarea>
  <TextField class="mt-4" required type="url" bind:value={server.image}>Ссылка на катринку</TextField>
  <TextField class="mt-4" required pattern="[0-9]+" bind:value={server.price}>Цена</TextField>
  <TextField class="mt-4" required bind:value={server.donationalerts}>DonationAlerts ID</TextField>
  <div class="d-flex justify-end align-center mt-2">
    <Button text on:click={() => cancel()}>Отмена</Button>
    <Button class="primary-color ml-4" type="submit">Сохранить</Button>
  </div>
</form>
