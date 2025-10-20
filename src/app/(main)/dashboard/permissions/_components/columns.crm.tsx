import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Eye, Trash, Users } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { recentLeadSchema } from "./schema";
import DeletePopover from "@/components/forms/delete-popover";

export const permissionsColumns = (
  openDialog: (mode: "create" | "update" | "view", id?: number) => void,
  handleReload: () => void
): ColumnDef<z.infer<typeof recentLeadSchema>>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span>{row.original.name}</span>,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            className="rounded-full cursor-pointer text-muted-foreground flex size-8"
            size="icon"
            onClick={() => openDialog("view", Number(row.original.id))}
          >
            <Eye />
          </Button>
          <Button
            variant={"outline"}
            className="rounded-full cursor-pointer text-muted-foreground flex size-8"
            size="icon"
            onClick={() => openDialog("update", Number(row.original.id))}
          >
            <Edit />
          </Button>
          <DeletePopover
            apiRoute="permissions"
            id={row.original.id}
            onDeleted={handleReload}
          />
        </div>
      ),
      enableSorting: false,
    },
  ];
