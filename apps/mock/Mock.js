const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const MockJs = require('mockjs');

class Mock {
    constructor(options = {}) {
        this.options = options;
        this.data = require(`${options.MOCK_DATA_PATH}/index`);
        this.config = require(`${options.MOCK_DATA_PATH}/mock.config`);
        this.app = new Koa();
        this.router = new Router();
        this.PORT = this.config.port || 3000;
    }
    init() {
        this.app.use(koaBody());
        this.app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
        });
        this.parse();
        this.app
            .use(this.router.routes())
            .use(this.router.allowedMethods());
        this.app.listen(this.PORT);
        console.log(`run http://localhost:${this.PORT}`);
    }
    async parse() {
        const data = this.data;
        const keys = Object.keys(data);
        for (let key of keys) {
            const [url, method] = key.split(' ');
            const func = data[key];
            this.router[method.toLowerCase()](
                `${this.config.prefix}${url}`,
                async ctx => {
                    const dataConfing = func(ctx);
                    const responseData = await this.delay(dataConfing, this.config.delay);
                    const data = MockJs.mock(responseData);
                    if (data.root) {
                        ctx.body = this.config.response(data.root);
                    } else {
                        ctx.body = this.config.response(data);
                    }
                }
            );
        }
    }
    delay(data, delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(data);
            }, delay);
        });
    }
    run() {
        this.init();
    }
}

module.exports = Mock;
