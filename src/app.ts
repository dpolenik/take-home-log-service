import express from 'express';
import logRoutes from './routes/logRoutes'; // Ensure correct path

const app = express();

app.use(express.json());
app.use('/', logRoutes); // Routes are now accessible at `/log`

// Health check
app.get('/health', (req, res) => {
  res.send('Service is healthy! 🐐');
});

export default app;
