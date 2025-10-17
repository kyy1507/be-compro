import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default class ApiHelper {
  routeName: string = "";

  constructor(routeName: string) {
    this.routeName = routeName ? `api/${routeName}` : "api";
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

    const token = Cookies.get("token");
    if (token) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };
    }
  }

  setRouteName(routeName: string): void {
    this.routeName = routeName ? `api/${routeName}` : "api";
  }

  isSuccess(res: any) {
    return res !== undefined && (res.data?.code === 200 || res.data === 1);
  }

  displayNotification(res: any, prefix = "Save Data") {
    if (!res || !res.data) return;
    const isSuccess = this.isSuccess(res);
    toast.dismiss();
    toast[isSuccess ? "success" : "error"](`${prefix} ${isSuccess ? "Success" : "Failed"}: ${res.data?.message || ""}`);
  }

  setLoading(loading: any, val: boolean) {
    if (!(loading === true || loading === false)) {
      loading(val);
    }
  }

  parseResponseMessage(
    response: any,
    success: boolean,
    loading: any,
    displayNotification = true,
    cb: any = () => {},
    prefixMessage = "",
  ) {
    if (success) {
      if (displayNotification) this.displayNotification(response, prefixMessage);
      this.setLoading(loading, false);
      response.isSuccess = this.isSuccess(response);
      cb(response);
    } else {
      const errResponse = response.response;
      if (displayNotification) this.displayNotification(errResponse, prefixMessage);

      response.isSuccess = this.isSuccess(response);
      this.setLoading(loading, false);

      if (response.response?.status === 401) {
        // Jangan akses store di sini
        Cookies.remove("token");
        window.location.href = "/login";
      } else {
        cb(errResponse);
      }
    }
  }

  fetchData(id: number, loading: any, cb: any = () => {}) {
    this.get(`detail/${id}`, {}, loading, {}, (res: any) => cb(res));
  }

  fetchList(loading: any, cb: any = () => {}, params?: any) {
    this.get("", { params }, loading, {}, (res: any) => cb(res));
  }

  fetchTable(formData: any, loading: any, cb: any = () => {}) {
    this.get("table", formData, loading, {}, (res: any) => cb(res));
  }

  fetchDataTable(formData: any, loading: any, cb: any = () => {}) {
    this.postTable("table", formData, loading, {}, (res: any) => cb(res));
  }

  createData(data: any, loading: any, config: any = {}, cb: any = () => {}) {
    this.post("save", data, loading, config, (res: any) => cb(res));
  }

  updateData(data: any, id: number, loading: any, config: any = {}, cb: any = () => {}) {
    this.put("update", id, data, loading, config, (res: any) => cb(res));
  }

  removeData(id: number, loading: any, cb: any = () => {}) {
    this.remove(`${id}`, {}, loading, {}, (res: any) => cb(res));
  }

  get(
    routeName: string,
    params: any,
    loading: any,
    config: any = {},
    cb: any = () => {},
    messagePrefix: string = "Fetch Data",
  ) {
    this.setLoading(loading, true);
    axios
      .get(routeName ? `${this.routeName}/${routeName}` : this.routeName, {
        headers: { "Content-Type": "application/json" },
        ...params,
        ...config,
      })
      .then((res) => {
        this.parseResponseMessage(res, true, loading, false, (r: any) => cb(r), messagePrefix);
        cb(res);
      })
      .catch((err) => {
        this.parseResponseMessage(err, false, loading, true, (r: any) => cb(r), messagePrefix);
      });
  }

  post(
    routeName: string,
    data: any,
    loading: any,
    config: any = {},
    cb: any = () => {},
    messagePrefix: string = "Create Data",
    displayNotification = true,
  ) {
    this.setLoading(loading, true);
    axios
      .post(routeName ? `${this.routeName}/${routeName}` : this.routeName, data, {
        headers: { "Content-Type": "multipart/form-data" },
        ...config,
      })
      .then((res) => {
        this.parseResponseMessage(res, true, loading, displayNotification, cb, messagePrefix);
      })
      .catch((err) => {
        this.parseResponseMessage(
          err,
          false,
          loading,
          displayNotification,
          (r: any) => {
            if (typeof cb === "function") cb(r);
          },
          messagePrefix,
        );
      });
  }

  postTable(routeName: string, data: any, loading: any, config: any = {}, cb: any = () => {}) {
    this.setLoading(loading, true);
    axios
      .post(routeName ? `${this.routeName}/${routeName}` : this.routeName, data, {
        headers: { "Content-Type": "application/json" },
        ...config,
      })
      .then((res) => {
        this.parseResponseMessage(res, true, loading, false, (r: any) => cb(r), "Fetch Data");
        cb(res);
      })
      .catch((err) => {
        this.parseResponseMessage(err, false, loading, true, (r: any) => cb(r), "Fetch Data");
      });
  }

  put(
    routeName: string,
    id: number,
    data: any,
    loading: any,
    config: any = {},
    cb: any = () => {},
    messagePrefix: string = "Update Data",
    displayNotification = true,
  ) {
    let url = `${routeName}/${id}`;
    if (data instanceof FormData) data.append("_method", "PUT");
    else url += "?_method=PUT";

    this.post(url, data, loading, config, (res: any) => cb(res), messagePrefix, displayNotification);
  }

  remove(
    routeName: string,
    params: any,
    loading: any,
    config: any = {},
    cb: any = () => {},
    messagePrefix: string = "Remove Data",
  ) {
    this.setLoading(loading, true);
    axios
      .delete(routeName ? `${this.routeName}/${routeName}` : this.routeName, { ...config, ...params })
      .then((res) => {
        this.parseResponseMessage(res, true, loading, true, (r: any) => cb(r), messagePrefix);
        cb(res);
      })
      .catch((err) => {
        this.parseResponseMessage(err, false, loading, true, (r: any) => cb(r), messagePrefix);
      });
  }
}
