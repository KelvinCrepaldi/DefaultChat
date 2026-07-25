export type ApiErrorResponse = {
  status: string;
  statusCode: number;
  message: string;
};

declare global {
  type IErrorResponse = ApiErrorResponse;
}

export {};
