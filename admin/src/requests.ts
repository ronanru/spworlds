import wretch from 'wretch';
import auth from './auth';

let token = '';

auth.subscribe(authData => {
  if (authData) token = authData.token;
});

const api = wretch('/api/')
  .errorType('json')
  .resolve(res => res.badRequest(err => alert(err.json.error ?? err.message)).json());

interface Server {
  name: string;
  id: number;
  description: string;
  image: string;
  donationalerts: string;
  price: number;
}

interface User {
  username: string;
  isAdmin: boolean;
}

export const login = loginFormData => api.url('login').post(loginFormData);
export const getServers = () => api.auth(`Bearer ${token}`).url('servers').get() as Promise<Server[]>;
export const createServer = createServerFormData => api.auth(`Bearer ${token}`).url('servers').post(createServerFormData);
export const getServer = serverId => api.auth(`Bearer ${token}`).url(`servers/${serverId}`).get() as Promise<Server>;
export const updateServer = (updateServerFormData, serverId) => api.auth(`Bearer ${token}`).url(`servers/${serverId}`).put(updateServerFormData);
export const deleteServer = serverId => api.auth(`Bearer ${token}`).url(`servers/${serverId}`).delete();
export const changePassword = password => api.auth(`Bearer ${token}`).url('changepassword').post({ password });
export const getUsers = () => api.auth(`Bearer ${token}`).url('users').get() as Promise<User[]>;
export const createUser = userData => api.auth(`Bearer ${token}`).url('users').post(userData) as Promise<{ password: string }>;
export const deleteUser = username => api.auth(`Bearer ${token}`).url(`users/${username}`).delete();
