"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import RoleDropdown from "@/components/dropdown/role-dropdown";
import { useModuleStore } from "@/stores/module-stores";
import { usePermissionStore } from "@/stores/permissions-stores";
import { useEffect, useState } from "react";

export function TableCards() {
  const { byRoleId, fetchByRoleIdData, submitForm } = usePermissionStore();
  const { moduleData, fetchDataModule } = useModuleStore();
  const [isMounted, setIsMounted] = useState(false);
  const [roleId, setRoleId] = useState<number>();
  const [checkedPermissions, setCheckedPermissions] = useState<Record<string, string[]>>({});
  const [isFullPermission, setIsFullPermission] = useState(false);

  useEffect(() => {
    fetchDataModule();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!roleId) return;
    fetchByRoleIdData(roleId);
  }, [roleId]);

  useEffect(() => {
    if (!byRoleId) return;

    const newChecked: Record<string, string[]> = {};

    byRoleId.forEach((module: any) => {
      const moduleSlug = module.slug;
      const modulePerms = module.permissions?.map((perm: any) => {
        const parts = perm.name.split(".");
        return parts.length > 1 ? parts[1] : "";
      }) ?? [];

      const foundModule = moduleData.find((m) => m.slug === moduleSlug);
      if (foundModule) {
        newChecked[foundModule.name ?? ""] = modulePerms;
      }
    });

    setCheckedPermissions(newChecked);
  }, [byRoleId, moduleData]);

  const handleFullPermission = (checked: boolean) => {
    setIsFullPermission(checked);
    if (checked) {
      const allChecked: Record<string, string[]> = {};
      moduleData.forEach((mod) => {
        allChecked[mod.name ?? ""] = mod.access ?? [];
      });
      setCheckedPermissions(allChecked);
    } else {
      setCheckedPermissions({});
    }
  };

  const handleModuleAll = (moduleName: string, checked: boolean, accessList: string[]) => {
    setCheckedPermissions((prev) => {
      const newState = { ...prev };
      if (checked) newState[moduleName] = accessList;
      else delete newState[moduleName];
      return newState;
    });
  };

  const handlePermissionToggle = (moduleName: string, access: string, checked: boolean) => {
    setCheckedPermissions((prev) => {
      const moduleAccess = prev[moduleName] ?? [];
      const updatedAccess = checked
        ? [...moduleAccess, access]
        : moduleAccess.filter((item) => item !== access);
      return { ...prev, [moduleName]: updatedAccess };
    });
  };

  const handleSubmitForm = () => {
    if (!roleId) return;

    const activePermissions: any[] = [];

    moduleData.forEach((module) => {
      const moduleName = module.name ?? "";
      const accesses = checkedPermissions[moduleName] ?? [];
      accesses.forEach((access) => {
        activePermissions.push({
          name: `${module.slug}.${access}`,
          guard: "api",
        });
      });
    });

    const formData = {
      role_id: roleId,
      permissions: activePermissions,
    };
    console.log(formData)

    submitForm(formData, "update", roleId, (res) => {
      if (res?.isSuccess) {
        alert("Permissions saved successfully!");
      } else {
        alert("Failed to save permissions");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <div className="flex justify-between">
        <p className="text-3xl font-semibold">Permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2 w-full">
              <RoleDropdown label="Role" value={roleId} onChange={setRoleId} />
              <Button onClick={handleSubmitForm}>Save</Button>
            </div>
            <div className="flex justify-end items-center w-full gap-2">
              <Checkbox
                id="full"
                checked={isFullPermission}
                onCheckedChange={(checked) => handleFullPermission(!!checked)}
              />
              <Label htmlFor="full">Provide Full Permission</Label>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex size-full flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {moduleData.map((param, i) => {
              const moduleName = param.name ?? "";
              const moduleAccess = checkedPermissions[moduleName] ?? [];
              const accessList = param.access ?? [];

              const isModuleAllChecked =
                accessList.length > 0 && accessList.every((a) => moduleAccess.includes(a));

              return (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex flex-row items-center justify-between mb-4">
                    <span>{param.name}</span>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`all-${i}`}
                        checked={isModuleAllChecked}
                        onCheckedChange={(checked) =>
                          handleModuleAll(moduleName, !!checked, accessList)
                        }
                      />
                      <Label htmlFor={`all-${i}`}>All</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {accessList.map((access, accessIndex) => {
                      const isChecked = moduleAccess.includes(access);
                      return (
                        <div key={accessIndex} className="flex items-center gap-2">
                          <Checkbox
                            id={`${moduleName}-${accessIndex}`}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handlePermissionToggle(moduleName, access, !!checked)
                            }
                          />
                          <Label htmlFor={`${moduleName}-${accessIndex}`}>{access}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
