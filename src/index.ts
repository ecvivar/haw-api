import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { snakeCaseFilter } from './middleware/snakeCase';
import { globalRateLimiter } from './middleware/rateLimiter';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '4.5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(snakeCaseFilter);
app.use(globalRateLimiter);

app.get('/docs', (_req, res) => {
  const specUrl = `${config.api.url}/api-docs/v3/openapi.json`;
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HawAPI Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ url: ${JSON.stringify(specUrl)}, dom_id: '#swagger-ui' });
  </script>
</body>
</html>`);
});

app.get('/api-docs/v3/openapi.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use(routes);
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`HawAPI running on ${config.api.url}`);
    console.log(`API Base URL: ${config.api.url}${config.api.path}/${config.api.versionPath}`);
  });
}

export default app;
