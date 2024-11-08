const formatResponse = (
  statusCode: number,
  success: boolean,
  data?: unknown
) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      success,
      data,
    }),
  };
};

export const SuccessResponse = (data: object, code: number = 200) => {
  return formatResponse(code, true, data);
};

export const ErrorResponse = (code = 500, error: unknown) => {
  let errorMessage;

  if (Array.isArray(error)) {
    const errorMessages = error.map((err) => {
      const constraints = err.constraints || {};
      return Object.values(constraints)[0] || "Error Occurred";
    });

    errorMessage = errorMessages.join(", ");
  } else if (typeof error === "object" && error !== null) {
    const constraints = (error as any).constraints || {};
    errorMessage = Object.values(constraints)[0] || "Error Occurred";
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return formatResponse(code, false, errorMessage);
};
