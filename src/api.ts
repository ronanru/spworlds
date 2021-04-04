import fastifyJWT from 'fastify-jwt';
import { verify, hash } from 'argon2';

export default async (server, { db }) => {
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

  // LOGIN
  server.post('/login', async (req: any, reply) => {
    const user = await db.user.findUnique({
      where: {
        username: req.body.username
      }
    });
    if (!user) return reply.code(400).send({ error: 'Неверный логин' });
    if (!(await verify(user.password, req.body.password))) return reply.code(400).send({ error: 'Неверный пароль' });
    return { token: server.jwt.sign({ username: user.username, isAdmin: user.username }), isAdmin: user.isAdmin };
  });

  // GET SERVERS LIST
  server.get(
    '/servers',
    { preValidation: [(server as any).authenticate] },
    async (_req, _reply) =>
      await db.server.findMany({
        select: {
          id: true,
          name: true
        }
      })
  );

  // CREATE SERVER
  server.post('/servers', { preValidation: [(server as any).authenticate] }, async req => {
    await db.server.create({
      data: req.body as any
    });
    return {};
  });

  // GET SERVER
  server.get('/servers/:id', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
    const server = await db.server.findUnique({
      where: {
        id: Number((req.params as any).id)
      }
    });
    if (!server) return reply.code(400).send({ error: 'Сервера не существует' });
    return server;
  });

  // UPDATE SERVER
  server.put('/servers/:id', { preValidation: [(server as any).authenticate] }, async req => {
    await db.server.update({
      where: {
        id: Number((req.params as any).id)
      },
      data: req.body as any
    });
    return {};
  });

  // DELETE SERVER
  server.delete('/servers/:id', { preValidation: [(server as any).authenticate] }, async req => {
    await db.server.delete({ where: { id: Number((req.params as any).id) } });
    return {};
  });

  // CHANGE PASSWORD
  server.post('/changepassword', { preValidation: [(server as any).authenticate] }, async req => {
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

  // GET USERS LIST
  server.get('/users', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
    if (!(req.user as any).isAdmin) reply.code(400).send({ error: 'Недостаточно прав' });
    return await db.user.findMany({
      select: {
        isAdmin: true,
        username: true
      }
    });
  });

  // CREATE USER
  server.post('/users', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
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

  // DELETE USER
  server.delete('/users/:username', { preValidation: [(server as any).authenticate] }, async (req, reply) => {
    if (!(req.user as any).isAdmin) reply.code(400).send({ error: 'Недостаточно прав' });
    await db.user.delete({
      where: req.params
    });
    return {};
  });
};
