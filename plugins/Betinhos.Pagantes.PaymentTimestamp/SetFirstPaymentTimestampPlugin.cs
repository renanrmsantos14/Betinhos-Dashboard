using Microsoft.Xrm.Sdk;
using System;

namespace Betinhos.Pagantes.PaymentTimestamp
{
    public sealed class SetFirstPaymentTimestampPlugin : IPlugin
    {
        internal const string TableName = "cr40f_pagantes";
        internal const string StatusColumn = "cr40f_status";
        internal const string TimestampColumn = "cr40f_datadoprimeiropagamento";
        internal const string PreImageName = "PreImage";

        public void Execute(IServiceProvider serviceProvider)
        {
            if (serviceProvider == null)
            {
                throw new ArgumentNullException(nameof(serviceProvider));
            }

            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            if (context == null)
            {
                throw new InvalidPluginExecutionException("Contexto de execucao do plug-in indisponivel.");
            }
            if (context.Stage != 20
                || !context.InputParameters.Contains("Target")
                || !(context.InputParameters["Target"] is Entity target)
                || !string.Equals(target.LogicalName, TableName, StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            if (string.Equals(context.MessageName, "Create", StringComparison.OrdinalIgnoreCase))
            {
                SetTimestampForCreate(target, context.OperationCreatedOn);
                return;
            }

            if (!string.Equals(context.MessageName, "Update", StringComparison.OrdinalIgnoreCase)
                || !target.Attributes.Contains(StatusColumn))
            {
                return;
            }

            var preImage = context.PreEntityImages.Contains(PreImageName)
                ? context.PreEntityImages[PreImageName]
                : null;

            if (preImage == null)
            {
                throw new InvalidPluginExecutionException(
                    "A PreImage do plug-in de data do primeiro pagamento nao foi registrada.");
            }

            var previousStatus = preImage.GetAttributeValue<OptionSetValue>(StatusColumn)?.Value;
            var nextStatus = target.GetAttributeValue<OptionSetValue>(StatusColumn)?.Value;
            var existingTimestamp = target.Attributes.Contains(TimestampColumn)
                ? target.GetAttributeValue<DateTime?>(TimestampColumn)
                : preImage.GetAttributeValue<DateTime?>(TimestampColumn);

            if (PaymentTimestampPolicy.ShouldSetFirstPaymentTimestamp(
                previousStatus,
                nextStatus,
                existingTimestamp))
            {
                target[TimestampColumn] = NormalizeUtc(context.OperationCreatedOn);
            }
        }

        private static void SetTimestampForCreate(Entity target, DateTime operationCreatedOn)
        {
            var status = target.GetAttributeValue<OptionSetValue>(StatusColumn)?.Value;
            var existingTimestamp = target.GetAttributeValue<DateTime?>(TimestampColumn);

            if (PaymentTimestampPolicy.ShouldSetFirstPaymentTimestamp(
                null,
                status,
                existingTimestamp))
            {
                target[TimestampColumn] = NormalizeUtc(operationCreatedOn);
            }
        }

        private static DateTime NormalizeUtc(DateTime value)
        {
            return value.Kind == DateTimeKind.Utc ? value : value.ToUniversalTime();
        }
    }
}
