import models from "..";

const { User } = models;

const SALT_ROUNDS = 10

class UserController {
    static async register(req, res, next) {
try {
    const { name, email, password } = req.body;

    // verifica se todos os campos foram preenchidos:
    if(!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // verificar se o email já existe:
    const existingEmail = await User.findOne({ where: { email}})
    if (existingEmail) {
        return res.status(400).json({ message: "Email already exists." });
    }

    // hashar a senha atribuindo uma const global saltRounds para deixar mais prático: 
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ name, email, password: hashedPassword });

    // removendo a senha antes de enviar ao cliente:
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });


} catch (error) {
    next(error);
}};

static async login(req, res, next) {
    try {
        // login será com email e senha e proibição de campos nulos:
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // buscando email e validando:
        const user = await User.findOne({ where: { email }});
        if(!user) {
            return res.status(400).json({ message: "Email not found." });
        }

        // comparando senha e validando:
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // criação do token com { playload }, JWT_SECRET, { expiresIn (opcional)}
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            process.env.JWTSECRET, 
            { expiresIn: '1h' }
        );

        // remove a senha do retorno 
        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.status(200).json({ message: "Login successful", token, user: userWithoutPassword });

    } catch (error) {
        next(error)
    }};

static async getProfile(req, res, next) {
    try {
        const userId = req.user.id;

        // busca por id
        const user = await User.findByPk(userId);
        if(!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // não deve passar a senha
        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.status(200).json({ user: userWithoutPassword });

    } catch (error) {
        next(error);
    }};

static async updateUser(req, res, next) {
    try {

        // passando os campos
        const userId = req.user.id;
        const { name, email, password } = req.body;

        // procurando user por id 
        const findingUser = await User.findByPk(userId);
        if (!findingUser) {
            return res.status(404).json({ message: "User not found." })
        };

        // passando a possibilidade de alteração ou não:
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (password) { updatedFields.password = await bcrypt.hash(password, SALT_ROUNDS); }
        
        // salvando as alterações
        const [rowsUpdated] = await User.update(
            { ...updatedFields },
            { where: { id: userId }}
        );
        if (rowsUpdated === 0) {
            return res.status(400).json({ message: "No changes made to the user." });
        }

        res.status(200).json({ message: "User updated successfully" });

    } catch (error) {
        next(error);
    }};

static async deleteUser(req, res, next) {
    try {
        const userId = req.user.id;

        // buscando usuário pelo id:
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await User.destroy({ where: { id: userId }});

        res.status(200).json({ message: "User deleted successfully." });

    } catch (error) {
        next(error)
    }};

static async listUsers(req, res, next) {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] }});

        res.status(200).json({ listOfUsers: users });
    } catch (error) {
        next(error);
    }};

}

export default UserController