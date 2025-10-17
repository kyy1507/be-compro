"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoleStore } from "@/stores/role-stores";

interface roleFormDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  mode: string;
  roleId?: number;
  onSuccess?: () => void;
}

export default function FormDataDialog({ open, onOpenChange, mode, roleId, onSuccess }: roleFormDialogProps) {
  const { data, fetchData, submitForm, clearFormData, loading } = useRoleStore();
  const isView = mode === "view";
  const isEdit = mode === "update";

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
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 max-h-[75vh] overflow-y-auto pb-2">
            <div>
              <Label className="py-1" htmlFor="name">Role Name</Label>
              <Input id="name" defaultValue={data?.name || ""} disabled={isView} />
            </div>

            <div>
              <Label className="py-1" htmlFor="description">Description</Label>
              <Input id="description" defaultValue={data?.description || ""} disabled={isView} />
            </div>

            <DialogFooter className="flex justify-end gap-2">
              {!isView && (
                <Button type="submit" disabled={loading}>
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
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
