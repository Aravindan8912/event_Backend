import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromiseHooks } from 'node:v8';
import { User } from 'src/Schema/users.Schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel({
      ...user,
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
}
