"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useModuleStore } from "@/stores/module-stores";
import { Switch } from "@/components/ui/switch";

interface roleFormDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  mode: string;
  roleId?: number;
  onSuccess?: () => void;
}

export default function FormDataDialog({ open, onOpenChange, mode, roleId, onSuccess }: roleFormDialogProps) {
  const { data, fetchData, submitForm, clearFormData, loading } = useModuleStore();
  const isView = mode === "view";
  const isEdit = mode === "update";
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (open && (isEdit || isView) && data) {
      setIsActive(Boolean(data.is_active));
    } else if (!isEdit && !isView) {
      setIsActive(false);
    }
  }, [open, data, isEdit, isView]);

  useEffect(() => {
    if (open) {
      if (isEdit || isView) {
        if (roleId) fetchData(roleId);
      } else {
        clearFormData();
      }
    }
  }, [open, roleId, mode]);


  useEffect(() => {
    if (!open || !roleId) return;
    fetchData(roleId);
  }, [roleId, open]);

  useEffect(() => {
    if (!open) {
      clearFormData();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", (document.getElementById("name") as HTMLInputElement).value);
    formData.append("description", (document.getElementById("description") as HTMLInputElement).value);
    formData.append("guard_name", "api");
    formData.append("label", (document.getElementById("label") as HTMLInputElement).value);
    formData.append("url", (document.getElementById("url") as HTMLInputElement).value);
    formData.append("icon", (document.getElementById("icon") as HTMLInputElement).value);
    formData.append("access", (document.getElementById("access") as HTMLInputElement).value);
    formData.append("is_active", isActive ? "1" : "0");

    try {
      await submitForm(formData, mode, roleId);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isView ? "View Role" : isEdit ? "Edit Role" : "Add New Role"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col gap-4 mt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end gap-2 mt-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ) : (
          <>
            <form
              id="role-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4 mt-4 max-h-[75vh] overflow-y-auto pb-2"
            >
              <div>
                <Label className="py-1" htmlFor="name">Name</Label>
                <Input id="name" defaultValue={data?.name || ""} disabled={isView} />
              </div>

              <div>
                <Label className="py-1" htmlFor="label">Label</Label>
                <Input id="label" defaultValue={data?.label || ""} disabled={isView} />
              </div>

              <div>
                <Label className="py-1" htmlFor="url">URL</Label>
                <Input id="url" defaultValue={data?.url || ""} disabled={isView} />
              </div>

              <div>
                <Label className="py-1" htmlFor="icon">Icon</Label>
                <Input id="icon" defaultValue={data?.icon || ""} disabled={isView} />
              </div>

              <div>
                <Label className="py-1" htmlFor="access">Access</Label>
                <Input id="access" defaultValue={data?.access || ""} disabled={isView} />
              </div>

              <div>
                <Label className="py-1" htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(val) => setIsActive(val)}
                  disabled={isView}
                />
              </div>

              <div>
                <Label className="py-1" htmlFor="description">Description</Label>
                <Input id="description" defaultValue={data?.description || ""} disabled={isView} />
              </div>
            </form>

            <DialogFooter className="flex justify-end gap-2 mt-4">
              {!isView && (
                <Button type="submit" form="role-form" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
