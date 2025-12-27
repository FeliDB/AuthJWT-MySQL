import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user.entity";
import { Role } from "../enums/roles.enum";

@Injectable()
export class TokenHelper {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(user: User): Promise<any> {
        const payload = { sub: user.id, username: user.username, role: user.role };
        return {
            userId: user.id,
            username: user.username,
            role: user.role,
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}