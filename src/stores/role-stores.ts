import { create } from "zustand";
import ApiHelper from "@/lib/api-helper";
import { Role, RolePermission } from "@/types/role";
import { Pagination } from "@/types/pagination";

const apiHelper = new ApiHelper("roles");

interface RoleStoreState {
  data: Role;
  tableData: Pagination<Role>;
  permissions: RolePermission[];
  loading: boolean;

  setLoading: (val: boolean) => void;
  fetchData: (id: number) => Promise<void>;
  fetchDataTable: (formData: any) => Promise<void>;
  submitForm: (formData: any, mode: string, id?: number, cb?: (res: any) => void) => Promise<void>;
  remove: (id: number, cb?: (res: any) => void) => Promise<void>;
  clearFormData: () => void;
}

export const useRoleStore = create<RoleStoreState>((set, get) => ({
  data: {} as Role,
  tableData: {
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
  },
  permissions: [],
  loading: false,

  setLoading: (val) => set({ loading: val }),

  fetchData: async (id) => {
    if (Number.isNaN(id)) {
      get().clearFormData();
      return;
    }
    apiHelper.fetchData(
      id,
      (val: boolean) => set({ loading: val }),
      (res: any) => {
        const data = res.data.data;
        set({
          data: {
            name: data.name,
            guard_name: "api",
          },
        });
      }
    );
  },

  fetchDataTable: async (formData) => {
    apiHelper.fetchDataTable(
      formData,
      (val: boolean) => set({ loading: val }),
      (res: any) => {
        set({ tableData: res.data.data });
      }
    );
  },

  submitForm: async (formData, mode, id, cb = () => {}) => {
    const reqConfig = {
      headers: { "Content-Type": "application/json" },
    };
    if (mode === "create") {
      apiHelper.createData(
        formData,
        (val: boolean) => set({ loading: val }),
        reqConfig,
        (res: any) => cb(res)
      );
    }
    if (mode === "update" && id !== undefined) {
      apiHelper.updateData(
        formData,
        id,
        (val: boolean) => set({ loading: val }),
        reqConfig,
        (res: any) => cb(res)
      );
    }
  },

  remove: async (id, cb = () => {}) => {
    apiHelper.removeData(
      id,
      (val: boolean) => set({ loading: val }),
      (res: any) => cb(res)
    );
  },

  clearFormData: () => {
    set({
      data: {
        guard_name: "api",
      } as Role,
    });
  },
}));
