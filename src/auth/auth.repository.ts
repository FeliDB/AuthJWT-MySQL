import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dtos/create-user.dto";
import { RegisterMapper } from "./mappers/register.mapper";
import { LoginDto } from "./dtos/login.dto";
import { LoginMapper } from "./mappers/login.mapper";
import * as bcrypt from 'bcrypt';
import { ResetPasswordRequestMapper } from "./mappers/reset-password-request.mapper";
import { UpdatePasswordMapper } from "./mappers/update-password.mapper";

@Injectable()
export class AuthRepository{
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

    
    async findAttribute(attribute: string, value: any): Promise<User | null>{
        const user = await this.userRepository.findOne({ where: { [attribute]: value } });
        return user;
    }

    async registerRepository(createUserDTO: CreateUserDto): Promise<User>{
        const user = await RegisterMapper.toEntity(createUserDTO);
        return this.userRepository.save(user);
    }

    async loginRepository(loginDTO: LoginDto): Promise<User | null>{
        const user = LoginMapper.toEntity(loginDTO);
        const foundUser = await this.userRepository.findOne({ where: { email: user.email } });
        if (!foundUser) return null;
        const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
        return isPasswordValid ? foundUser : null;
    }

    async logOffRepository(userId: number): Promise<void>{
        await this.userRepository.update(userId, { activeFlag: false });
    }

    async saveResetPasswordToken(user: User, hashedToken: string, expires: Date): Promise<void>{
        user = ResetPasswordRequestMapper.toEntity(user, hashedToken, expires);
        await this.userRepository.save(user);
    }


    async updatePasswordRepository(user: User, newPassword: string): Promise<void>{
        user = UpdatePasswordMapper.toEntity(user, newPassword);
        await this.userRepository.save(user);
    }
}