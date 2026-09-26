import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  uom: string;
  stock: number;
  location: string;
};

export type Move = {
  id: string;
  date: string;
  productId: string;
  productName: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  type: 'Receipt' | 'Delivery' | 'Internal Transfer' | 'Adjustment';
  reference: string;
};

export type Operation = {
  id: string;
  reference: string;
  partner?: string; // Vendor or Customer
  scheduledDate: string;
  status: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled';
  type: 'Receipt' | 'Delivery' | 'Internal Transfer' | 'Adjustment';
  items: { productId: string; productName: string; quantity: number; from?: string; to?: string }[];
};

interface InventoryContextType {
  products: Product[];
  moves: Move[];
  operations: Operation[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addOperation: (operation: Omit<Operation, 'id' | 'reference'>) => void;
  validateOperation: (operationId: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};

const initialProducts: Product[] = [
  { id: 'P001', name: 'Steel Rods', sku: 'STL-RD-01', category: 'Raw Materials', uom: 'kg', stock: 1250, location: 'Main Warehouse' },
  { id: 'P002', name: 'Office Chair', sku: 'FURN-CH-02', category: 'Finished Goods', uom: 'Units', stock: 45, location: 'Warehouse 2' },
  { id: 'P003', name: 'Aluminium Sheets', sku: 'AL-SH-10', category: 'Raw Materials', uom: 'kg', stock: 500, location: 'Main Warehouse' },
  { id: 'P004', name: 'Desk Table', sku: 'FURN-DT-05', category: 'Finished Goods', uom: 'Units', stock: 8, location: 'Warehouse 2' },
  { id: 'P005', name: 'Ergonomic Mouse', sku: 'ELEC-MS-01', category: 'Electronics', uom: 'Units', stock: 120, location: 'Warehouse 1' },
  { id: 'P006', name: 'Mechanical Keyboard', sku: 'ELEC-KB-02', category: 'Electronics', uom: 'Units', stock: 85, location: 'Warehouse 1' },
  { id: 'P007', name: 'Monitor Arm', sku: 'ACC-MA-03', category: 'Accessories', uom: 'Units', stock: 15, location: 'Warehouse 2' },
  { id: 'P008', name: 'HDMI Cable (2m)', sku: 'ACC-CB-04', category: 'Accessories', uom: 'Units', stock: 340, location: 'Warehouse 1' },
];

const initialMoves: Move[] = [
  { id: 'M001', date: new Date(Date.now() - 86400000 * 2).toISOString(), productId: 'P001', productName: 'Steel Rods', fromLocation: 'Vendor', toLocation: 'Main Warehouse', quantity: 50, type: 'Receipt', reference: 'WH/IN/001' },
  { id: 'M002', date: new Date(Date.now() - 86400000 * 1).toISOString(), productId: 'P002', productName: 'Office Chair', fromLocation: 'Warehouse 2', toLocation: 'Customer', quantity: 5, type: 'Delivery', reference: 'WH/OUT/001' },
  { id: 'M003', date: new Date(Date.now() - 43200000).toISOString(), productId: 'P005', productName: 'Ergonomic Mouse', fromLocation: 'Vendor', toLocation: 'Warehouse 1', quantity: 100, type: 'Receipt', reference: 'WH/IN/002' },
  { id: 'M004', date: new Date(Date.now() - 12000000).toISOString(), productId: 'P007', productName: 'Monitor Arm', fromLocation: 'Warehouse 2', toLocation: 'Warehouse 1', quantity: 10, type: 'Internal Transfer', reference: 'WH/INT/001' },
];

const initialOperations: Operation[] = [
  { id: 'O001', reference: 'WH/IN/0001', partner: 'Acme Corp', scheduledDate: new Date().toISOString().split('T')[0], status: 'Ready', type: 'Receipt', items: [{ productId: 'P001', productName: 'Steel Rods', quantity: 100, to: 'Main Warehouse' }] },
  { id: 'O002', reference: 'WH/OUT/0045', partner: 'Client A', scheduledDate: new Date().toISOString().split('T')[0], status: 'Waiting', type: 'Delivery', items: [{ productId: 'P002', productName: 'Office Chair', quantity: 10, from: 'Warehouse 2' }] },
  { id: 'O003', reference: 'WH/IN/0002', partner: 'Tech Solutions Ltd', scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: 'Draft', type: 'Receipt', items: [{ productId: 'P006', productName: 'Mechanical Keyboard', quantity: 50, to: 'Warehouse 1' }] },
  { id: 'O004', reference: 'WH/INT/0002', partner: '', scheduledDate: new Date().toISOString().split('T')[0], status: 'Ready', type: 'Internal Transfer', items: [{ productId: 'P008', productName: 'HDMI Cable (2m)', quantity: 20, from: 'Warehouse 1', to: 'Warehouse 2' }] },
  { id: 'O005', reference: 'WH/ADJ/0001', partner: '', scheduledDate: new Date().toISOString().split('T')[0], status: 'Ready', type: 'Adjustment', items: [{ productId: 'P003', productName: 'Aluminium Sheets', quantity: -5 }] },
];

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [moves, setMoves] = useState<Move[]>(initialMoves);
  const [operations, setOperations] = useState<Operation[]>(initialOperations);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: `P${String(products.length + 1).padStart(3, '0')}` };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const generateRef = (type: Operation['type']) => {
    const prefix = type === 'Receipt' ? 'WH/IN' : type === 'Delivery' ? 'WH/OUT' : type === 'Internal Transfer' ? 'WH/INT' : 'WH/ADJ';
    const count = operations.filter(o => o.type === type).length + 1;
    return `${prefix}/${String(count).padStart(4, '0')}`;
  };

