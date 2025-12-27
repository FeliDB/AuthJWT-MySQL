import { CreateUserDto } from "../dtos/create-user.dto";
import { LoginDto } from "../dtos/login.dto";
import { User } from "../user.entity";
import * as bcrypt from 'bcrypt';

export class LoginMapper{
    static async toEntity(loginDTO: LoginDto): Promise<User>{
        const user = new User();
        user.email = loginDTO.email;
        user.password = await bcrypt.hash(loginDTO.password, 10);
        return user;
    }
}