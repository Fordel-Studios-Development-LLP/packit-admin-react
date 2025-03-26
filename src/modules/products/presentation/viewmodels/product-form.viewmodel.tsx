// admin/src/modules/products/presentation/viewmodels/product-form.viewmodel.tsx
import { useState, useEffect } from "react";
import { useProductContext } from "../providers/ProductProvider"; // Use the context to get use cases
import { ProductEntity } from "../../domain/entity/product.entity";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../state/ProductSlice";

export interface ProductFormState {
  id: string;
  name: string;
  price: string;
  description: string;
  productImgs: File[];
  error: string;
  isLoading: boolean;
}

export interface ProductFormViewModel {
  state: ProductFormState;
  setId?: (id: string) => void;
  setName: (name: string) => void;
  setPrice: (price: string) => void;
  setDescription: (description: string) => void;
  setProductImgs: (files: File[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
}

export const useProductFormViewModel = (
  initialProduct?: ProductEntity,
  onSubmitSuccess?: () => void
): ProductFormViewModel => {
  const { createProductUseCase, updateProductUseCase } = useProductContext(); // Access the use cases from context

  const dispatch = useDispatch();
  const [state, setState] = useState<ProductFormState>({
    id: "",
    name: "",
    price: "",
    description: "",
    productImgs: [],
    error: "",
    isLoading: false,
  });

  useEffect(() => {
    if (initialProduct) {
      setState({
        id: initialProduct.id,
        name: initialProduct.name,
        price: initialProduct.price,
        description: initialProduct.description,
        productImgs: [],
        error: "",
        isLoading: false,
      });
    }
  }, [initialProduct]);

  const setName = (name: string) => {
    setState((prev) => ({ ...prev, name }));
  };

  const setPrice = (price: string) => {
    setState((prev) => ({ ...prev, price }));
  };

  const setDescription = (description: string) => {
    setState((prev) => ({ ...prev, description }));
  };

  const setProductImgs = (productImgs: File[]) => {
    setState((prev) => ({ ...prev, productImgs }));
  };

  const resetForm = () => {
    setState({
      id: "",
      name: "",
      price: "",
      description: "",
      productImgs: [],
      error: "",
      isLoading: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImgs(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialProduct && state.productImgs.length === 0) {
      setState((prev) => ({ ...prev, error: "Please select image files." }));
      return;
    }

    setState((prev) => ({ ...prev, error: "", isLoading: true }));

    try {
      // Create a plain object for product data
      const productData = {
        id: state.id,
        name: state.name,
        price: state.price,
        description: state.description,
        images: [], // You can handle images later, if needed
      };

      let product;

      // Convert to ProductEntity before passing it to the use case
      const productEntity = new ProductEntity(productData);

      if (initialProduct?.id) {
        // Use the entity to update the product
        product = await updateProductUseCase.execute(
          initialProduct.id,
          productEntity.toModel(), // Convert ProductEntity to ProductModel
          state.productImgs
        );
        dispatch(updateProduct(product)); // Update the state in Redux
      } else {
        // Use the entity to create a new product
        product = await createProductUseCase.execute(
          productEntity,
          state.productImgs
        );
        dispatch(addProduct(product)); // Add the new product to Redux
      }

      resetForm();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      setState((prev) => ({ ...prev, error: "An error occurred" }));
      console.error(error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return {
    state,
    setName,
    setPrice,
    setDescription,
    setProductImgs,
    handleSubmit,
    handleFileChange,
    resetForm,
  };
};
