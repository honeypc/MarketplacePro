import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTableFormConfig } from "@/hooks/useTableFormConfig";
import type { FormTemplateDefinition, TableFormModelConfig } from "@/lib/tableFormConfig";
import {
  Activity,
  CheckCircle,
  Clock3,
  Lock,
  ShieldCheck,
  Sparkles,
  SquarePen,
  TableProperties,
  Users,
  X,
} from "lucide-react";

const availableRoles = ["admin", "manager", "seller", "agent", "traveler", "guest"];
const validationOptions = ["required", "min", "max", "email", "url", "pattern"];
const fieldTypes = ["text", "number", "currency", "date", "select", "checkbox", "textarea"];

interface FieldDefinition {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  description?: string;
  validations: string[];
  roles: string[];
}

interface FormDefinition {
  id: string;
  title: string;
  entity: string;
  description: string;
  status: "draft" | "published";
  permissions: string[];
  updatedAt: string;
  fields: FieldDefinition[];
}

const initialForms: FormDefinition[] = [
  {
    id: "product-form",
    title: "Product Listing",
    entity: "Product",
    description: "Structured product intake for catalog managers",
    status: "published",
    permissions: ["admin", "seller", "manager"],
    updatedAt: "2024-11-10",
    fields: [
      {
        id: "title",
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        description: "Display name customers will see",
        validations: ["required", "min"],
        roles: ["admin", "seller", "manager"],
      },
      {
        id: "price",
        name: "price",
        label: "Price",
        type: "currency",
        required: true,
        description: "Base selling price",
        validations: ["required", "min"],
        roles: ["admin", "seller"],
      },
      {
        id: "inventory",
        name: "inventory",
        label: "Inventory",
        type: "number",
        required: false,
        description: "Available stock count",
        validations: ["min"],
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    id: "property-form",
    title: "Property Onboarding",
    entity: "Property",
    description: "Capture accommodation metadata and compliance",
    status: "published",
    permissions: ["admin", "agent"],
    updatedAt: "2024-10-04",
    fields: [
      {
        id: "name",
        name: "name",
        label: "Property Name",
        type: "text",
        required: true,
        description: "Internal and public name",
        validations: ["required"],
        roles: ["admin", "agent"],
      },
      {
        id: "location",
        name: "location",
        label: "Location",
        type: "text",
        required: true,
        description: "City, country, and coordinates",
        validations: ["required"],
        roles: ["admin", "agent", "traveler"],
      },
      {
        id: "safety",
        name: "safety",
        label: "Safety Checks",
        type: "checkbox",
        required: false,
        description: "Fire alarms, exits, and insurance",
        validations: [],
        roles: ["admin"],
      },
    ],
  },
  {
    id: "itinerary-form",
    title: "Travel Itinerary",
    entity: "Itinerary",
    description: "Trip planning template for travelers",
    status: "draft",
    permissions: ["admin", "traveler"],
    updatedAt: "2024-09-18",
    fields: [
      {
        id: "destination",
        name: "destination",
        label: "Destination",
        type: "text",
        required: true,
        description: "Primary destination city",
        validations: ["required"],
        roles: ["admin", "traveler", "agent"],
      },
      {
        id: "dates",
        name: "dates",
        label: "Travel Dates",
        type: "date",
        required: true,
        description: "Start and end dates",
        validations: ["required"],
        roles: ["admin", "traveler"],
      },
      {
        id: "budget",
        name: "budget",
        label: "Budget",
        type: "currency",
        required: false,
        description: "Optional budget guardrail",
        validations: ["min", "max"],
        roles: ["admin", "traveler"],
      },
    ],
  },
];

const FormManagement: React.FC = () => {
  const [forms, setForms] = useState<FormDefinition[]>(initialForms);
  const [selectedFormId, setSelectedFormId] = useState(initialForms[0]?.id ?? "");
  const [modelConfigs, setModelConfigs] = useState<TableFormModelConfig[]>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formDraft, setFormDraft] = useState<{
    title: string;
    entity: string;
    description: string;
    status: "draft" | "published";
    permissions: string[];
  }>({
    title: "",
    entity: "",
    description: "",
    status: "draft",
    permissions: ["admin"],
  });
  const [fieldDraft, setFieldDraft] = useState({
    name: "",
    label: "",
    type: "text",
    required: true,
    description: "",
    validations: ["required"],
    roles: ["admin"],
  });
  const { data: tableFormConfig } = useTableFormConfig();

  useEffect(() => {
    if (tableFormConfig?.models?.length) {
      const hydratedForms: FormDefinition[] = tableFormConfig.models.map((model) => ({
        ...(model.formTemplate as FormTemplateDefinition),
        entity: model.formTemplate.entity || model.label,
        updatedAt: new Date().toISOString()
      }));
      setForms(hydratedForms);
      setModelConfigs(tableFormConfig.models);
      setSelectedFormId(hydratedForms[0]?.id ?? "");
    }
  }, [tableFormConfig]);

  const selectedForm = useMemo(
    () => forms.find((form) => form.id === selectedFormId) ?? forms[0],
    [forms, selectedFormId]
  );

  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchesRole = roleFilter === "all" || form.permissions.includes(roleFilter);
      const matchesStatus = statusFilter === "all" || form.status === statusFilter;
      const matchesSearch =
        !searchTerm.trim() ||
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.entity.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [forms, roleFilter, statusFilter, searchTerm]);

  const summary = useMemo(() => {
    const totalFields = forms.reduce((total, form) => total + form.fields.length, 0);
    const published = forms.filter((f) => f.status === "published").length;
    const draft = forms.filter((f) => f.status === "draft").length;
    const governedFields = forms.reduce(
      (total, form) => total + form.fields.filter((field) => field.roles.length > 0).length,
      0
    );

    return { totalForms: forms.length, totalFields, published, draft, governedFields };
  }, [forms]);

  const handleCreateForm = () => {
    if (!formDraft.title || !formDraft.entity) return;

    const newForm: FormDefinition = {
      id: `${formDraft.entity.toLowerCase()}-${Date.now()}`,
      title: formDraft.title,
      entity: formDraft.entity,
      description: formDraft.description || "",
      status: formDraft.status,
      permissions: formDraft.permissions,
      updatedAt: new Date().toISOString().slice(0, 10),
      fields: [],
    };

    setForms((prev) => [newForm, ...prev]);
    setSelectedFormId(newForm.id);
    setFormDraft({ title: "", entity: "", description: "", status: "draft", permissions: ["admin"] });
  };

  const handleAddField = () => {
    if (!selectedForm) return;
    if (!fieldDraft.name || !fieldDraft.label) return;

    const newField: FieldDefinition = {
      id: `${selectedForm.id}-${fieldDraft.name}-${Date.now()}`,
      ...fieldDraft,
    };

    setForms((prev) =>
      prev.map((form) =>
        form.id === selectedForm.id ? { ...form, fields: [...form.fields, newField] } : form
      )
    );
    setFieldDraft({ name: "", label: "", type: "text", required: true, description: "", validations: ["required"], roles: ["admin"] });
  };

  const toggleFormStatus = (formId: string) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? { ...form, status: form.status === "published" ? "draft" : "published" }
          : form
      )
    );
  };

  const updateField = (fieldId: string, updates: Partial<FieldDefinition>) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === selectedForm?.id
          ? {
              ...form,
              fields: form.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          : form
      )
    );
  };

  const toggleFieldRole = (fieldId: string, role: string) => {
    const field = selectedForm?.fields.find((f) => f.id === fieldId);
    if (!field) return;

    const hasRole = field.roles.includes(role);
    updateField(fieldId, {
      roles: hasRole ? field.roles.filter((r) => r !== role) : [...field.roles, role],
    });
  };

  const toggleValidation = (fieldId: string, validation: string) => {
    const field = selectedForm?.fields.find((f) => f.id === fieldId);
    if (!field) return;

    const hasValidation = field.validations.includes(validation);
    updateField(fieldId, {
      validations: hasValidation
        ? field.validations.filter((v) => v !== validation)
        : [...field.validations, validation],
    });
  };

  const removeField = (fieldId: string) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === selectedForm?.id
          ? { ...form, fields: form.fields.filter((field) => field.id !== fieldId) }
          : form
      )
    );
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Governance / Form Management
          </div>
          <div className="flex items-center gap-3">
            <Card className="bg-primary/5 px-3 py-2 text-primary shadow-none">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TableProperties className="h-4 w-4" />
                Self-service form builder with permissions
              </div>
            </Card>
            <Badge variant="outline" className="border-green-600 text-green-700">
              Live control
            </Badge>
          </div>
          <p className="mt-2 text-muted-foreground">
            Standardize data capture across every model with role-aware fields, validation, and audit-friendly controls.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-primary/10 text-primary">
            <Sparkles className="mr-1 h-4 w-4" /> Dynamic schemas
          </Badge>
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            <ShieldCheck className="mr-1 h-4 w-4" /> Role-based
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TableProperties className="h-4 w-4" /> Forms
            </div>
            <CardTitle className="text-3xl">{summary.totalForms}</CardTitle>
            <CardDescription>Total governed schemas</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SquarePen className="h-4 w-4" /> Fields
            </div>
            <CardTitle className="text-3xl">{summary.totalFields}</CardTitle>
            <CardDescription>Active form inputs</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" /> Published
            </div>
            <CardTitle className="text-3xl">{summary.published}</CardTitle>
            <CardDescription>Visible to teams</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock3 className="h-4 w-4" /> Drafts
            </div>
            <CardTitle className="text-3xl">{summary.draft}</CardTitle>
            <CardDescription>Work-in-progress</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" /> Guarded fields
            </div>
            <CardTitle className="text-3xl">{summary.governedFields}</CardTitle>
            <CardDescription>Role-filtered fields</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {modelConfigs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TableProperties className="h-5 w-5" />
              Model table + detail layouts
            </CardTitle>
            <CardDescription>Dynamic table columns, detail attributes, and governed forms hydrated from YAML defaults.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {modelConfigs.map((model) => (
              <div key={model.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{model.id}</p>
                    <h3 className="text-xl font-semibold">{model.label}</h3>
                    <p className="text-sm text-muted-foreground">{model.tableColumns.length} table columns · {model.detailAttributes.length} detail fields</p>
                  </div>
                  <Badge variant="secondary">{model.formTemplate.status === "published" ? "Published" : "Draft"}</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Table columns</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead className="text-right">Flags</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {model.tableColumns.map((col) => (
                        <TableRow key={col.key}>
                          <TableCell className="font-medium">{col.key}</TableCell>
                          <TableCell>{col.label}</TableCell>
                          <TableCell className="text-right space-x-2">
                            {col.type && <Badge variant="outline">{col.type}</Badge>}
                            {col.sortable && <Badge variant="outline">Sortable</Badge>}
                            {col.badge && <Badge variant="outline">Badge</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Detail attributes</h4>
                  <div className="grid gap-2">
                    {model.detailAttributes.map((attr) => (
                      <div key={attr.key} className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div>
                          <div className="font-medium">{attr.label}</div>
                          <p className="text-xs text-muted-foreground">{attr.source === "custom" ? "Custom attribute" : "Model field"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {attr.format && <Badge variant="outline">{attr.format}</Badge>}
                          {attr.badge && <Badge variant="outline">Badge</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Model form registry</CardTitle>
              <CardDescription>Control who can see or edit each schema.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex w-full items-center gap-2 md:w-auto">
                <Input
                  placeholder="Search form or entity"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => (
                    <TableRow
                      key={form.id}
                      className={cn("cursor-pointer", selectedForm?.id === form.id && "bg-muted")}
                      onClick={() => setSelectedFormId(form.id)}
                    >
                      <TableCell>
                        <div className="font-semibold text-foreground">{form.title}</div>
                        <div className="text-sm text-muted-foreground">{form.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {form.entity}
                        </Badge>
                      </TableCell>
                      <TableCell>{form.fields.length}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {form.permissions.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            form.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {form.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          {form.updatedAt}
                          <Switch
                            checked={form.status === "published"}
                            onCheckedChange={() => toggleFormStatus(form.id)}
                            aria-label="Toggle form status"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create form schema</CardTitle>
            <CardDescription>Define a new model form with governance settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Compliance intake"
                value={formDraft.title}
                onChange={(e) => setFormDraft((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity">Entity</Label>
              <Input
                id="entity"
                placeholder="Model name (Product, Property, Tour)"
                value={formDraft.entity}
                onChange={(e) => setFormDraft((prev) => ({ ...prev, entity: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="What data should be collected and why?"
                value={formDraft.description}
                onChange={(e) => setFormDraft((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formDraft.status}
                onValueChange={(value) =>
                  setFormDraft((prev) => ({ ...prev, status: value as "draft" | "published" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Who can see this form?</Label>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((role) => {
                  const checked = formDraft.permissions.includes(role);
                  return (
                    <Badge
                      key={role}
                      variant={checked ? "default" : "outline"}
                      className={cn("cursor-pointer", !checked && "text-muted-foreground")}
                      onClick={() =>
                        setFormDraft((prev) => ({
                          ...prev,
                          permissions: checked
                            ? prev.permissions.filter((r) => r !== role)
                            : [...prev.permissions, role],
                        }))
                      }
                    >
                      {role}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <Button className="w-full" onClick={handleCreateForm}>
              <SquarePen className="mr-2 h-4 w-4" /> Create form
            </Button>
            <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              Tip: use separate schemas for creation vs. approval. You can duplicate a form and only change permissions.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Field-level governance</CardTitle>
            <CardDescription>
              Attach validation, descriptions, and role visibility for each field in the selected form.
            </CardDescription>
          </div>
          {selectedForm && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TableProperties className="h-4 w-4" />
              Managing: <span className="font-semibold text-foreground">{selectedForm.title}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Validation</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedForm?.fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{field.label}</div>
                        <div className="text-xs text-muted-foreground">{field.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {field.type}
                        </Badge>
                        {field.required && (
                          <Badge className="ml-2 bg-amber-100 text-amber-800">Required</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {validationOptions.map((rule) => {
                            const active = field.validations.includes(rule);
                            return (
                              <Badge
                                key={rule}
                                variant={active ? "secondary" : "outline"}
                                className={cn("text-xs capitalize", !active && "text-muted-foreground")}
                                onClick={() => toggleValidation(field.id, rule)}
                              >
                                {rule}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {availableRoles.map((role) => (
                            <Badge
                              key={role}
                              variant={field.roles.includes(role) ? "default" : "outline"}
                              className={cn(
                                "text-xs capitalize",
                                !field.roles.includes(role) && "text-muted-foreground"
                              )}
                              onClick={() => toggleFieldRole(field.id, role)}
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                            aria-label="Toggle required"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground"
                            onClick={() => removeField(field.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {selectedForm?.fields.length === 0 && (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                No fields yet. Use the builder to add your first field.
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <SquarePen className="h-4 w-4" />
              <div>
                <div className="font-semibold">Add field</div>
                <div className="text-sm text-muted-foreground">Map inputs to data types and guardrails.</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="field-name">Name</Label>
                  <Input
                    id="field-name"
                    placeholder="sku"
                    value={fieldDraft.name}
                    onChange={(e) => setFieldDraft((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field-label">Label</Label>
                  <Input
                    id="field-label"
                    placeholder="SKU"
                    value={fieldDraft.label}
                    onChange={(e) => setFieldDraft((prev) => ({ ...prev, label: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={fieldDraft.type}
                    onValueChange={(value) => setFieldDraft((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <Label className="text-sm">Required</Label>
                  <Switch
                    checked={fieldDraft.required}
                    onCheckedChange={(checked) => setFieldDraft((prev) => ({ ...prev, required: checked }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Validations</Label>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-2 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {validationOptions.map((rule) => {
                        const checked = fieldDraft.validations.includes(rule);
                        return (
                          <Badge
                            key={rule}
                            variant={checked ? "default" : "outline"}
                            className={cn("cursor-pointer capitalize", !checked && "text-muted-foreground")}
                            onClick={() =>
                              setFieldDraft((prev) => ({
                                ...prev,
                                validations: checked
                                  ? prev.validations.filter((v) => v !== rule)
                                  : [...prev.validations, rule],
                              }))
                            }
                          >
                            {rule}
                          </Badge>
                        );
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="advanced" className="space-y-2 pt-2 text-sm text-muted-foreground">
                    Add custom patterns or cross-field checks by attaching policy IDs. This demo keeps the controls simple but the layout is ready for deeper rules.
                  </TabsContent>
                </Tabs>
              </div>
              <div className="space-y-2">
                <Label htmlFor="field-description">Helper text</Label>
                <Textarea
                  id="field-description"
                  placeholder="Explain why this data is required and how it will be used"
                  value={fieldDraft.description}
                  onChange={(e) => setFieldDraft((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Who can see or edit this field?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableRoles.map((role) => {
                    const checked = fieldDraft.roles.includes(role);
                    return (
                      <div key={role} className="flex items-center gap-2 rounded-md border px-2 py-1">
                        <Checkbox
                          id={`field-role-${role}`}
                          checked={checked}
                          onCheckedChange={() =>
                            setFieldDraft((prev) => ({
                              ...prev,
                              roles: checked
                                ? prev.roles.filter((r) => r !== role)
                                : [...prev.roles, role],
                            }))
                          }
                        />
                        <Label htmlFor={`field-role-${role}`} className="text-sm capitalize">
                          {role}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button className="w-full" onClick={handleAddField}>
                <SquarePen className="mr-2 h-4 w-4" /> Add field to {selectedForm?.entity || "form"}
              </Button>
            </div>

            <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              Fields inherit the parent form permissions but can be tightened per-role. Use the badges above to include or exclude roles quickly.
            </div>

            <div className="space-y-3 rounded-md bg-muted/60 p-3 text-sm">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4" />
                <div>
                  <div className="font-medium">Validation coverage</div>
                  <div className="text-muted-foreground">
                    Toggle built-in validations or extend with advanced policies to block incomplete submissions at the edge.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4" />
                <div>
                  <div className="font-medium">Permission inheritance</div>
                  <div className="text-muted-foreground">
                    Form-level roles determine visibility, while field-level roles limit who can read or edit sensitive values.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormManagement;
