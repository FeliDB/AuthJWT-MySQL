import { User } from "../user.entity";

export class ResetPasswordRequestMapper{
    static toEntity(newUser: User, resetPasswordToken: string, resetPasswordExpires: Date){
        newUser.resetPasswordToken = resetPasswordToken;
        newUser.resetPasswordExpires = resetPasswordExpires;
        return newUser;
    }

}