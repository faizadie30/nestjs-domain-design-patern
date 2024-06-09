import { API_URL } from '../../constants';

export class GlobalHelper {
  generatePagination(
    serviceName: string,
    page: number,
    limit: number,
    totalPages: number,
    totalItems: number,
    customParam: any,
  ): object {
    return {
      first: `${API_URL}/api/${serviceName}?limit=${limit}&page=1${
        customParam && '&'
      }${customParam}`,
      previous:
        page > 1
          ? `${API_URL}/${serviceName}?limit=${limit}&page=${
              page - 1
            }${customParam && '&'}${customParam}`
          : null,
      current: `${API_URL}/${serviceName}?limit=${limit}&page=${page}${
        customParam && '&'
      }${customParam}`,
      next:
        page < totalPages
          ? `${API_URL}/${serviceName}?limit=${limit}&page=${
              page + 1
            }${customParam && '&'}${customParam}`
          : null,
      last: `${API_URL}/${serviceName}?limit=${limit}&page=${totalPages}${
        customParam && '&'
      }${customParam}`,
      itemsPerPage: limit,
      totalItems,
      currentPage: page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      lastPage: totalPages,
    };
  }
}
