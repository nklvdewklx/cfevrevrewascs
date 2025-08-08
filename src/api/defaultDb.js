// src/api/defaultDb.js

const employees = [
    { id: 1, name: 'Alice Admin', email: 'alice.a@roctec.com', phone: '555-0101', role: 'Administrator', department: 'Management', hireDate: '2022-01-15' },
    { id: 2, name: 'Bob Finance', email: 'bob.f@roctec.com', phone: '555-0102', role: 'Finance User', department: 'Finance', hireDate: '2022-03-01' },
    { id: 3, name: 'Charlie Inventory', email: 'charlie.i@roctec.com', phone: '555-0103', role: 'Inventory User', department: 'Warehouse', hireDate: '2022-02-20' },
];

export const defaultDb = {
    // Users for login
    users: [
        { id: 1, username: 'admin', password: '123', role: 'admin', name: 'System Admin' },
        { id: 2, username: 'john.doe', password: '123', role: 'sales', name: 'John Doe' },
        { id: 3, username: 'jane.inv', password: '123', role: 'inventory', name: 'Jane Inventory' },
        { id: 4, username: 'finance.user', password: '123', role: 'finance', name: 'Finance User' }
    ],
    // Agents for sales
    agents: [
        { id: 1, name: 'John Doe', email: 'john.doe@roctec.com', phone: '+31 6 12345678', role: 'Agent', lat: 52.370216, lng: 4.895115 },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@roctec.com', phone: '+31 6 87654321', role: 'Agent', lat: 52.090737, lng: 5.121420 },
    ],
    // Customers assigned to agents
    customers: [
        { id: 101, name: 'GrocerChoice B.V.', company: 'GrocerChoice B.V.', email: 'purchase@grocerchoice.com', phone: '+31 174 123456', agentId: 1, lat: 52.379189, lng: 4.899431, notes: [], visitSchedule: { day: 'Sunday', frequency: 'weekly' } },
        { id: 102, name: 'EuroFood Imports', company: 'EuroFood Imports', email: 'ben.j@eurofood.com', phone: '+31 20 87654321', agentId: 2, lat: 52.0812, lng: 5.1252, notes: [], visitSchedule: { day: 'Sunday', frequency: 'weekly' } },
        { id: 103, name: 'Amsterdam Deli', company: 'Amsterdam Deli', email: 'orders@amdeli.com', phone: '+31 20 12345678', agentId: 1, lat: 52.3676, lng: 4.9041, notes: [], visitSchedule: { day: 'Sunday', frequency: 'weekly' } }
    ],
    // Suppliers of raw materials
    suppliers: [
        { id: 501, name: 'Fresh Veggie Farms', contactPerson: 'David Chen', email: 'sales@freshveg.farm', phone: '+31 6 11112222' },
        { id: 502, name: 'Packaging Solutions B.V.', contactPerson: 'Maria Garcia', email: 'maria.g@packagingsolutions.com', phone: '+31 10 9998888' },
        { id: 503, name: 'Spice & Herb Traders', contactPerson: 'Klaus Schmidt', email: 'k.schmidt@spice-traders.de', phone: '+49 30 123456' },
    ],
    // Raw materials (components) with initial stock batches
    components: [
        { id: 701, name: 'Cucumbers (kg)', cost: 1.50, reorderPoint: 100, stockBatches: [
            { quantity: 350, supplierLotNumber: 'FVF-JUL25-01', receivedDate: '2025-07-25' }
        ]},
        { id: 702, name: 'Vinegar (L)', cost: 0.80, reorderPoint: 50, stockBatches: [
            { quantity: 120, supplierLotNumber: 'CHEM-VIN-07A', receivedDate: '2025-07-22' }
        ]},
        { id: 703, name: 'Dill (g)', cost: 0.05, reorderPoint: 500, stockBatches: [
            { quantity: 3000, supplierLotNumber: 'SHT-DILL-H1', receivedDate: '2025-07-20' }
        ]},
        { id: 704, name: 'Glass Jar (500g)', cost: 0.25, reorderPoint: 1000, stockBatches: [
            { quantity: 800, supplierLotNumber: 'PACK-500G-B2', receivedDate: '2025-07-30' }
        ]},
        { id: 705, name: 'Jar Lid', cost: 0.05, reorderPoint: 1000, stockBatches: [
            { quantity: 1200, supplierLotNumber: 'PACK-LID-B2', receivedDate: '2025-07-30' }
        ]},
    ],
    // Finished goods with their Bill of Materials
    products: [
        {
            id: 201, name: 'Dill Pickles (500g Jar)', sku: 'PIC-DIL-500G', cost: 1.25, status: 'active', reorderPoint: 50,
            stockBatches: [
                { lotNumber: 'PIC-DIL-500G-20250801-001', quantity: 80, expiryDate: '2026-08-01' }
            ],
            pricingTiers: [ { minQty: 1, price: 2.50 }, { minQty: 100, price: 2.20 }, { minQty: 500, price: 2.00 } ],
            bom: [
                { componentId: 701, quantity: 0.4 }, { componentId: 702, quantity: 0.2 },
                { componentId: 703, quantity: 10 }, { componentId: 704, quantity: 1 }, { componentId: 705, quantity: 1 }
            ],
            shelfLifeDays: 365
        }
    ],
    // Historical production order that created the initial stock of pickles
    productionOrders: [
        { id: 1, productId: 201, lotNumber: 'PIC-DIL-500G-20250801-001', quantityProduced: 100, date: '2025-08-01', 
          componentsUsed: [
            { componentId: 701, quantityUsed: 40, supplierLotNumber: 'FVF-JUL25-01' },
            { componentId: 702, quantityUsed: 20, supplierLotNumber: 'CHEM-VIN-07A' },
            { componentId: 703, quantityUsed: 1000, supplierLotNumber: 'SHT-DILL-H1' },
            { componentId: 704, quantityUsed: 100, supplierLotNumber: 'PACK-500G-B2' },
            { componentId: 705, quantityUsed: 100, supplierLotNumber: 'PACK-LID-B2' }
          ]
        }
    ],
    // Historical and pending sales orders
    orders: [
        { id: 301, customerId: 101, agentId: 1, date: '2025-08-05', status: 'completed', items: [ { productId: 201, quantity: 20 } ] },
        { id: 302, customerId: 103, agentId: 1, date: '2025-08-07', status: 'pending', items: [ { productId: 201, quantity: 50 } ] },
    ],
    // Historical and pending purchase orders
    purchaseOrders: [
        { id: 601, poNumber: 'PO-2025-001', supplierId: 501, issueDate: '2025-07-25', status: 'fulfilled', items: [ { componentId: 701, quantity: 400 } ] },
        { id: 602, poNumber: 'PO-2025-002', supplierId: 502, issueDate: '2025-07-30', status: 'fulfilled', items: [ { componentId: 704, quantity: 1000 }, { componentId: 705, quantity: 1000 } ] },
        { id: 603, poNumber: 'PO-2025-003', supplierId: 503, issueDate: '2025-08-06', status: 'sent', items: [ { componentId: 703, quantity: 5000 } ] }
    ],
    // Pre-populated inventory ledger that tells the story of the data
    inventoryLedger: [
        { id: 6, date: '2025-08-05T10:00:00Z', itemType: 'product', itemId: 201, quantityChange: -20, reason: 'Sale - Order #301 (Batch: PIC-DIL-500G-20250801-001)', userId: 1 },
        { id: 5, date: '2025-08-01T09:00:00Z', itemType: 'product', itemId: 201, quantityChange: 100, reason: 'Production Order for 100x Dill Pickles (500g Jar) (Lot: PIC-DIL-500G-20250801-001)', userId: 1 },
        { id: 4, date: '2025-08-01T08:59:00Z', itemType: 'component', itemId: 701, quantityChange: -40, reason: 'Production Order for 100x Dill Pickles (500g Jar) (Lot: PIC-DIL-500G-20250801-001)', userId: 1 },
        { id: 3, date: '2025-07-30T14:00:00Z', itemType: 'component', itemId: 704, quantityChange: 1000, reason: 'Received from PO #PO-2025-002', userId: 1 },
        { id: 2, date: '2025-07-25T11:30:00Z', itemType: 'component', itemId: 701, quantityChange: 400, reason: 'Received from PO #PO-2025-001', userId: 1 },
        { id: 1, date: '2025-07-22T09:00:00Z', itemType: 'component', itemId: 702, quantityChange: 200, reason: 'Manual Adjustment: Initial Stock Count', userId: 1 },
    ],
    // --- Other Slices (empty to start) ---
    leads: [],
    quotes: [],
    invoices: [],
    approvals: [],
    employees,
};