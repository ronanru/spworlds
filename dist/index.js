"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const path_1 = require("path");
const node_fetch_1 = __importDefault(require("node-fetch"));
const form_data_1 = __importDefault(require("form-data"));
const server = fastify_1.default({ logger: { level: 'info' } });
server.register(require('fastify-formbody'));
server.register(require('fastify-static'), {
    root: path_1.resolve(__dirname, '../public')
});
server.post('/', async (req, resp) => {
    var _a, _b;
    const formdata = new form_data_1.default();
    formdata.append('data', `step=billing&currency=2&amount=${[3500, 1500, 1000][req.body.server]}&email=${req.body.email}&billing_system_type=${req.body.billing}&name=АвтоДонат&comment=${req.body.vk}&phone=${(_a = req.body.phone) !== null && _a !== void 0 ? _a : ''}&phone_number=${(_b = req.body.phone_number) !== null && _b !== void 0 ? _b : ''}`.replace(/\+/g, '%2B'));
    const res = await node_fetch_1.default('https://www.donationalerts.com/u/spworlds', {
        method: 'POST',
        headers: formdata.getHeaders(),
        body: formdata
    });
    resp.header('Content-Type', 'text/html; charset=UTF-8');
    if (res.ok) {
        const json = await res.json();
        console.log(json);
        if (!json.invoice_page_url)
            return '<!DOCTYPE html><html><head></head><body>Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/spworlds">https://www.donationalerts.com/r/spworlds</a></body></html>';
        return `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="7; url='${json.invoice_page_url}'" /></head><body><p>Перенаправление. Если вас не перенаправило автоматически, нажмите <a href="${json.invoice_page_url}">сюда</a>.</p></body></html>`;
    }
    else {
        return '<!DOCTYPE html><html><head></head><body>Произошла ошибка. Попробуйте еще раз или оплатите вручную тут: <a href="https://www.donationalerts.com/r/spworlds">https://www.donationalerts.com/r/spworlds</a></body></html>';
    }
});
server.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000, '0.0.0.0');
