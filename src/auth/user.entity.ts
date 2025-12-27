import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { unique: true } )
    username: string;

    @Column({ unique: true })
    email: string;

    @Column( {nullable: false} )
    password: string;
 
    @Column( { default: true } )
    activeFlag: boolean;

    @Column( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' } )
    createdAt: Date;

    @Column( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' } )
    deletedAt: Date;

    @Column( {nullable: false} )
    role: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    resetPasswordToken?: string | null;

    @Column( {type: 'timestamp', nullable: true})
    resetPasswordExpires?: Date | null;

}