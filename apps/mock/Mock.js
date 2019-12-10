const Mock = require('../apps/mock/Mock');

const mock = new Mock({
    MOCK_DATA_PATH: `${process.cwd()}/mock`
});

mock.run();
