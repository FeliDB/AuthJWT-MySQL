import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dtos/create-user.dto";
import { RegisterMapper } from "./mappers/register.mapper";
import { LoginDto } from "./dtos/login.dto";
import { LoginMapper } from "./mappers/login.mapper";

@Injectable()
export class UserRepository{
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
        const user = await LoginMapper.toEntity(loginDTO);
        await this.userRepository.findOne({ where: { email: user.email, password: user.password } });
        return user;
    }
}