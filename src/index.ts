import Fastify from 'fastify';
import { resolve } from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fastifyStatic from 'fastify-static';
import fastifyJWT from 'fastify-jwt';
import fastifyPOV from 'point-of-view';
import fastifyFormbody from 'fastify-formbody';
import { verify, hash } from 'argon2';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
import 'dotenv/config';

const server = Fastify({ logger: { level: 'info' } });

server.register(fastifyFormbody);

server.register(fastifyStatic, {
  root: resolve(__dirname, '../public/dist/'),
  prefix: '/dist/'
});

server.register(fastifyStatic, {
  root: resolve(__dirname, '../public/img/'),
  prefix: '/img/',
  decorateReply: false
});

server.register(fastifyStatic, {
  root: resolve(__dirname, '../admin/public/'),
  prefix: '/admin/',
  decorateReply: false
});

server.register(fastifyPOV, {
  engine: {
    ejs: require('ejs')
  },
  root: resolve(__dirname, '../public/')
});

server.register(fastifyJWT, {
  secret: process.env.JWT_SECRET
});

server.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(400).send({ error: 'Ошибка авторизации' });
  }
});

server.setNotFoundHandler((_req, reply) => reply.code(404).sendFile('404.html', resolve(__dirname, '../public/')));

server.get('/', async (_req, reply) =>
  reply.view('index.ejs', {
    servers: await db.server.findMany({
      select: {
        price: true,
        image: true,
        description: true,
        name: true,
        id: true
      }
    })
  })
);

server.post('/', async (req: any, reply) => {
  reply.header('Content-Type', 'text/html; charset=UTF-8');
  const server = await db.server.findUnique(req.body.server);
  if (!server) return `<!DOCTYPE html><html><head></head><body>Произошла ошибка. Попробуйте еще раз.</body></html>`;
  const formdata = new FormData();
  formdata.append(
    'data',
    `step=billing&currency=2&amount=${server.price}&email=${req.body.email}&billing_system_type=${req.body.billing}&name=${req.body.nick}&comment=${server.name} ${
      req.body.vk
    }&phone=${req.body.phone ?? ''}&phone_number=${req.body.phone_number ?? ''}`.replace(/\+/g, '%2B')
  );
  const res = await fetch(`https://www.donationalerts.com/u/${server.donationalerts}`, {
    method: 'POST',
    headers: formdata.getHeaders(),
    body: formdata
  });
  if (!res.ok)
    return `<!DOCTYPE html><html><head></head><body>Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/${server.donationalerts}">https://www.donationalerts.com/r/${server.donationalerts}</a></body></html>`;
  const json = await res.json();
  console.log(json);
  if (!json.invoice_page_url)
    return `<!DOCTYPE html><html><head></head><body>Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/${server.donationalerts}">https://www.donationalerts.com/r/${server.donationalerts}</a></body></html>`;
  return `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="7; url='${json.invoice_page_url}'" /></head><body><p>Перенаправление. Если вас не перенаправило автоматически, нажмите <a href="${json.invoice_page_url}">сюда</a>.</p></body></html>`;
});

server.post('/api/login', async (req: any, reply) => {
  const user = await db.user.findUnique({
    where: {
      username: req.body.username
    }
  });
  if (!user) return reply.code(400).send({ error: 'Неверный логин' });
  if (!(await verify(user.password, req.body.password))) return reply.code(400).send({ error: 'Неверный пароль' });
  return { token: server.jwt.sign({ username: user.username, isAdmin: user.username }), isAdmin: user.isAdmin };
});

server.get(
  '/api/servers',
  { preValidation: [(server as any).authenticate] },
  async (_req, _reply) =>
    await db.server.findMany({
      select: {
        id: true,
        name: true
      }
    })
);

server.post('/api/servers', { preValidation: [(server as any).authenticate] }, async req => {
  await db.server.create({
    data: req.body as any
  });
  return {};
});

server.get('/api/servers/:id', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
  const server = await db.server.findUnique({
    where: {
      id: Number((req.params as any).id)
    }
  });
  if (!server) return reply.code(400).send({ error: 'Сервера не существует' });
  return server;
});

server.put('/api/servers/:id', { preValidation: [(server as any).authenticate] }, async req => {
  await db.server.update({
    where: {
      id: Number((req.params as any).id)
    },
    data: req.body as any
  });
  return {};
});

server.delete('/api/servers/:id', { preValidation: [(server as any).authenticate] }, async req => {
  await db.server.delete({ where: { id: Number((req.params as any).id) } });
  return {};
});

server.post('/api/changepassword', { preValidation: [(server as any).authenticate] }, async req => {
  await db.user.update({
    where: {
      username: (req.user as any).username
    },
    data: {
      password: await hash((req.body as any).password)
    }
  });
  return {};
});

server.get('/api/users', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
  if (!(req.user as any).isAdmin) reply.code(400).send({ error: 'Недостаточно прав' });
  return await db.user.findMany({
    select: {
      isAdmin: true,
      username: true
    }
  });
});

server.post('/api/users', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
  if (!(req.user as any).isAdmin) reply.code(400).send({ error: 'Недостаточно прав' });
  const password = Math.random().toString(36).substring(2); //random string
  await db.user.create({
    data: {
      isAdmin: (req.body as any).isAdmin,
      username: (req.body as any).username,
      password: await hash(password)
    }
  });
  return { password };
});

server.delete('/api/users/:username', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
  if (!(req.user as any).isAdmin) reply.code(400).send({ error: 'Недостаточно прав' });
  await db.user.delete({
    where: req.params
  });
  return {};
});

server.listen(process.env.PORT ?? 3000, process.env.HOST ?? 'localhost');
