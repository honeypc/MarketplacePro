import { Header } from "@/components/Header";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <CheckoutForm />
      </main>
    </div>
  );
}
