import fetch from 'node-fetch';
import FormData from 'form-data';
import fastifyFormbody from 'fastify-formbody';

export default async (server, { db }) => {
  server.register(fastifyFormbody);

  // Главная страница
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

  // Обработка формы для доната
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
};
