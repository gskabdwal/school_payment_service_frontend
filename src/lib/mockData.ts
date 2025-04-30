// Mock data for the application when backend is unavailable

// Mock schools
export const mockSchools = [
  { _id: "1", name: "Springfield Elementary School", district: "Springfield District" },
  { _id: "2", name: "Riverdale High School", district: "Riverdale District" },
  { _id: "3", name: "Westview Academy", district: "Westview District" },
  { _id: "4", name: "Oakridge Middle School", district: "Oakridge District" },
  { _id: "5", name: "Pinecrest Elementary", district: "Pinecrest District" },
];

// Mock transactions
export const mockTransactions = [
  {
    id: "tx1",
    collect_id: "coll-001",
    custom_order_id: "ORD-001-2025",
    school_id: "1",
    school_name: "Springfield Elementary School",
    gateway: "stripe",
    order_amount: 250.00,
    transaction_amount: 250.00,
    currency: "USD",
    status: "success",
    payment_time: new Date("2025-04-25T10:30:00").toISOString(),
    payment_mode: "online",
    payment_details: "Credit Card",
    student_name: "John Smith",
    payment_type: "Tuition",
    description: "April 2025 Tuition Payment"
  },
  {
    id: "tx2",
    collect_id: "coll-002",
    custom_order_id: "ORD-002-2025",
    school_id: "2",
    school_name: "Riverdale High School",
    gateway: "paypal",
    order_amount: 175.50,
    transaction_amount: 175.50,
    currency: "USD",
    status: "pending",
    payment_time: new Date("2025-04-26T14:15:00").toISOString(),
    payment_mode: "online",
    payment_details: "PayPal",
    student_name: "Emily Johnson",
    payment_type: "Field Trip",
    description: "Science Museum Field Trip"
  },
  {
    id: "tx3",
    collect_id: "coll-003",
    custom_order_id: "ORD-003-2025",
    school_id: "3",
    school_name: "Westview Academy",
    gateway: "stripe",
    order_amount: 320.75,
    transaction_amount: 320.75,
    currency: "USD",
    status: "failed",
    payment_time: new Date("2025-04-27T09:45:00").toISOString(),
    payment_mode: "online",
    payment_details: "Credit Card",
    student_name: "Michael Brown",
    payment_type: "Books",
    description: "Textbooks for Spring Semester"
  },
  {
    id: "tx4",
    collect_id: "coll-004",
    custom_order_id: "ORD-004-2025",
    school_id: "1",
    school_name: "Springfield Elementary School",
    gateway: "stripe",
    order_amount: 150.00,
    transaction_amount: 150.00,
    currency: "USD",
    status: "success",
    payment_time: new Date("2025-04-28T11:20:00").toISOString(),
    payment_mode: "online",
    payment_details: "Credit Card",
    student_name: "Sarah Davis",
    payment_type: "Lunch",
    description: "Monthly Lunch Payment"
  },
  {
    id: "tx5",
    collect_id: "coll-005",
    custom_order_id: "ORD-005-2025",
    school_id: "4",
    school_name: "Oakridge Middle School",
    gateway: "paypal",
    order_amount: 200.00,
    transaction_amount: 200.00,
    currency: "USD",
    status: "success",
    payment_time: new Date("2025-04-29T13:10:00").toISOString(),
    payment_mode: "online",
    payment_details: "PayPal",
    student_name: "David Wilson",
    payment_type: "Activity Fee",
    description: "Sports and Club Activities Fee"
  },
  {
    id: "tx6",
    collect_id: "coll-006",
    custom_order_id: "ORD-006-2025",
    school_id: "5",
    school_name: "Pinecrest Elementary",
    gateway: "stripe",
    order_amount: 125.50,
    transaction_amount: 125.50,
    currency: "USD",
    status: "pending",
    payment_time: new Date("2025-04-30T08:30:00").toISOString(),
    payment_mode: "online",
    payment_details: "Credit Card",
    student_name: "Jessica Martinez",
    payment_type: "Supplies",
    description: "Art Supplies for Spring Term"
  },
];

// Mock user data
export const mockUser = {
  id: "user1",
  email: "admin@example.com",
  role: "admin",
  name: "Admin User"
};

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
