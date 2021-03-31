<script lang="ts">
  import { List, ListItem, Button, Icon, ProgressCircular } from 'svelte-materialify';
  import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
  import { getServers, createServer, deleteServer, getServer, updateServer, changePassword } from './requests';
  import Users from './Users.svelte';
  import ServerEditor from './ServerEditor.svelte';
  import auth from './auth';

  let action = 'view';

  const createServerSave = server =>
    createServer({
      name: server.name,
      description: server.description,
      price: Number(server.price),
      image: server.image,
      donationalerts: server.donationalerts
    }).then(() => (action = 'view'));

  const deleteServerConfirm = serverId => {
    if (confirm('Вы действительно хотите удалить этот сервер?')) deleteServer(serverId).then(() => reload());
  };

  let selectedServer = 0;

  const selectServerForUpdate = serverId => {
    selectedServer = serverId;
    action = 'update';
  };

  const updateServerSave = (serverId, server) => updateServer(server, serverId).then(() => (action = 'view'));

  const changePasswordSave = () => {
    const password = prompt('Введите новый пароль');
    if (!password) return;
    changePassword(password).then(() => alert('Пароль успешно изменен'));
  };

  const reload = () => {
    action = 'loading';
    setTimeout(() => {
      action = 'view';
    }, 10);
  };
</script>

{#if action === 'view'}
  {#await getServers()}
    <ProgressCircular indeterminate color="primary" class="mr-auto ml-auto" style="width:100%;" />
  {:then servers}
    <List>
      <h4 class="mb-4">Сервера</h4>
      {#each servers as server}
        <ListItem class="rounded">
          <h6>{server.name}</h6>
          <span slot="append">
            <Button class="primary-color mr-1" on:click={() => selectServerForUpdate(server.id)}><Icon path={mdiPencil} /></Button>
            <Button class="red white-text ml-1" on:click={() => deleteServerConfirm(server.id)}>
              <Icon path={mdiDelete} />
            </Button>
          </span>
        </ListItem>
      {/each}
      <ListItem class="rounded">
        <Button text class="primary-text ml-auto mr-auto d-flex" on:click={() => (action = 'create')}><Icon path={mdiPlus} />Новый Сервер</Button>
      </ListItem>
    </List>
  {/await}
  {#if $auth.isAdmin}
    <Users {reload} />
  {/if}
  <List>
    <h4 class="mb-4">Управление аккаунтом</h4>
    <ListItem class="rounded">
      <Button text class="primary-text ml-auto mr-auto d-flex" on:click={changePasswordSave}>Сменить пароль</Button>
    </ListItem>
  </List>
{:else if action === 'create'}
  <ServerEditor
    server={{
      name: '',
      description: '',
      price: '',
      image: '',
      donationalerts: ''
    }}
    cancel={() => (action = 'view')}
    save={createServerSave}
  />
{:else if action === 'update'}
  {#await getServer(selectedServer)}
    <ProgressCircular indeterminate color="primary" class="mr-auto ml-auto" style="width:100%;" />
  {:then server}
    <ServerEditor {server} cancel={() => (action = 'view')} save={server => updateServerSave(server.id, server)} />
  {/await}
{:else}
  <ProgressCircular indeterminate color="primary" class="mr-auto ml-auto" style="width:100%;" />
{/if}
