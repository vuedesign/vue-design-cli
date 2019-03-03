const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const MockJs = require('mockjs');

class Index {
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
        this.routerList();
        this.app
            .use(this.router.routes())
            .use(this.router.allowedMethods());
        this.app.listen(this.PORT);
        console.log(`run http://localhost:${this.PORT}`);
    }
    async routerList() {
    }
    run() {
        this.init();
    }
}

module.exports = Index;
