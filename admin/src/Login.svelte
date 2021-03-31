<script lang="ts">
  import { Button, TextField, Icon } from 'svelte-materialify';
  import { mdiAccount, mdiLock } from '@mdi/js';
  import { login } from './requests';
  import auth from './auth';

  let loginFormData = {
    username: '',
    password: ''
  };

  const onLoginSubmit = () => login(loginFormData).then(auth.set);
</script>

<form on:submit|preventDefault={onLoginSubmit}>
  <h4 class="text--primary">Войти в админку</h4>
  <TextField class="mt-4" autocomplete="username" required bind:value={loginFormData.username}>
    <div slot="prepend-outer">
      <Icon path={mdiAccount} />
    </div>
    Логин
  </TextField>
  <TextField class="mt-4" type="password" autocomplete="current-password" required bind:value={loginFormData.password}>
    <div slot="prepend-outer">
      <Icon path={mdiLock} />
    </div>
    Пароль
  </TextField>
  <Button class="primary-color mt-4" style="width: 100%;" type="submit">Войти</Button>
</form>
