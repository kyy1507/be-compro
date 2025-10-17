"use client";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { userColumns } from "./columns.crm";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-stores";
import FormDataDialog from "./form-data-dialog";
import RoleDropdown from "@/components/dropdown/role-dropdown";

export function TableCards() {
  const { tableData, fetchDataTable, loading } = useUserStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<string>("create");
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [roleId, setRoleId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const openDialog = (mode: string, id?: number) => {
    setDialogMode(mode);
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleFetchTable = (params?: { page?: number; per_page?: number; q?: string; roleId?: number }) => {
    const currentPage = params?.page ?? page;
    const currentSize = params?.per_page ?? pageSize;
    const currentQuery = params?.q ?? searchQuery;
    const currentRole = params?.roleId ?? roleId;

    fetchDataTable({
      page: currentPage,
      order: "asc",
      per_page: currentSize,
      q: currentQuery,
      roleId: currentRole,
    });
  };

  useEffect(() => {
    handleFetchTable();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const timeout = setTimeout(() => {
      handleFetchTable({ q: searchQuery, roleId });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, roleId]);

  const table = useDataTableInstance({
    data: tableData?.data || [],
    columns: userColumns((mode, id) => openDialog(mode, id), handleFetchTable),
    getRowId: (row) => row.id?.toString() ?? "",
  });

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <div className="flex justify-between">
        <p className="text-3xl font-semibold">User</p>
        <Button variant={"secondary"} className="cursor-pointer" onClick={() => openDialog("create")}>
          Add New
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>Track and manage your latest leads and their status.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                id="q"
                placeholder="Cari berdasarkan Nama atau Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <RoleDropdown
                label="Role"
                value={roleId}
                onChange={setRoleId}
              />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={userColumns} />
          </div>
          <DataTablePagination
            currentPage={tableData.current_page}
            total={tableData.total}
            pageSize={tableData.per_page}
            onPageChange={(newPage) => {
              setPage(newPage);
              handleFetchTable({ page: newPage });
            }}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              handleFetchTable({ per_page: newSize, page: 1 });
            }}
          />
        </CardContent>
      </Card>
      <FormDataDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        userId={selectedId}
        onSuccess={() => handleFetchTable()}
      />
    </div>
  );
}
