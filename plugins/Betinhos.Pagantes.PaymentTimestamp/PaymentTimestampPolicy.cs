using System;

namespace Betinhos.Pagantes.PaymentTimestamp
{
    internal static class PaymentTimestampPolicy
    {
        internal const int PaidStatus = 202410002;

        internal static bool ShouldSetFirstPaymentTimestamp(
            int? previousStatus,
            int? nextStatus,
            DateTime? existingTimestamp)
        {
            return nextStatus == PaidStatus
                && previousStatus != PaidStatus
                && !existingTimestamp.HasValue;
        }
    }
}
