interface data {
  id: number;
  email: string;
  username: string;
}

export interface LoginInteface {
  status: string;
  message: string;
  data: data | [] | undefined | null;
  token: string;
}
