import { create } from "zustand";
import ApiHelper from "@/lib/api-helper";
import { Pagination } from "@/types/pagination";

export interface Module {
  id?: number;
  name?: string;
  label?: string;
  url?: string;
  icon?: string;
  is_active?: boolean;
  slug?: string;
  access?:string[]
  description?: string;
}

interface ModuleStoreState {
  data: Module;
  tableData: Pagination<Module>;
  moduleData: Module[];
  loading: boolean;

  setLoading: (val: boolean) => void;
  fetchData: (id: number) => Promise<void>;
  fetchDataTable: (formData: any) => Promise<void>;
  fetchDataModule: () => Promise<void>;
  fetchDataList: () => Promise<void>;
  submitForm: (formData: any, mode: string, id?: number, cb?: (res: any) => void) => Promise<void>;
  remove: (id: number, cb?: (res: any) => void) => Promise<void>;
  clearFormData: () => void;
}

const apiHelper = new ApiHelper("module");

export const useModuleStore = create<ModuleStoreState>((set, get) => ({
  data: {} as Module,
  tableData: {
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
  },
  moduleData: [],
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
        if (!data) {
          console.error("Invalid data structure:", res.data);
          return;
        }

        // Handle roles array (as in Vue version)
        if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
          data.roles = data.roles[0].id;
        }

        set({
          data: {
            id: data.id,
            name: data.name,
            label: data.label,
            url: data.url,
            icon: data.icon,
            is_active: data.is_active,
            slug: data.slug,
            access: data.access,
            description: data.description,
          },
        });
      },
    );
  },

  fetchDataTable: async (formData) => {
    apiHelper.fetchDataTable(
      formData,
      (val: boolean) => set({ loading: val }),
      (res: any) => {
        set({ tableData: res.data.data });
      },
    );
  },

  fetchDataModule: async () => {
    apiHelper.get(
      "active-module",
      {},
      (val: boolean) => set({ loading: val }),
      {},
      (res: any) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          const moduleData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            label: item.label,
            icon: item.icon,
            url: item.url,
            slug: item.slug,
            is_active: item.is_active,
            access: item.access,
            description: item.description,
          }));
          set({ moduleData });
        } else {
          console.error("Invalid data structure:", res.data);
        }
      },
    );
  },

  fetchDataList: async () => {
    apiHelper.get(
      "",
      {},
      (val: boolean) => set({ loading: val }),
      {},
      (res: any) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          const moduleData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            label: item.label,
            icon: item.icon,
            url: item.url,
            slug: item.slug,
            is_active: item.is_active,
            access: item.access,
            description: item.description,
          }));
          set({ moduleData });
        } else {
          console.error("Invalid data structure:", res.data);
        }
      },
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
        (res: any) => cb(res),
      );
    }

    if (mode === "update" && id !== undefined) {
      apiHelper.updateData(
        formData,
        id,
        (val: boolean) => set({ loading: val }),
        reqConfig,
        (res: any) => cb(res),
      );
    }
  },

  remove: async (id, cb = () => {}) => {
    apiHelper.removeData(
      id,
      (val: boolean) => set({ loading: val }),
      (res: any) => cb(res),
    );
  },

  clearFormData: () => {
    set({ data: {} as Module });
  },
}));
