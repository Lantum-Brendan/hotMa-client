import { getToken } from '../auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface PaymentRecord {
  _id: string;
  guestName: string;
  amountDue: number;
  dueDate: string;
  bookingNumber: string;
  status: 'pending' | 'overdue' | 'paid';
  // Add any other fields that your backend's payment object might contain
}

export const fetchPendingPayments = async (): Promise<{ data: PaymentRecord[] }> => {
  try {
    console.log('Fetching pending payments');
    const token = getToken(); // Assuming authentication is required
    if (!token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${API_URL}/payments/pending`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch pending payments");
    }

    const payments = await response.json();
    console.log('Fetched pending payments:', payments);
    return { data: payments };
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    throw error;
  }
};

export const processPayment = async (paymentId: string, paymentData: any): Promise<PaymentRecord> => {
  try {
    console.log(`Processing payment ${paymentId} with data:`, paymentData);
    const token = getToken();
    if (!token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${API_URL}/payments/${paymentId}/process`, {
      method: "POST", // Or PUT, depending on your API design
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to process payment ${paymentId}`);
    }

    const updatedPayment = await response.json();
    console.log('Payment processed successfully:', updatedPayment);
    return updatedPayment;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
}; 