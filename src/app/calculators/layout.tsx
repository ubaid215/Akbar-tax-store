import type { ReactNode } from "react";
import CalculatorsShell from "./CalculatorsShell";

/**
 * Keep this file a Server Component so child routes can export `metadata` and
 * RSC navigations resolve reliably (client-only root layouts can break RSC fetch).
 */
export default function CalculatorsLayout({ children }: { children: ReactNode }) {
  return <CalculatorsShell>{children}</CalculatorsShell>;
}
