import { v4 as uuidv4 } from 'uuid';
import {fileURLToPath} from 'url';
import Database from "better-sqlite3";
import path from 'path';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('pokemon.db');
class AuthController{
    async register(req, res) {
        try {
            const { name, password, email } = req.body;
            const checkEmail = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
            if (checkEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            const id = uuidv4();
            const hashedPassword = await bycrypt.hash(password, 13);
            const user = db.prepare("INSERT INTO users (id, name, password, email) VALUES (?, ?, ?, ?)");
            user.run(
                id,
                name,
                hashedPassword,
                email,
            );
            res.json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error occurred while registering user:', error);
            res.status(500).json({ message: 'An error occurred while registering user' });
        }
    }

    async login(req, res) {
       try {
           const { email, password } = req.body;
           const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
           console.log(user);
           if (!user) {
               return res.status(400).json({ message: 'User does not exist' });
           }
           const isPasswordValid = await bycrypt.compare(password, user.password);
           if (!isPasswordValid) {
               return res.status(400).json({ message: 'Invalid password' });
           }
           let token = jwt.sign(
               {email: user.email},             'PVnWTWRGHqMnw9mXG3E2KCY8E4U1LYswHaiNefnJXUZrd2NbMkaDClgdDZagnHkpgwWRbJ7ZxkEmdv1N/8TMVxkUDC+BpUjOdeDZ4ILLivWuKYlcpTVc+9N9vNNuko1/w+NgCSjxqArTY6H+iOKM/pHLyc3D1tiiYRdkQnADHVnvkbulsBkNQYkt9qKGg7H2S+Hqo5ofpytVLE31QxubmH9Oz30XL6IWCnGLqNflU4wVCNNta25Z24CsaZSIPqvPpPJ5+/35IhPLy8dXFUMhWuUhJp8O4hEuAPGabeBrZ72Bd0YxEkxxpnDV/OQAxyCziuFtJzO3Ai92MBAaR8oK6g==',
               {expiresIn: "1h"}
           )

           res.json({ message: 'User logged in successfully', token: token });
       } catch (error) {
           console.error('Error occurred while logging in user:', error);
           res.status(500).json({ message: 'An error occurred while logging in user' });
       }


    }

    async getAllUsers(req, res){
        try {
            const users = db.prepare("SELECT * FROM users").all();  
            res.json(users);
        } catch (error) {
            console.error('Error occurred while getting all users:', error);
            res.status(500).json({ message: 'An error occurred while getting all users' });
        }
    }

}
export default AuthController;