import { getBusinessSettings } from "@/services/storefront.service";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

/** Reads the same settings the order action charges with, so the shown total always matches. */
export default async function CheckoutPage() {
  const settings = await getBusinessSettings();
  return (
    <CheckoutForm
      config={{
        insideDhakaRate: settings?.insideDhakaRate ?? 70,
        outsideDhakaRate: settings?.outsideDhakaRate ?? 130,
        bkashNumber: settings?.bkashNumber ?? "+880 1749160444",
        nagadNumber: settings?.nagadNumber ?? "+880 1749160444",
        isCodEnabled: settings?.isCodEnabled ?? true,
        isBkashEnabled: settings?.isBkashEnabled ?? true,
        isNagadEnabled: settings?.isNagadEnabled ?? true,
        phone: settings?.phoneSupport ?? "+880 1749160444",
      }}
    />
  );
}
