require('dotenv').config();

const express = require('express');
const http = require('http');
const { initSocket } = require('./src/configs/socket');

const projectRoutes = require('./src/controllers/projectController');
const profileRoutes = require('./src/controllers/profileController');
const scriptRoutes = require('./src/controllers/scriptController');
const walletRoutes = require('./src/controllers/walletController');
const taskRoutes = require('./src/controllers/taskController');
const profileWalletRoutes = require('./src/controllers/profileWalletController');

const databaseSync = require('./src/utils/dbMigration');
const errorHandler = require('./src/middleware/errorHandler');

const cors = require('cors');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const DB_ACTION = process.env.DB_ACTION || 'none';

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Cho phép nguồn từ địa chỉ này
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức cho phép
  credentials: true // Nếu bạn cần gửi cookies hoặc xác thực
}));

const registerRoutes = (prefix, router) => {
  app.use(`/api${prefix}`, router);
};

// middlewares
registerRoutes('/projects', projectRoutes);
registerRoutes('/profiles', profileRoutes);
registerRoutes('/scripts', scriptRoutes);
registerRoutes('/wallets', walletRoutes);
registerRoutes('/profile-wallets', profileWalletRoutes);
registerRoutes('/tasks', taskRoutes);

initSocket(server);
// app.use('/hello', projectRoutes);

// error handler middleware
app.use(errorHandler);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await databaseSync(DB_ACTION);
});


