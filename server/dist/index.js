"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = fastify_1.default({ logger: { level: 'info' } });
server.register(require('fastify-formbody'));
server.post('/', async (req) => {
    var _a, _b;
    const res = await fetch('https://www.donationalerts.com/u/ronedit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(`step=billing&currency=2&amount=${[3500, 1500, 1000][req.body.server]}&email=${req.body.email}&billing_system_type=${req.body.billing}&name=АвтоДонат&comment=${req.body.vk}&phone=${(_a = req.body.phone) !== null && _a !== void 0 ? _a : ''}&phone_number=${(_b = req.body.phone_number) !== null && _b !== void 0 ? _b : ''}`)}`
    });
    if (req.ok) {
        const json = await res.json();
        if (!json.invoice_page_url)
            return 'Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/spworlds">https://www.donationalerts.com/r/spworlds</a>';
        return `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="7; url='${json.invoice_page_url}'" /></head><body><p>Перенаправление. Если вас не перенаправило автоматически, нажмите <a href="${json.invoice_page_url}">сюда</a>.</p></body></html>`;
    }
    else {
        return 'Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/spworlds">https://www.donationalerts.com/r/spworlds</a>';
    }
});
server.listen(3000);
