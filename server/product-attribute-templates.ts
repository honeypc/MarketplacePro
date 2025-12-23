import fs from "fs";
import path from "path";

export type ProductAttributeField = {
  key: string;
  label: string;
  required?: boolean;
  description?: string;
  type?: "text" | "number" | "select";
  options?: string[];
};

export type ProductAttributeTemplate = {
  id: string;
  name: string;
  description?: string;
  productType?: "product" | "property" | "tour" | "trip" | "ticket";
  categorySlugs?: string[];
  attributes: ProductAttributeField[];
  updatedAt?: string;
};

type TemplateStorageShape = {
  templates: ProductAttributeTemplate[];
};

const defaultTemplates: ProductAttributeTemplate[] = [
  {
    id: "mobile-default",
    name: "Mobile Phone",
    description: "Standard attributes for smartphones and mobile devices",
    productType: "product",
    categorySlugs: ["mobile", "dien-tu", "electronics"],
    attributes: [
      { key: "brand", label: "Brand", required: true },
      { key: "model", label: "Model", required: true },
      { key: "storage", label: "Storage (GB)" },
      { key: "ram", label: "RAM (GB)" },
      { key: "camera", label: "Camera", description: "e.g., 50MP triple camera" },
      { key: "battery", label: "Battery", description: "e.g., 5000mAh" },
      { key: "madeIn", label: "Made In" }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "laptop-default",
    name: "Laptop",
    description: "Common laptop attributes for quick listing",
    productType: "product",
    categorySlugs: ["laptop", "dien-tu", "electronics"],
    attributes: [
      { key: "brand", label: "Brand", required: true },
      { key: "model", label: "Model", required: true },
      { key: "cpu", label: "CPU" },
      { key: "ram", label: "RAM (GB)" },
      { key: "storage", label: "SSD/HDD Storage" },
      { key: "gpu", label: "Graphics" },
      { key: "screen", label: "Screen Size" },
      { key: "madeIn", label: "Made In" }
    ],
    updatedAt: new Date().toISOString()
  }
];

const templatesPath = path.join(process.cwd(), "server", "data", "product-attribute-templates.json");

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

class ProductAttributeTemplateService {
  private templates: ProductAttributeTemplate[] = [];

  constructor() {
    this.templates = this.loadTemplates();
  }

  private ensureStorageDir() {
    const dir = path.dirname(templatesPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private normalizeTemplates(raw: unknown): ProductAttributeTemplate[] {
    if (!raw || typeof raw !== "object") return defaultTemplates;
    if (Array.isArray(raw)) return raw as ProductAttributeTemplate[];
    if ("templates" in raw && Array.isArray((raw as TemplateStorageShape).templates)) {
      return (raw as TemplateStorageShape).templates;
    }
    return defaultTemplates;
  }

  private loadTemplates(): ProductAttributeTemplate[] {
    this.ensureStorageDir();

    if (fs.existsSync(templatesPath)) {
      const fileContent = fs.readFileSync(templatesPath, "utf-8");
      try {
        const parsed = parseYamlOrJson(fileContent);
        return this.normalizeTemplates(parsed);
      } catch {
        return defaultTemplates;
      }
    }

    this.saveTemplates(defaultTemplates);
    return defaultTemplates;
  }

  private saveTemplates(templates: ProductAttributeTemplate[]) {
    this.ensureStorageDir();
    const payload: TemplateStorageShape = {
      templates: templates.map((template) => ({
        ...template,
        updatedAt: template.updatedAt || new Date().toISOString()
      }))
    };
    fs.writeFileSync(templatesPath, JSON.stringify(payload, null, 2), "utf-8");
  }

  listTemplates(filter?: { categorySlug?: string; productType?: ProductAttributeTemplate["productType"] }) {
    const { categorySlug, productType } = filter || {};
    return this.templates.filter((template) => {
      const matchesType = productType ? template.productType === productType : true;
      const matchesCategory = categorySlug
        ? (template.categorySlugs || []).includes(categorySlug)
        : true;
      return matchesType && matchesCategory;
    });
  }

  getTemplate(id: string) {
    return this.templates.find((template) => template.id === id);
  }

  upsertTemplate(template: ProductAttributeTemplate) {
    const timestampedTemplate: ProductAttributeTemplate = {
      ...template,
      productType: template.productType || "product",
      updatedAt: new Date().toISOString()
    };

    const existingIndex = this.templates.findIndex((item) => item.id === template.id);
    if (existingIndex >= 0) {
      this.templates[existingIndex] = {
        ...this.templates[existingIndex],
        ...timestampedTemplate
      };
    } else {
      this.templates.push(timestampedTemplate);
    }

    this.saveTemplates(this.templates);
    return timestampedTemplate;
  }

  parseTemplatePayload(payload: unknown, expectedId?: string): ProductAttributeTemplate | undefined {
    let templateData: any = payload;

    if (typeof payload === "string") {
      templateData = parseYamlOrJson(payload);
    }

    if (templateData && typeof templateData === "object" && "templates" in templateData) {
      const candidates = (templateData as TemplateStorageShape).templates;
      templateData = Array.isArray(candidates) ? candidates.find((item) => item.id === expectedId) || candidates[0] : templateData;
    }

    if (!templateData || typeof templateData !== "object") {
      return undefined;
    }

    if (expectedId && templateData.id !== expectedId) {
      templateData.id = expectedId;
    }

    return templateData as ProductAttributeTemplate;
  }
}

export const productAttributeTemplateService = new ProductAttributeTemplateService();
