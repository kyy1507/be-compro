import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Eye, Trash, Users } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { recentLeadSchema } from "./schema";
import DeletePopover from "@/components/forms/delete-popover";

export const userColumns = (
  openDialog: (mode: "create" | "update" | "view", id?: number) => void,
  handleReload: () => void
): ColumnDef<z.infer<typeof recentLeadSchema>>[] => [
    {
      accessorKey: "image",
      header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
      cell: ({ row }) => {
        const imageUrl = row.original.profile_picture_url;
        return (
          <div className="flex items-center justify-center px-2 py-1">
            {imageUrl ? (
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                <Image
                  src={imageUrl}
                  alt={row.original.name}
                  width={800}
                  height={800}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                <Users className="text-muted-foreground h-5 w-5" />
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span>{row.original.name}</span>,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <span>{row.original.email}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => <Badge variant="secondary">{row.original.role_name}</Badge>,
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
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
            apiRoute="user"
            id={row.original.id}
            onDeleted={handleReload}
          />
        </div>
      ),
      enableSorting: false,
    },
  ];
