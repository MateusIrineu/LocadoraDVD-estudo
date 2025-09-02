import app from "./app.js";
import sequelize from "./config/database.js";
import "./modules/index.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // sicroniza os models com o banco
        await sequelize.sync({ alter: true, force: true })
        console.log('Database models synchronized successfully.');

        // testa a conexão
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // sobe o servidor
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
