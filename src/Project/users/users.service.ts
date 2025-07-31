import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schema/users.Schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
}
