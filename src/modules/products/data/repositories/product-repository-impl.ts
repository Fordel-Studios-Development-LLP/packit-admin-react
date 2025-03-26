// admin / src / modules / products / data / repositories / product-repository-impl.ts;
import {
  ProductEntity,
  ProductEntityProps,
} from "../../domain/entity/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductRemoteDataSource } from "../datasources/product-remote.datasource";
import { ProductModel } from "../models/product.model";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private remoteDataSource: ProductRemoteDataSource) {}

  async getProducts(): Promise<ProductEntity[]> {
    try {
      const dataSource = this.remoteDataSource;
      const products = await dataSource.getProducts();
      return products.map((product) => product.toEntity());
    } catch (error) {
      console.error("Failed to get products:", error);
      throw error;
    }
  }

  async createProduct(
    product: Omit<ProductEntityProps, "id">,
    images: File[]
  ): Promise<ProductEntity> {
    try {
      const dataSource = this.remoteDataSource;

      // Create a minimal ProductModel with empty productImages array
      // The actual images will be handled by the dataSource
      const productModel = new ProductModel({
        id: "", // Temporary ID, will be replaced by the server
        name: product.name,
        price: product.price,
        description: product.description,
        productImages: [], // Empty array, as the actual images are passed separately
      });

      const createdProduct = await dataSource.createProduct(
        productModel,
        images
      );
      return createdProduct.toEntity();
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    product: Partial<ProductEntityProps>,
    images?: File[]
  ): Promise<ProductEntity> {
    try {
      const dataSource = this.remoteDataSource;

      // Create a partial ProductModel with only the fields that need to be updated
      const productModel: Partial<ProductModel> = {};

      if (product.name) productModel.name = product.name;
      if (product.price) productModel.price = product.price;
      if (product.description) productModel.description = product.description;

      // Handle images if provided in the entity
      if (product.images) {
        productModel.productImages = product.images.map((img) => ({
          secure_url: img.secure_url,
        }));
      }

      const updatedProduct = await dataSource.updateProduct(
        id,
        productModel,
        images
      );
      return updatedProduct.toEntity();
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const dataSource = this.remoteDataSource;
      return await dataSource.deleteProduct(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  }
}
