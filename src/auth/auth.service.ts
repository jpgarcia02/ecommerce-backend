import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService, 
    ){}

    async login(loginDto: LoginAuthDto){

        const { email } = loginDto
        const searchEmail = await this.userRepository.findOne({where:{email}})
        if(!searchEmail){
            throw new UnauthorizedException('Credenciales Invalidas')
        }
        
        const { password } = loginDto
        const match = await bcrypt.compare(password, searchEmail.password);
        if(!match){
            throw new UnauthorizedException('Credenciales Invalidas')
        }
        const payload = { sub: searchEmail.id, email: searchEmail.email };
        const access_token = await this.jwtService.signAsync(payload)
        return {access_token}

        }
}
