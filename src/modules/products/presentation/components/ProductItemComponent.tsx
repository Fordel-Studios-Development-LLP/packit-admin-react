// admin/src/modules/products/presentation/components/product-item.component.tsx
import React from "react";
import { TableRow, TableCell } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { ProductEntity } from "../../domain/entity/product.entity";

interface ProductItemProps {
  product: ProductEntity;
  onEdit: (product: ProductEntity) => void;
  onDelete: (id: string) => void;
}

export const ProductItemComponent: React.FC<ProductItemProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow>
      <TableCell className="w-[20%]">{product.name}</TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell className="w-[25%]">{product.description}</TableCell>
      <TableCell>
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image.secure_url}
            alt={`${product.name} image ${index + 1}`}
            className="w-24 h-24 object-cover mr-2 mb-2 rounded"
          />
        ))}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            color="blue"
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
          >
            Edit
          </Button>
          <Button
            color="red"
            size="sm"
            variant="outline"
            onClick={() => onDelete(product.id)}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
