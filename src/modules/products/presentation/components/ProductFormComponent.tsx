// admin/src/modules/products/presentation/components/product-form.component.tsx

import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { ProductEntity } from "../../domain/entity/product.entity";
import { ProductFormViewModel } from "../viewmodels/product-form.viewmodel";

interface ProductFormProps {
  product?: ProductEntity;
  viewModel: ProductFormViewModel;
}

export const ProductFormComponent: React.FC<ProductFormProps> = ({
  product,
  viewModel,
}) => {
  const {
    state,
    setName,
    setPrice,
    setDescription,
    handleSubmit,
    handleFileChange,
  } = viewModel;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input
          value={state.name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <Input
          type="number"
          value={state.price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Input
          value={state.description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          required={!product} // Only required for new product creation
        />
      </div>

      {product && product.images.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Images
          </label>
          <div className="flex flex-wrap">
            {product.images.map((image, index) => (
              <div key={index} className="mr-2 mb-2">
                <img
                  src={image.secure_url}
                  alt={`Current image ${index + 1}`}
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {state.error && <p className="text-red-500">{state.error}</p>}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={state.isLoading}
          className={state.isLoading ? "bg-gray-400" : ""}
        >
          {state.isLoading
            ? "Processing..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
};
