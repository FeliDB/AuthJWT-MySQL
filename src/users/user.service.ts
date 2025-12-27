import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./user.entity";
import { LoginDto } from "./dtos/login.dto";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async registerService(createUserDTO: CreateUserDto): Promise<User> {
        try {
            return await this.userRepository.registerRepository(createUserDTO);
        } catch (error) {
            throw new Error('Error registering user: ' + error.message);
        }
    }

    async loginService(loginDTO: LoginDto): Promise<User | null> {
        try {
            return await this.userRepository.loginRepository(loginDTO);
        } catch (error) {
            throw new Error('Error logging in user: ' + error.message);
        }
    }
}