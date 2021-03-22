import Fastify from 'fastify';
import { resolve } from 'path';
import fetch from 'node-fetch';

const server = Fastify({ logger: { level: 'info' } });

server.register(require('fastify-formbody'));

server.register(require('fastify-static'), {
  root: resolve(__dirname, '../public')
});

server.post('/', async (req: any, resp) => {
  const res = await fetch('https://www.donationalerts.com/u/ronedit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `data=${encodeURIComponent(
      `step=billing&currency=2&amount=${[3500, 1500, 1000][req.body.server]}&email=${req.body.email}&billing_system_type=${req.body.billing}&name=АвтоДонат&comment=${
        req.body.vk
      }&phone=${req.body.phone ?? ''}&phone_number=${req.body.phone_number ?? ''}`
    )}`
  });
  resp.header('Content-Type', 'text/html; charset=UTF-8');
  if (res.ok) {
    const json = await res.json();
    if (!json.invoice_page_url)
      return '<!DOCTYPE html><html><head></head><body>Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/spworlds">https://www.donationalerts.com/r/spworlds</a></body></html>';
    return `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="7; url='${json.invoice_page_url}'" /></head><body><p>Перенаправление. Если вас не перенаправило автоматически, нажмите <a href="${json.invoice_page_url}">сюда</a>.</p></body></html>`;
  } else {
    return '<!DOCTYPE html><html><head></head><body>Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/spworlds">https://www.donationalerts.com/r/spworlds</a></body></html>';
  }
});

server.listen(process.env.PORT ?? 3000, '0.0.0.0');
