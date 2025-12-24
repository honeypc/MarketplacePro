import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

export type TableColumnConfig = {
  key: string;
  label: string;
  type?: string;
  description?: string;
  sortable?: boolean;
  badge?: boolean;
};

export type DetailAttributeConfig = {
  key: string;
  label: string;
  description?: string;
  source?: "base" | "custom";
  format?: "currency" | "number" | "text";
  badge?: boolean;
};

export type FieldDefinition = {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  description?: string;
  validations: string[];
  roles: string[];
};

export type FormTemplateDefinition = {
  id: string;
  title: string;
  entity: string;
  description: string;
  status: "draft" | "published";
  permissions: string[];
  fields: FieldDefinition[];
};

export type TableFormModelConfig = {
  id: string;
  label: string;
  detailAttributes: DetailAttributeConfig[];
  tableColumns: TableColumnConfig[];
  formTemplate: FormTemplateDefinition;
};

export type TableFormConfig = {
  models: TableFormModelConfig[];
};

const defaultConfig: TableFormConfig = {
  models: [
    {
      id: "product",
      label: "Products",
      tableColumns: [
        { key: "title", label: "Title", sortable: true },
        { key: "price", label: "Price", type: "currency", sortable: true },
        { key: "stock", label: "Inventory", type: "number" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status", badge: true }
      ],
      detailAttributes: [
        { key: "title", label: "Name" },
        { key: "price", label: "Price", format: "currency" },
        { key: "stock", label: "Stock", format: "number" },
        { key: "category", label: "Category" },
        { key: "brand", label: "Brand", source: "custom" },
        { key: "madeIn", label: "Made In", source: "custom" }
      ],
      formTemplate: {
        id: "product-form",
        title: "Product Listing",
        entity: "Product",
        description: "Structured product intake for catalog managers",
        status: "published",
        permissions: ["admin", "seller", "manager"],
        fields: [
          {
            id: "title",
            name: "title",
            label: "Title",
            type: "text",
            required: true,
            description: "Display name customers will see",
            validations: ["required", "min"],
            roles: ["admin", "seller", "manager"]
          },
          {
            id: "price",
            name: "price",
            label: "Price",
            type: "currency",
            required: true,
            description: "Base selling price",
            validations: ["required", "min"],
            roles: ["admin", "seller"]
          },
          {
            id: "inventory",
            name: "inventory",
            label: "Inventory",
            type: "number",
            required: false,
            description: "Available stock count",
            validations: ["min"],
            roles: ["admin", "manager"]
          },
          {
            id: "brand",
            name: "brand",
            label: "Brand",
            type: "text",
            required: false,
            description: "Manufacturer or seller brand",
            validations: [],
            roles: ["admin", "seller"]
          }
        ]
      }
    },
    {
      id: "property",
      label: "Properties",
      tableColumns: [
        { key: "title", label: "Title", sortable: true },
        { key: "city", label: "City" },
        { key: "country", label: "Country" },
        { key: "pricePerNight", label: "Nightly Rate", type: "currency" },
        { key: "status", label: "Status", badge: true }
      ],
      detailAttributes: [
        { key: "title", label: "Name" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "country", label: "Country" },
        { key: "bedrooms", label: "Bedrooms", format: "number" },
        { key: "bathrooms", label: "Bathrooms", format: "number" },
        { key: "pricePerNight", label: "Price / Night", format: "currency" },
        { key: "amenities", label: "Amenities", source: "base" }
      ],
      formTemplate: {
        id: "property-form",
        title: "Property Onboarding",
        entity: "Property",
        description: "Capture accommodation metadata and compliance",
        status: "published",
        permissions: ["admin", "agent"],
        fields: [
          {
            id: "name",
            name: "name",
            label: "Property Name",
            type: "text",
            required: true,
            description: "Internal and public name",
            validations: ["required"],
            roles: ["admin", "agent"]
          },
          {
            id: "location",
            name: "location",
            label: "Location",
            type: "text",
            required: true,
            description: "City, country, and coordinates",
            validations: ["required"],
            roles: ["admin", "agent", "traveler"]
          },
          {
            id: "safety",
            name: "safety",
            label: "Safety Checks",
            type: "checkbox",
            required: false,
            description: "Fire alarms, exits, and insurance",
            validations: [],
            roles: ["admin"]
          }
        ]
      }
    },
    {
      id: "tour",
      label: "Tours",
      tableColumns: [
        { key: "title", label: "Title", sortable: true },
        { key: "location", label: "Location" },
        { key: "price", label: "Price", type: "currency" },
        { key: "duration", label: "Duration" },
        { key: "status", label: "Status", badge: true }
      ],
      detailAttributes: [
        { key: "title", label: "Name" },
        { key: "location", label: "Location" },
        { key: "price", label: "Price", format: "currency" },
        { key: "duration", label: "Duration" },
        { key: "language", label: "Language", source: "custom" }
      ],
      formTemplate: {
        id: "itinerary-form",
        title: "Travel Itinerary",
        entity: "Itinerary",
        description: "Trip planning template for travelers",
        status: "draft",
        permissions: ["admin", "traveler"],
        fields: [
          {
            id: "destination",
            name: "destination",
            label: "Destination",
            type: "text",
            required: true,
            description: "Primary destination city",
            validations: ["required"],
            roles: ["admin", "traveler", "agent"]
          },
          {
            id: "dates",
            name: "dates",
            label: "Travel Dates",
            type: "date",
            required: true,
            description: "Start and end dates",
            validations: ["required"],
            roles: ["admin", "traveler"]
          },
          {
            id: "budget",
            name: "budget",
            label: "Budget",
            type: "currency",
            required: false,
            description: "Optional budget guardrail",
            validations: ["min", "max"],
            roles: ["admin", "traveler"]
          }
        ]
      }
    }
  ]
};

const configPath = path.join(process.cwd(), "server", "data", "table-form-config.yaml");

const parsePrimitive = (value: string) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  const numericValue = Number(trimmed);
  if (!Number.isNaN(numericValue) && trimmed !== "") return numericValue;
  return trimmed;
};