  const addOperation = (operation: Omit<Operation, 'id' | 'reference'>) => {
    const newOp: Operation = {
      ...operation,
      id: `O${Date.now()}`,
      reference: generateRef(operation.type),
      status: operation.status || 'Draft'
    };
    setOperations([newOp, ...operations]);
  };

  const validateOperation = (operationId: string) => {
    const opIndex = operations.findIndex(o => o.id === operationId);
    if (opIndex === -1) return;
    
    const op = operations[opIndex];
    if (op.status === 'Done') return;

    // Execute movements
    const newMoves: Move[] = op.items.map((item, idx) => {
      // Update stock
      if (op.type === 'Receipt') {
        const p = products.find(p => p.id === item.productId);
        if (p) updateProduct(p.id, { stock: p.stock + item.quantity });
      } else if (op.type === 'Delivery') {
        const p = products.find(p => p.id === item.productId);
        if (p) updateProduct(p.id, { stock: p.stock - item.quantity });
      } else if (op.type === 'Internal Transfer') {
        // Simple stock update for simulation (in reality involves 2 locations)
      } else if (op.type === 'Adjustment') {
        const p = products.find(p => p.id === item.productId);
        // Adjustment sets exact quantity or applies delta, let's assume item.quantity is the delta
        if (p) updateProduct(p.id, { stock: p.stock + item.quantity });
      }

      return {
        id: `M${Date.now()}${idx}`,
        date: new Date().toISOString(),
        productId: item.productId,
        productName: item.productName,
        fromLocation: item.from || (op.type === 'Receipt' ? 'Vendor' : 'Warehouse'),
        toLocation: item.to || (op.type === 'Delivery' ? 'Customer' : 'Warehouse'),
        quantity: Math.abs(item.quantity),
        type: op.type,
        reference: op.reference
      };
    });

    setMoves([...newMoves, ...moves]);
    
    const newOps = [...operations];
    newOps[opIndex] = { ...op, status: 'Done' };
    setOperations(newOps);
  };

  return (
    <InventoryContext.Provider value={{ products, moves, operations, addProduct, updateProduct, addOperation, validateOperation }}>
      {children}
    </InventoryContext.Provider>
  );
};
