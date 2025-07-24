import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ){}
  
  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto)
    const savedProduct = await this.productRepository.save(product) 
    return savedProduct;
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const searchProduct= await this.productRepository.findOneBy({id})
    if(!searchProduct){
      throw new NotFoundException(`Producto con el ID: ${id} no encontrado`)
    };
    return searchProduct
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const searchProduct= await this.productRepository.findOneBy({id})
    if(!searchProduct){
      throw new NotFoundException(`Producto con el ID: ${id} no encontrado`)
    };
    const updated = await this.productRepository.merge(searchProduct,updateProductDto)
    const savedP = await this.productRepository.save(updated)
    return savedP

  }

  async remove(id: number) {
    const searchProduct= await this.productRepository.findOneBy({id})
    if(!searchProduct){
      throw new NotFoundException(`Producto con el ID: ${id} no encontrado`)
    };;
    const deleteP = await this.productRepository.remove(searchProduct)

    return 'Producto eliminado con exito '
  }
}
