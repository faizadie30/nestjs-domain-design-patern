interface data {
  id: number;
  title: string;
  description: string;
  image_thumbnail: string | null | undefined;
}

export interface AllListFilmsInterface {
  status: string;
  data: data[] | [] | undefined | null;
  paginate: any;
}
