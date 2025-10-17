"use client";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { roleColumns } from "./columns.crm";
import { useEffect, useState } from "react";
import { useRoleStore } from "@/stores/role-stores";
import FormDataDialog from "./form-data-dialog";

export function TableCards() {
  const { tableData, fetchDataTable, loading } = useRoleStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<string>("create");
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const openDialog = (mode: string, id?: number) => {
    setDialogMode(mode);
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleFetchTable = (params?: { page?: number; per_page?: number; q?: string }) => {
    const currentPage = params?.page ?? page;
    const currentSize = params?.per_page ?? pageSize;
    const currentQuery = params?.q ?? searchQuery;

    fetchDataTable({
      page: currentPage,
      order: "asc",
      per_page: currentSize,
      searchType: "simple",
      searchValue: {
        simpleSearchText: currentQuery,
        simpleSearchFields: ["name"],
      },
    });
  };

  useEffect(() => {
    handleFetchTable();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const timeout = setTimeout(() => {
      handleFetchTable({ q: searchQuery });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const table = useDataTableInstance({
    data: tableData?.data || [],
    columns: roleColumns((mode, id) => openDialog(mode, id), handleFetchTable),
    getRowId: (row) => row.id?.toString() ?? "",
  });
  
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <div className="flex justify-between">
        <p className="text-3xl font-semibold">Role</p>
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
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={roleColumns} />
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
        roleId={selectedId}
        onSuccess={() => handleFetchTable()}
      />
    </div>
  );
}
