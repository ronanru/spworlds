<script lang="ts">
  import { List, ListItem, Button, Icon, ProgressCircular } from 'svelte-materialify';
  import { mdiDelete, mdiPlus } from '@mdi/js';
  import { getUsers, createUser, deleteUser } from './requests';

  export let reload;

  const addUser = isAdmin => {
    const username = prompt('Введите имя пользователя');
    if (!username) return;
    createUser({ username, isAdmin }).then(({ password }) => {
      alert(`Пароль для ${username}: ${password}`);
      reload();
    });
  };

  const deleteUserConfirm = username => {
    if (confirm('Вы действительно хотите удалить этого пользователя?')) deleteUser(username).then(() => reload());
  };
</script>

{#await getUsers()}
  <ProgressCircular indeterminate color="primary" class="mr-auto ml-auto" style="width:100%;" />
{:then users}
  <List>
    <h4 class="mb-4">Пользователи</h4>
    {#each users as user}
      <ListItem class="rounded">
        <h6>{user.username} {user.isAdmin ? '(Администратор)' : ''}</h6>
        <span slot="append">
          <Button class="red white-text ml-1" on:click={() => deleteUserConfirm(user.username)}>
            <Icon path={mdiDelete} />
          </Button>
        </span>
      </ListItem>
    {/each}
    <ListItem class="rounded">
      <div class="d-flex justify-space-around align-center">
        <Button text class="primary-text" on:click={() => addUser(false)}><Icon path={mdiPlus} />Добавить Модератора</Button>
        <Button text class="primary-text" on:click={() => addUser(true)}><Icon path={mdiPlus} />Добавить Администратора</Button>
      </div>
    </ListItem>
  </List>
{/await}
