import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginDto } from "./dtos/login.dto";
import { IdPipe } from "./pipes/id.pipe";
import { Roles } from "./decorators/role.decorator";
import { Role } from "./enums/roles.enum";
import { AuthGuard } from "./guards/auth.guard";
import { ApiCreatedResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiCreatedResponse({ 
        description: 'The user has been successfully registered.',
        schema: {
            example: {
                userId: 3,
                username: "john_doe",
                email: "john@example.com",
                role: "user",
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoiU2VhbiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY2ODU5OTQ3LCJleHAiOjE3NjY4NjM1NDd9.EwpQtgKsC5gnIEDBjCTfyxKQo9Igt8v5ILuwdg0LwHk"
            }
        }
    })


    async register(@Body() createUserDTO: CreateUserDto) {
        return this.authService.registerService(createUserDTO);
    }



    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
        @ApiCreatedResponse({ 
        description: 'The user has been successfully registered.',
        schema: {
            example: {
                userId: 3,
                username: "john_doe",
                email: "john@example.com",
                role: "user",
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoiU2VhbiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY2ODU5OTQ3LCJleHAiOjE3NjY4NjM1NDd9.EwpQtgKsC5gnIEDBjCTfyxKQo9Igt8v5ILuwdg0LwHk"
            }
        }
    })
    
    async login(@Body() loginDTO: LoginDto) {
        return this.authService.loginService(loginDTO);
    }

    @Post('logoff/:userId')
    @ApiOperation({ summary: 'Log off a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged off.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async logOff(@Param('userId', IdPipe) userId: number) {
        return this.authService.logOffService(userId);
    }



    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Password reset link sent to email.' })
    @ApiResponse({ status: 401, description: 'User not found.' })
    @ApiCreatedResponse({
        description: 'Password reset token generated successfully.',
        schema: {
            example: {
                message: "Password reset link sent to your email",
                resetToken: "a4cde48703897d8ead65ac7b5432b6d3f1d6ca0465f7a8bd12f11127d3e7fe96",
                resetUrl: "http://localhost:5173/reset-password?token=a4cde48703897d8ead65ac7b5432b6d3f1d6ca0465f7a8bd12f11127d3e7fe96&email=user@example.com"
            }
        }
    })
    async forgotPassword(@Body('email') email: string) {
        return this.authService.requestPasswordReset(email);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({ status: 200, description: 'Password has been successfully reset.' })
    @ApiResponse({ status: 401, description: 'Invalid or expired token.' })
    @ApiCreatedResponse({
        description: 'Password reset completed.',
        schema: {
            example: {
                message: "Password successfully updated"
            }
        }
    })
    async resetPassword(@Body('email') email: string, @Body('token') token: string, @Body('newPassword') newPassword: string) {
        return this.authService.resetPassword(email, token, newPassword);
    }
}