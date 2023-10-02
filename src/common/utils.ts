import { HttpStatus } from '@nestjs/common';

export const microserviceResponses = {
  error: (error) => {
    return {
      isError: true,
      error: {
        message: error.message,
        status: error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      },
      result: null,
    };
  },
  success: (result) => {
    return {
      isError: false,
      error: null,
      result: result,
    };
  },
};
