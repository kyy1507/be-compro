import { create } from "zustand";
import ApiHelper from "@/lib/api-helper";
import { Pagination } from "@/types/pagination";
import { Authorized, ModulePermission } from "@/types/permissions";

interface PermissionStoreState {
  data: ModulePermission;
  tableData: Pagination<ModulePermission>;
  permissions: ModulePermission[];
  byRoleId: ModulePermission[];
  authorizedData: Authorized[];
  loading: boolean;

  setLoading: (val: boolean) => void;

  fetchData: (id: number) => Promise<void>;
  fetchAuthorizeData: (cb?: (res: any) => void) => Promise<void>;
  fetchByRoleIdData: (id: number, cb?: (res: any) => void) => Promise<void>;
  fetchPermissionList: () => Promise<void>;
  fetchDataTable: (formData: any) => Promise<void>;
  submitForm: (formData: any, mode: string, id?: number, cb?: (res: any) => void) => Promise<void>;
  remove: (id: number, cb?: (res: any) => void) => Promise<void>;
  clearFormData: () => void;
}

const apiHelper = new ApiHelper("permissions");

export const usePermissionStore = create<PermissionStoreState>((set, get) => ({
  data: {} as ModulePermission,
  tableData: {
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
  },
  permissions: [],
  byRoleId: [],
  authorizedData: [],
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
        const data = res.data?.data;
        if (!data) return;
        set({
          data: {
            id: data.id,
            module: data.module,
            slug: data.slug,
            permissions: data.Permission,
          },
        });
      }
    );
  },

  fetchAuthorizeData: async (cb = () => {}) => {
    return new Promise<void>((resolve, reject) => {
      const authorizedApi = new ApiHelper("permissions");
      authorizedApi.get(
        "../authorized-permissions",
        {},
        (val: boolean) => set({ loading: val }),
        {},
        (res: any) => {
          const data = res.data?.data;
          if (Array.isArray(data)) {
            const authorizedData = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              guard_name: item.guard_name,
            }));
            set({ authorizedData });
            cb(res);
            resolve();
          } else {
            console.error("Invalid data structure:", res.data);
            reject();
          }
        }
      );
    });
  },

  fetchByRoleIdData: async (id, cb = () => {}) => {
    apiHelper.get(
      `grouped-permission-by-role/${id}`,
      {},
      (val: boolean) => set({ loading: val }),
      {},
      (res: any) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          const byRoleId = data.map((item: any) => ({
            slug: item.slug,
            permissions: item.permissions,
          }));
          set({ byRoleId });
          cb(res);
        } else {
          console.error("Invalid data structure:", res.data);
          set({ byRoleId: [] });
          cb(res);
        }
      }
    );
  },

  fetchPermissionList: async () => {
    apiHelper.get(
      "",
      {},
      (val: boolean) => set({ loading: val }),
      {},
      (res: any) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          set({
            permissions: data.map((item: any) => ({
              id: item.id,
              name: item.name,
            })),
          });
        } else {
          console.error("Invalid data structure:", res.data);
        }
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
    const config = { headers: { "Content-Type": "application/json" } };
    set({ loading: true });

    if (mode === "create") {
      apiHelper.createData(formData, (val: boolean) => set({ loading: val }), config, (res: any) => {
        cb(res);
      });
    }

    if (mode === "update" && id !== undefined) {
      apiHelper.updateData(formData, id, (val: boolean) => set({ loading: val }), config, (res: any) => {
        cb(res);
      });
    }
  },

  remove: async (id, cb = () => {}) => {
    apiHelper.removeData(id, (val: boolean) => set({ loading: val }), (res: any) => cb(res));
  },

  clearFormData: () => {
    set({
      data: {
        module: "",
        slug: "",
      },
    });
  },
}));
