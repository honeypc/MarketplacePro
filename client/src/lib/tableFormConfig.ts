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
