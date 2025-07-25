import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ){}
  async create(createUserDto: CreateUserDto) {
    const saltRounds= 10
    const hashedPssword = await bcrypt.hash(createUserDto.password,saltRounds)
    const newObject = {
      ...createUserDto,
      password: hashedPssword,
    }
    const createUser = await this.userRepository.create(newObject)
    const savedUser = await this.userRepository.save(createUser)
    return savedUser
    
  }

 async findAll() {
  const searchAll = await this.userRepository.find({ relations: ['orders'] });

  const usersWithoutPasswords = searchAll.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return usersWithoutPasswords;
}

  async findOne(id: number) {
    const searchUser = await this.userRepository.findOne({where:{id},relations:['orders']})
    if(!searchUser){
      throw new NotFoundException(`Usuario con el ID: ${id} no encontrado`)
    };
    const { password, ...rest } = searchUser;
    return rest;

  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const searchUser = await this.userRepository.findOne({where:{id}})
    if(!searchUser){
      throw new NotFoundException(`Usuario con el ID: ${id} no encontrado`);
  }
    if (updateUserDto.password) {
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    updateUserDto.password = hashedPassword;
}
const updatedUser = await this.userRepository.save({
  ...searchUser,
  ...updateUserDto,
});

const { password, ...rest } = updatedUser;
return rest;
}

  async remove(id: number) {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException(`Usuario con el ID: ${id} no encontrado`);
  }

  await this.userRepository.remove(user);
  return { message: `Usuario con ID ${id} y sus órdenes fueron eliminados.` };
}
}
