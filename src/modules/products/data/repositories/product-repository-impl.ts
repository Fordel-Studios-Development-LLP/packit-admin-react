import {
  ProductEntity,
  ProductEntityProps,
} from "../../domain/entity/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductRemoteDataSource } from "../datasources/product-remote.datasource";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private remoteDataSource: ProductRemoteDataSource) {}

  async getProducts(): Promise<ProductEntity[]> {
    try {
      const products = await this.remoteDataSource.getProducts();
      return products.map((productModel) => productModel.toEntity());
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
      // Create domain entity, then convert to model
      const entity = new ProductEntity({ ...product, id: "" });
      const createdProductModel = await this.remoteDataSource.createProduct(
        entity.toModel(),
        images
      );
      return createdProductModel.toEntity();
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
      // Build partial update payload manually
      const updatePayload: any = {};

      if (product.name) updatePayload.name = product.name;
      if (product.price) updatePayload.price = product.price;
      if (product.description) updatePayload.description = product.description;

      if (product.images) {
        updatePayload.productImages = product.images.map((img) => ({
          secure_url: img.secure_url,
        }));
      }

      const updatedProductModel = await this.remoteDataSource.updateProduct(
        id,
        updatePayload,
        images
      );

      return updatedProductModel.toEntity();
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      return await this.remoteDataSource.deleteProduct(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  }
}
