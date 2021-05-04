export interface IResponse {
  ok: boolean;
  statusCode: number;
  data: unknown;
}

export const HttpResponse = {
  GetBadRequestResponse: (data: unknown = null) => {
    const response: IResponse = {
      ok: false,
      statusCode: 400,
      data: data ? data : null,
    };
    return response;
  },
  GetServerErrorResponse: (data: unknown = null) => {
    const response: IResponse = {
      ok: false,
      statusCode: 500,
      data: data ? data : null,
    };
    return response;
  },
  GetOkResponse: (data: unknown = null) => {
    const response: IResponse = {
      ok: true,
      statusCode: 200,
      data: data ? data : null,
    };
    return response;
  },
};

export const JsonResponse = (
  status: boolean,
  statusCode: number = 200,
  data: unknown
) => {
  const response: IResponse = {
    ok: status,
    statusCode: statusCode,
    data: data,
  };
  return response;
};
