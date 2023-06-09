module.exports = {
    load: {
      before: ['requestTimer', 'responseTime', 'logger', 'cors', 'responses', 'gzip'],
      order: [
        "Define the middlewares' load order by putting their name in this array is the right order",
      ],
      after: ['parser', 'router'],
    },
    settings: {
      public: {
        path: './public',
        maxAge: 60000,
      },
    },
  };
