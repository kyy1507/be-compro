// store/userStore.ts
import { create } from "zustand";
import ApiHelper from "@/lib/apiHelper";
import { User } from "@/types/user";
import { Pagination } from "@/types/pagination";

const apiHelper = new ApiHelper("user");

interface UserStore {
  user: User;
  tableData: Pagination<User>;
  loading: boolean;
  setLoading: (val: boolean) => void;
  fetchData: (id: number) => void;
  fetchDataTable: (formData: any) => void;
  submitForm: (
    formData: any,
    mode: string,
    id?: number,
    cb?: (res: any) => void
  ) => void;
  remove: (id: number, cb?: (res: any) => void) => void;
  clearFormData: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: {} as User,
  tableData: {
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
  },
  loading: false,

  setLoading: (val) => set({ loading: val }),

  fetchData: (id) => {
    if (Number.isNaN(id)) {
      get().clearFormData();
      return;
    }
    apiHelper.fetchData(id, get().setLoading, (res: any) => {
      const data = res.data.data;
      if (data.roles?.length > 0) data.roles = data.roles[0].id;

      set({
        user: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          username: data.username,
          password: data.password,
          roles: data.roles,
          profile_picture: data.profile_picture_url,
        },
      });
    });
  },

  fetchDataTable: (formData) => {
    apiHelper.fetchDataTable(formData, get().setLoading, (res: any) => {
      set({ tableData: res.data.data });
    });
  },

  submitForm: (formData, mode, id, cb = () => {}) => {
    if (mode === "create") {
      apiHelper.createData(formData, get().loading, {}, cb);
    }
    if (mode === "update" && id) {
      apiHelper.updateData(formData, id, get().loading, {}, cb);
    }
  },

  remove: (id, cb = () => {}) => {
    apiHelper.removeData(id, get().setLoading, cb);
  },

  clearFormData: () => set({ user: {} as User }),
}));
