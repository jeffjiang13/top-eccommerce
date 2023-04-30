module.exports = () => {
    return async (ctx, next) => {
      const start = Date.now();

      await next();

      const timeTaken = Date.now() - start;
      console.log(`[Request Timer] Time taken for ${ctx.request.method} ${ctx.request.url}: ${timeTaken} ms`);
    };
  };
