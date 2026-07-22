using Betinhos.Pagantes.PaymentTimestamp;
using System;

internal static class Program
{
    private static int Main()
    {
        var existing = new DateTime(2026, 7, 22, 12, 0, 0, DateTimeKind.Utc);

        Assert(true, PaymentTimestampPolicy.ShouldSetFirstPaymentTimestamp(
            202410001, PaymentTimestampPolicy.PaidStatus, null), "Pendente para Pago");
        Assert(true, PaymentTimestampPolicy.ShouldSetFirstPaymentTimestamp(
            null, PaymentTimestampPolicy.PaidStatus, null), "Criado como Pago");
        Assert(false, PaymentTimestampPolicy.ShouldSetFirstPaymentTimestamp(
            PaymentTimestampPolicy.PaidStatus, PaymentTimestampPolicy.PaidStatus, null), "Pago repetido");
        Assert(false, PaymentTimestampPolicy.ShouldSetFirstPaymentTimestamp(
            202410001, PaymentTimestampPolicy.PaidStatus, existing), "Data existente preservada");
        Assert(false, PaymentTimestampPolicy.ShouldSetFirstPaymentTimestamp(
            202410001, 202410005, null), "Status nao pago");

        Console.WriteLine("5 testes da politica de data do primeiro pagamento passaram.");
        return 0;
    }

    private static void Assert(bool expected, bool actual, string scenario)
    {
        if (expected != actual)
        {
            throw new InvalidOperationException($"Falha em '{scenario}': esperado {expected}, obtido {actual}.");
        }
    }
}
