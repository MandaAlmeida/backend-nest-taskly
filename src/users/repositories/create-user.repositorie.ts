import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.model';
import { UserEntity } from '../interface/UserEntity';
import { hash } from 'bcryptjs';
import { Categories, CategoriesDocument } from '@/categories/schema/categories.schema';  // Importe CategoriesModel

@Injectable()
export class CreateUserRepositorie {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Categories.name) private categoriesModel: Model<CategoriesDocument>  // Injete o CategoriesModel
    ) { }

    async create(event: UserEntity): Promise<UserEntity> {
        const { name, email, password } = event;
        const existingEmail = await this.userModel.findOne({ email });

        if (existingEmail) {
            throw new UnauthorizedException('Este usuário já existe');
        }

        const hashedPassword = await hash(password, 8);

        const user = {
            name,
            email,
            password: hashedPassword,
        };

        const createdUser = new this.userModel(user);
        await createdUser.save();

        // Após criar o usuário, você cria as categorias padrão para o usuário
        const defaultCategories = ["Todas", "Pessoal", "Trabalho", "Estudo"];
        const categories = defaultCategories.map(category => ({
            name: category,
            userId: createdUser._id, // Associe o usuário à categoria
        }));

        // Crie as categorias no banco de dados
        await this.categoriesModel.insertMany(categories);

        return createdUser.toObject();
    }
}
