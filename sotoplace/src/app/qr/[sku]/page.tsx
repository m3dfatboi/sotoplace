import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight, ChatCircle } from "@phosphor-icons/react";

// QR Landing — minimal page opened after scanning QR code
// No auth required, shows quick product info + CTA
export default async function QrLandingPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;

  // In production: fetch product by QR/SKU from DB
  const product = {
    name: "Стол офисный СТ-120",
    sku: sku.toUpperCase(),
    price: "12 500 ₽",
    vendor: "МеталлПро",
    inStock: true,
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-primary text-white text-xl font-bold">
            S
          </div>
          <p className="text-sm text-text-secondary">Sotoplace Marketplace</p>
        </div>

        {/* Product card */}
        <div className="rounded-[16px] bg-white border border-border shadow-lg overflow-hidden">
          {/* Image */}
          <div className="aspect-[16/9] bg-subtle flex items-center justify-center">
            <span className="text-5xl text-text-tertiary/20 font-bold select-none">
              {product.name.charAt(0)}
            </span>
          </div>

          <div className="p-5 space-y-3">
            <div>
              <h1 className="text-xl font-semibold">{product.name}</h1>
              <p className="text-sm text-text-tertiary font-mono mt-0.5">Арт: {product.sku}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tabular-nums">{product.price}</span>
              <Badge variant={product.inStock ? "success" : "default"}>
                {product.inStock ? "В наличии" : "Под заказ"}
              </Badge>
            </div>

            <p className="text-sm text-text-secondary">
              Поставщик: <span className="font-medium text-text-primary">{product.vendor}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full" size="lg">
            <ShoppingCart size={18} className="mr-2" />
            В корзину
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <ChatCircle size={18} className="mr-2" />
            Запросить кастом
          </Button>
          <a
            href={`/catalog/${product.sku}`}
            className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors py-2"
          >
            Открыть полную карточку
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Auth prompt if not logged in */}
        <p className="text-center text-xs text-text-tertiary">
          Нет аккаунта?{" "}
          <a href="/login" className="text-primary hover:underline">
            Войдите или зарегистрируйтесь
          </a>
          {" "}для оформления заказа
        </p>
      </div>
    </div>
  );
}
