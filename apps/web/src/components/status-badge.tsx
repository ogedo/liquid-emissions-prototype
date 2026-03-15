import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, OrgStatus, SettlementStatus } from "@/lib/mock-data";

type StatusType = PaymentStatus | OrgStatus | SettlementStatus;

export function StatusBadge({ status }: { status: StatusType }) {
  switch (status) {
    case "COMPLETED":
    case "SETTLED":
    case "ACTIVE":
      return <Badge variant="success">{status}</Badge>;
    case "PROCESSING":
      return <Badge variant="processing">{status}</Badge>;
    case "PENDING":
      return <Badge variant="pending">{status}</Badge>;
    case "FAILED":
    case "SUSPENDED":
      return <Badge variant="error">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
