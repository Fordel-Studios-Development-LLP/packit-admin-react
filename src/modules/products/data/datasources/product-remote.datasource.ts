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

      const products = (response.data.data || []).map(
        (item: ProductResponseDTO) => ProductModel.fromJson(item)
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
      const formData = new FormData();

      formData.append(
        "product",
        JSON.stringify({
          name: product.name,
          price: product.price,
          description: product.description,
        })
      );

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

      return ProductModel.fromJson(response.data);
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
      const formData = new FormData();
      formData.append("product", JSON.stringify(product));

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

      return ProductModel.fromJson(response.data);
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
