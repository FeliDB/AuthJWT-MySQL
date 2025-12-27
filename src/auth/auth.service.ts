import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./user.entity";
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { TokenHelper } from "./helpers/token.helper";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from "@nestjs-modules/mailer";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
        private readonly tokenHelper: TokenHelper,
        private readonly mailService: MailService
    ) {}

    async registerService(createUserDTO: CreateUserDto): Promise<any> {
        try {
            const user = await this.authRepository.registerRepository(createUserDTO);
            return await this.tokenHelper.generateToken(user);
        } catch (error) {
            throw new Error('Error registering user: ' + error.message);
        }
    }

    async loginService(loginDTO: LoginDto): Promise<any> {
        const user = await this.authRepository.loginRepository(loginDTO);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return await this.tokenHelper.generateToken(user);
    }

    async logOffService(userId: number): Promise<void> {
        try {
            await this.authRepository.logOffRepository(userId);
        } catch (error) {
            throw new Error('Error logging off user: ' + error.message);
        }
    }

    async requestPasswordReset(email: string): Promise<any> {
        const user = await this.authRepository.findAttribute('email', email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex')

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const expires = new Date()
        expires.setHours(expires.getHours() + 1)


        await this.authRepository.saveResetPasswordToken(user, hashedToken, expires)

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`
        await this.mailService.sendPasswordResetEmail(user.email, resetUrl);

        return { message: 'Password reset link sent to your email' , 
            resetToken, //SOLO PARA DESAROOLLO!!!
            resetUrl //SOLO PARA DESARROLLO!!!!
        }
    }




    async resetPassword(email: string, token: string, newPassword: string){
        const user = await this.authRepository.findAttribute('email', email);

        if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
            throw new UnauthorizedException('Invalid or expired password reset token');
        }

        if (new Date() > user.resetPasswordExpires) {
            throw new UnauthorizedException('Password reset token has expired');
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        if (hashedToken !== user.resetPasswordToken) {
            throw new UnauthorizedException('Invalid password reset token');
        }

        await this.authRepository.updatePasswordRepository(user, newPassword)

    }

}