import { User } from "../user.entity";
import * as bcrypt from 'bcrypt';

export class UpdatePasswordMapper{
    static toEntity(user: User, newPassword: string){
        user.password = bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        return user;
    }
}