// admin / src / modules / products / data / datasources / product-remote.datasource.ts;

import { AxiosClient } from "../../../../commons/utils/AxiosClient";
import { ProductModel } from "../models/product.model";
import { ApiEndpoints } from "../../../../commons/constants/ApiEndpoints";
import {
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
} from "../dto/product.dto";

export class ProductRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async getProducts(): Promise<ProductModel[]> {
    try {
      const response = await this.axiosClient.get(
        "/src/assets/data/" + ApiEndpoints.PRODUCTS.path + ".json",
        {
          baseURL: "",
        }
      );

      // Map the response data to ProductModel instances
      const products = response.data.data.map(
        (product: ProductResponseDTO) =>
          new ProductModel({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            productImages: product.productImages,
          })
      );

      return products;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  }

  async createProduct(
    product: CreateProductDTO,
    images: File[]
  ): Promise<ProductModel> {
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add product data as JSON
      formData.append(
        "product",
        JSON.stringify({
          name: product.name,
          price: product.price,
          description: product.description,
        })
      );

      // Add images
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await this.axiosClient.post(
        ApiEndpoints.PRODUCTS.path,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Convert response to ProductModel
      return new ProductModel({
        id: response.data.id,
        name: response.data.name,
        price: response.data.price,
        description: response.data.description,
        productImages: response.data.productImages,
      });
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    product: UpdateProductDTO,
    images?: File[]
  ): Promise<ProductModel> {
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add product data as JSON
      formData.append("product", JSON.stringify(product));

      // Add images if provided
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`image_${index}`, image);
        });
      }

      const response = await this.axiosClient.put(
        `${ApiEndpoints.PRODUCTS.path}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Convert response to ProductModel
      return new ProductModel({
        id: response.data.id,
        name: response.data.name,
        price: response.data.price,
        description: response.data.description,
        productImages: response.data.productImages,
      });
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.axiosClient.delete(`${ApiEndpoints.PRODUCTS.path}/${id}`);
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  }
}
