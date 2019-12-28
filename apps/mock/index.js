const Mock = require('./mock');

const mock = new Mock({
    MOCK_DATA_PATH: `${process.cwd()}/mock`
});

mock.run();
