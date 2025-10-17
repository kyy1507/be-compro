"use client";

import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface Role {
  id: number;
  name: string;
}

interface DropdownRoleProps {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  placeholder?: string;
  displayLabel?: boolean;
  adminOnly?: boolean;
  isView?: boolean;
}

export default function RoleDropdown({
  value,
  onChange,
  label = "Role",
  placeholder = "Pilih Role",
  displayLabel = false,
  adminOnly = false,
  isView = false
}: DropdownRoleProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`);
      let data: Role[] = res.data.data;

      if (adminOnly) {
        data = data.filter((role) => role.name.toLowerCase().includes("admin"));
      }

      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {displayLabel && <Label>{label}</Label>}
      {loading ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <Select
          onValueChange={(val) => onChange?.(Number(val))}
          value={value ? String(value) : ""}
          disabled={isView}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
