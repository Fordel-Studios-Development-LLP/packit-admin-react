// admin/src/modules/products/presentation/components/product-list.component.tsx
import React from "react";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from "../../../../components/ui/table";
import { ProductItemComponent } from "./ProductItemComponent";
import { ProductEntity } from "../../domain/entity/product.entity";

interface ProductListProps {
  products: ProductEntity[];
  onEdit: (product: ProductEntity) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const ProductListComponent: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  return (
    <div className="border shadow-sm rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Product Images</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Loading products...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <ProductItemComponent
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
