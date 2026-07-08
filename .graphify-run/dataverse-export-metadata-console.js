/*
  Dataverse metadata export.
  Uso:
  1. Abra qualquer tela do Dataverse / Model-driven App logado.
  2. Pressione F12 > Console.
  3. Cole este arquivo inteiro.
  4. Aguarde o download do JSON.

  Ajuste rapido:
  - TABLE_PREFIXES define quais tabelas entram no JSON.
  - Padrao atual: apenas tabelas com LogicalName iniciando em cr40f_ ou new_.
*/
(async () => {
  "use strict";

  const TABLE_SCOPE = "prefix"; // fixo: exporta apenas prefixos abaixo
  const TABLE_PREFIXES = ["cr40f_", "new_"];
  const API_VERSION = "v9.2";
  const PAGE_SIZE = 500;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const isoSafe = () => new Date().toISOString().replace(/[:.]/g, "-");
  const clientUrl =
    window.Xrm?.Utility?.getGlobalContext?.().getClientUrl?.() ||
    `${location.protocol}//${location.host}`;
  const apiRoot = `${clientUrl.replace(/\/$/, "")}/api/data/${API_VERSION}`;

  const headers = {
    Accept: "application/json",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Prefer: `odata.include-annotations="*",odata.maxpagesize=${PAGE_SIZE}`,
  };

  async function request(pathOrUrl, retries = 3) {
    const url = pathOrUrl.startsWith("http")
      ? pathOrUrl
      : `${apiRoot}/${pathOrUrl.replace(/^\//, "")}`;

    for (let attempt = 1; attempt <= retries; attempt += 1) {
      const res = await fetch(url, { headers, credentials: "same-origin" });
      if (res.ok) return res.json();

      const body = await res.text().catch(() => "");
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        await sleep(1000 * attempt);
        continue;
      }

      throw new Error(`${res.status} ${res.statusText} em ${url}\n${body}`);
    }
  }

  async function getAll(path) {
    const rows = [];
    let next = path;

    while (next) {
      const data = await request(next);
      rows.push(...(data.value || []));
      next = data["@odata.nextLink"] || "";
    }

    return rows;
  }

  function pick(value, keys) {
    const out = {};
    for (const key of keys) out[key] = value?.[key] ?? null;
    return out;
  }

  function normalizeLabel(label) {
    return {
      userLocalizedLabel: label?.UserLocalizedLabel?.Label ?? null,
      localizedLabels: (label?.LocalizedLabels || []).map((item) => ({
        languageCode: item.LanguageCode,
        label: item.Label,
      })),
    };
  }

  function normalizeOptions(optionSet) {
    if (!optionSet) return null;
    return {
      name: optionSet.Name ?? null,
      displayName: normalizeLabel(optionSet.DisplayName),
      description: normalizeLabel(optionSet.Description),
      isGlobal: optionSet.IsGlobal ?? null,
      optionSetType: optionSet.OptionSetType ?? null,
      options: (optionSet.Options || []).map((opt) => ({
        value: opt.Value ?? null,
        label: normalizeLabel(opt.Label),
        description: normalizeLabel(opt.Description),
        color: opt.Color ?? null,
        externalValue: opt.ExternalValue ?? null,
        parentValues: opt.ParentValues ?? null,
      })),
    };
  }

  function normalizeAttribute(attr) {
    return {
      ...pick(attr, [
        "LogicalName",
        "SchemaName",
        "AttributeType",
        "AttributeTypeName",
        "ColumnNumber",
        "MetadataId",
        "IsPrimaryId",
        "IsPrimaryName",
        "RequiredLevel",
        "IsValidForCreate",
        "IsValidForRead",
        "IsValidForUpdate",
        "CanBeSecuredForCreate",
        "CanBeSecuredForRead",
        "CanBeSecuredForUpdate",
        "IsAuditEnabled",
        "IsCustomAttribute",
        "IsManaged",
        "SourceType",
        "Targets",
        "Format",
        "FormatName",
        "MaxLength",
        "MinValue",
        "MaxValue",
        "Precision",
        "PrecisionSource",
        "ImeMode",
        "DateTimeBehavior",
        "CanChangeDateTimeBehavior",
      ]),
      displayName: normalizeLabel(attr.DisplayName),
      description: normalizeLabel(attr.Description),
      optionSet: normalizeOptions(attr.OptionSet),
      globalOptionSet: normalizeOptions(attr.GlobalOptionSet),
      booleanOptionSet: attr.OptionSet
        ? {
            trueOption: attr.OptionSet.TrueOption
              ? {
                  value: attr.OptionSet.TrueOption.Value,
                  label: normalizeLabel(attr.OptionSet.TrueOption.Label),
                }
              : null,
            falseOption: attr.OptionSet.FalseOption
              ? {
                  value: attr.OptionSet.FalseOption.Value,
                  label: normalizeLabel(attr.OptionSet.FalseOption.Label),
                }
              : null,
          }
        : null,
    };
  }

  function normalizeRelationship(rel) {
    return {
      ...pick(rel, [
        "SchemaName",
        "MetadataId",
        "RelationshipType",
        "ReferencedEntity",
        "ReferencedAttribute",
        "ReferencingEntity",
        "ReferencingAttribute",
        "IntersectEntityName",
        "Entity1LogicalName",
        "Entity1IntersectAttribute",
        "Entity2LogicalName",
        "Entity2IntersectAttribute",
        "IsCustomRelationship",
        "IsManaged",
        "CascadeConfiguration",
      ]),
    };
  }

  function normalizeEntity(entity) {
    return {
      ...pick(entity, [
        "LogicalName",
        "SchemaName",
        "EntitySetName",
        "CollectionSchemaName",
        "ObjectTypeCode",
        "MetadataId",
        "PrimaryIdAttribute",
        "PrimaryNameAttribute",
        "IsActivity",
        "IsActivityParty",
        "IsCustomEntity",
        "IsManaged",
        "OwnershipType",
        "TableType",
        "DataProviderId",
        "ExternalName",
        "ExternalCollectionName",
      ]),
      displayName: normalizeLabel(entity.DisplayName),
      displayCollectionName: normalizeLabel(entity.DisplayCollectionName),
      description: normalizeLabel(entity.Description),
      attributes: [],
      keys: [],
      manyToOneRelationships: [],
      oneToManyRelationships: [],
      manyToManyRelationships: [],
    };
  }

  async function getAttributes(logicalName) {
    const fields = [
      "LogicalName",
      "SchemaName",
      "AttributeType",
      "AttributeTypeName",
      "ColumnNumber",
      "MetadataId",
      "DisplayName",
      "Description",
      "IsPrimaryId",
      "IsPrimaryName",
      "RequiredLevel",
      "IsValidForCreate",
      "IsValidForRead",
      "IsValidForUpdate",
      "CanBeSecuredForCreate",
      "CanBeSecuredForRead",
      "CanBeSecuredForUpdate",
      "IsAuditEnabled",
      "IsCustomAttribute",
      "IsManaged",
      "SourceType",
    ].join(",");

    const attrs = await getAll(
      `EntityDefinitions(LogicalName='${logicalName}')/Attributes?$select=${fields}`
    );

    return attrs.map(normalizeAttribute);
  }

  async function getChoiceAttributes(logicalName, castName) {
    const select = [
      "LogicalName",
      "SchemaName",
      "AttributeType",
      "AttributeTypeName",
      "MetadataId",
      "DisplayName",
      "Description",
      "OptionSet",
      "GlobalOptionSet",
    ].join(",");

    try {
      return await getAll(
        `EntityDefinitions(LogicalName='${logicalName}')/Attributes/Microsoft.Dynamics.CRM.${castName}?$select=${select}`
      );
    } catch (error) {
      console.warn(`Choices ignoradas em ${logicalName}/${castName}:`, error.message);
      return [];
    }
  }

  async function getRelationships(logicalName, navName) {
    try {
      return (await getAll(`EntityDefinitions(LogicalName='${logicalName}')/${navName}`))
        .map(normalizeRelationship);
    } catch (error) {
      console.warn(`Relacao ignorada em ${logicalName}/${navName}:`, error.message);
      return [];
    }
  }

  async function getKeys(logicalName) {
    try {
      return await getAll(`EntityDefinitions(LogicalName='${logicalName}')/Keys`);
    } catch (error) {
      console.warn(`Keys ignoradas em ${logicalName}:`, error.message);
      return [];
    }
  }

  async function exportMetadata() {
    console.time("dataverse-metadata-export");
    console.log("Dataverse:", clientUrl);
    console.log("Escopo:", TABLE_SCOPE, TABLE_PREFIXES);

    const entitySelect = [
      "LogicalName",
      "SchemaName",
      "EntitySetName",
      "CollectionSchemaName",
      "ObjectTypeCode",
      "MetadataId",
      "DisplayName",
      "DisplayCollectionName",
      "Description",
      "PrimaryIdAttribute",
      "PrimaryNameAttribute",
      "IsActivity",
      "IsActivityParty",
      "IsCustomEntity",
      "IsManaged",
      "OwnershipType",
      "TableType",
      "DataProviderId",
      "ExternalName",
      "ExternalCollectionName",
    ].join(",");
    const filter = "";

    const entitiesRaw = await getAll(`EntityDefinitions?$select=${entitySelect}${filter}`);
    const entities = entitiesRaw
      .filter((entity) =>
        TABLE_PREFIXES.some((prefix) => String(entity.LogicalName || "").startsWith(prefix))
      )
      .map(normalizeEntity)
      .sort((a, b) => String(a.LogicalName).localeCompare(String(b.LogicalName)));
    const exportedEntities = [];

    const globalOptionSets = await getAll("GlobalOptionSetDefinitions")
      .then((rows) => rows.map(normalizeOptions))
      .catch((error) => {
        console.warn("Global choices ignoradas:", error.message);
        return [];
      });

    for (let i = 0; i < entities.length; i += 1) {
      const entity = entities[i];
      console.log(`[${i + 1}/${entities.length}] ${entity.LogicalName}`);

      const [attributes, picklists, multiSelects, booleans, states, statuses, keys, mto, otm, mtm] =
        await Promise.all([
          getAttributes(entity.LogicalName),
          getChoiceAttributes(entity.LogicalName, "PicklistAttributeMetadata"),
          getChoiceAttributes(entity.LogicalName, "MultiSelectPicklistAttributeMetadata"),
          getChoiceAttributes(entity.LogicalName, "BooleanAttributeMetadata"),
          getChoiceAttributes(entity.LogicalName, "StateAttributeMetadata"),
          getChoiceAttributes(entity.LogicalName, "StatusAttributeMetadata"),
          getKeys(entity.LogicalName),
          getRelationships(entity.LogicalName, "ManyToOneRelationships"),
          getRelationships(entity.LogicalName, "OneToManyRelationships"),
          getRelationships(entity.LogicalName, "ManyToManyRelationships"),
        ]);

      const choiceByName = new Map(
        [...picklists, ...multiSelects, ...booleans, ...states, ...statuses]
          .map(normalizeAttribute)
          .map((attr) => [attr.LogicalName, attr])
      );

      entity.attributes = attributes.map((attr) => choiceByName.get(attr.LogicalName) || attr);
      entity.keys = keys;
      entity.manyToOneRelationships = mto;
      entity.oneToManyRelationships = otm;
      entity.manyToManyRelationships = mtm;

      exportedEntities.push(entity);

      await sleep(50);
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      clientUrl,
      apiVersion: API_VERSION,
      tableScope: TABLE_SCOPE,
      tablePrefixes: TABLE_PREFIXES,
      counts: {
        tables: exportedEntities.length,
        globalOptionSets: globalOptionSets.length,
        attributes: exportedEntities.reduce((sum, item) => sum + item.attributes.length, 0),
        manyToOneRelationships: exportedEntities.reduce((sum, item) => sum + item.manyToOneRelationships.length, 0),
        oneToManyRelationships: exportedEntities.reduce((sum, item) => sum + item.oneToManyRelationships.length, 0),
        manyToManyRelationships: exportedEntities.reduce((sum, item) => sum + item.manyToManyRelationships.length, 0),
      },
      globalOptionSets,
      entities: exportedEntities,
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dataverse-metadata-${TABLE_SCOPE}-${isoSafe()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);

    console.log("Exportado:", payload.counts);
    console.timeEnd("dataverse-metadata-export");
    return payload;
  }

  window.__dataverseMetadataExport = await exportMetadata();
})();
