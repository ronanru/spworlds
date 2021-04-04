import Fastify from 'fastify';
import { resolve } from 'path';
import fastifyStatic from 'fastify-static';
import fastifyPOV from 'point-of-view';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
import 'dotenv/config';
import api from './api';
import main_page from './main_page';

const server = Fastify({ logger: { level: 'info' } });

// Публичные страницы
server.register(fastifyStatic, {
  root: resolve(__dirname, '../public/dist/'),
  prefix: '/dist/'
});

server.register(fastifyStatic, {
  root: resolve(__dirname, '../public/img/'),
  prefix: '/img/',
  decorateReply: false
});

server.register(fastifyPOV, {
  engine: {
    ejs: require('ejs')
  },
  root: resolve(__dirname, '../public/')
});

server.register(main_page, { db });

// Админка
server.register(fastifyStatic, {
  root: resolve(__dirname, '../admin/public/'),
  prefix: '/admin/',
  decorateReply: false
});

server.register(api, { prefix: '/api/', db });

// Страница 404
server.setNotFoundHandler((_req, reply) => reply.code(404).sendFile('404.html', resolve(__dirname, '../public/')));

server.listen(process.env.PORT ?? 3000, process.env.HOST ?? 'localhost');
