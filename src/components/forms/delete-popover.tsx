"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash } from "lucide-react";
import ApiHelper from "@/lib/api-helper";

interface DeletePopoverProps {
  apiRoute: string;
  id: number | string;
  title?: string;
  message?: string;
  onDeleted?: () => void;
}

export default function DeletePopover({
  apiRoute,
  id,
  title = "Hapus data?",
  message = "Apakah Anda yakin ingin menghapus data ini?",
  onDeleted,
}: DeletePopoverProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    const apiHelper = new ApiHelper(apiRoute);

    apiHelper.removeData(Number(id), (isLoading: boolean) => setLoading(isLoading), () => {
      toast.success("Data berhasil dihapus");
      onDeleted?.();
      setOpen(false);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full cursor-pointer text-muted-foreground flex size-8"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
