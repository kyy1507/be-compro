"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-stores";
import { Label } from "../../../../../components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import RoleDropdown from "@/components/dropdown/role-dropdown";
import ImageInput from "../../../../../components/forms/image-input";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  mode: string;
  userId?: number;
  onSuccess?: () => void;
}

export default function FormDataDialog({ open, onOpenChange, mode, userId, onSuccess }: UserFormDialogProps) {
  const { user, fetchData, submitForm, clearFormData, loading } = useUserStore();
  const [roleId, setRoleId] = useState<number>();
  const isView = mode === "view";
  const isEdit = mode === "update";
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (isEdit || isView) {
        if (userId) fetchData(userId);
      } else {
        clearFormData();
      }
    }
  }, [open, userId, mode]);

  useEffect(() => {
    if (user && user.roles) {
      setRoleId(Number(user.roles));
    }
  }, [user]);

  useEffect(() => {
    if (!open || !userId) return;
    fetchData(userId);
  }, [userId, open]);

  useEffect(() => {
    if (!open) {
      clearFormData();
      setRoleId(undefined)
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", (document.getElementById("name") as HTMLInputElement).value);
    formData.append("email", (document.getElementById("email") as HTMLInputElement).value);
    formData.append("username", (document.getElementById("username") as HTMLInputElement).value);
    formData.append("phone", (document.getElementById("phone") as HTMLInputElement).value);
    formData.append("roles", String(roleId));

    const passwordValue = (document.getElementById("password") as HTMLInputElement).value;
    if (mode === "create" || (mode === "update" && passwordValue.trim() !== "")) {
      formData.append("password", passwordValue);
    }

    if (pictureFile) {
      formData.append("picture", pictureFile);
    }
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
            {isView ? "View User" : isEdit ? "Edit User" : "Add New User"}
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
              <Label className="py-1" htmlFor="name">Nama lengkap</Label>
              <Input id="name" defaultValue={user?.name || ""} disabled={isView} />
            </div>

            <div>
              <Label className="py-1" htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email || ""} disabled={isView} />
            </div>

            <div>
              <Label className="py-1" htmlFor="username">Username</Label>
              <Input id="username" defaultValue={user?.username || ""} disabled={isView} />
            </div>

            <div>
              <Label className="py-1" htmlFor="password">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                disabled={isView}
              />
              {isEdit && !isView && (
                <p className="text-xs text-muted-foreground mt-1">
                  Kosongkan jika tidak ingin mengganti password.
                </p>
              )}
            </div>

            <div>
              <Label className="py-1" htmlFor="phone">No Handphone</Label>
              <Input id="phone" defaultValue={user?.phone || ""} disabled={isView} />
            </div>

            <div>
              <Label className="py-1" htmlFor="role">Role</Label>
              <RoleDropdown
                label="Role"
                value={roleId}
                onChange={setRoleId}
                isView={isView}
              />
            </div>

            <ImageInput
              id="picture"
              label="Picture"
              defaultImage={user?.profile_picture}
              disabled={isView}
              onChange={setPictureFile}
            />

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
