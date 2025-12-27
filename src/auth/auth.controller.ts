import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginDto } from "./dtos/login.dto";
import { IdPipe } from "./pipes/id.pipe";
import { Roles } from "./decorators/role.decorator";
import { Role } from "./enums/roles.enum";
import { AuthGuard } from "./guards/auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Post('register')
    async register(@Body() createUserDTO: CreateUserDto) {
        return this.authService.registerService(createUserDTO);
    }

    @Post('login')
    async login(@Body() loginDTO: LoginDto) {
        return this.authService.loginService(loginDTO);
    }

    @Post('logoff/:userId')
    async logOff(@Param('userId', IdPipe) userId: number) {
        return this.authService.logOffService(userId);
    }
}