const tryParseJson = (input: string) => {
  try {
    return JSON.parse(input);
  } catch {
    return undefined;
  }
};

const parseYamlLike = (input: string): unknown => {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.replace(/\t/g, "    "))
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

  const parseBlock = (startIndex: number, currentIndent: number): [any, number] => {
    let result: any = null;
    let index = startIndex;

    while (index < lines.length) {
      const line = lines[index];
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      if (indent < currentIndent) break;

      const trimmed = line.trim();

      if (trimmed.startsWith("- ")) {
        if (!Array.isArray(result)) {
          result = [];
        }
        const valueText = trimmed.slice(2).trim();
        if (valueText.includes(":")) {
          const colonIndex = valueText.indexOf(":");
          const key = valueText.slice(0, colonIndex).trim();
          const remainder = valueText.slice(colonIndex + 1).trim();
          const child: Record<string, any> = {};
          if (remainder) {
            child[key] = parsePrimitive(remainder);
            result.push(child);
            index += 1;
          } else {
            const [nestedValue, nextIndex] = parseBlock(index + 1, indent + 1);
            child[key] = nestedValue;
            result.push(child);
            index = nextIndex;
          }
        } else if (valueText) {
          result.push(parsePrimitive(valueText));
          index += 1;
        } else {
          const [nestedValue, nextIndex] = parseBlock(index + 1, indent + 1);
          result.push(nestedValue);
          index = nextIndex;
        }
        continue;
      }

      const colonIndex = trimmed.indexOf(":");
      const key = colonIndex >= 0 ? trimmed.slice(0, colonIndex).trim() : trimmed;
      const remainder = colonIndex >= 0 ? trimmed.slice(colonIndex + 1).trim() : "";

      if (result === null) {
        result = {};
      } else if (Array.isArray(result)) {
        throw new Error("Invalid YAML structure: cannot mix arrays and objects at the same level.");
      }

      if (remainder === "") {
        const [nestedValue, nextIndex] = parseBlock(index + 1, indent + 1);
        (result as Record<string, any>)[key] = nestedValue;
        index = nextIndex;
      } else {
        (result as Record<string, any>)[key] = parsePrimitive(remainder);
        index += 1;
      }
    }

    return [result ?? {}, index];
  };

  const [parsed] = parseBlock(0, 0);
  return parsed;
};

const parseYamlOrJson = (input: string): unknown => {
  const asJson = tryParseJson(input);
  if (asJson !== undefined) return asJson;
  return parseYamlLike(input);
};

class TableFormService {
  private config: TableFormConfig = { models: [] };
  private initialized = false;

  private ensureStorageDir() {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private writeDefaultFile() {
    this.ensureStorageDir();
    const payload = JSON.stringify(defaultConfig, null, 2);
    fs.writeFileSync(configPath, payload, "utf-8");
  }

  private loadConfig(): TableFormConfig {
    this.ensureStorageDir();

    if (fs.existsSync(configPath)) {
      try {
        const fileContent = fs.readFileSync(configPath, "utf-8");
        const parsed = parseYamlOrJson(fileContent);
        if (parsed && typeof parsed === "object" && "models" in (parsed as TableFormConfig)) {
          return parsed as TableFormConfig;
        }
      } catch {
        // Fall through to default
      }
    }

    this.writeDefaultFile();
    return defaultConfig;
  }

  private async syncTemplates() {
    const client = prisma as any;
    for (const model of this.config.models) {
      const template = model.formTemplate;
      await client.formTemplate.upsert({
        where: { id: template.id },
        update: {
          title: template.title,
          entity: template.entity,
          description: template.description,
          status: template.status,
          permissions: template.permissions
        },
        create: {
          id: template.id,
          title: template.title,
          entity: template.entity,
          description: template.description,
          status: template.status,
          permissions: template.permissions
        }
      });

      for (const field of template.fields) {
        await client.formField.upsert({
          where: { id: field.id },
          update: {
            templateId: template.id,
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            description: field.description,
            validations: field.validations,
            roles: field.roles
          },
          create: {
            id: field.id,
            templateId: template.id,
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            description: field.description,
            validations: field.validations,
            roles: field.roles
          }
        });
      }
    }
  }

  async initialize() {
    if (this.initialized) return this.config;
    this.config = this.loadConfig();
    await this.syncTemplates();
    this.initialized = true;
    return this.config;
  }

  async getConfig() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.config;
  }
}

export const tableFormService = new TableFormService();
