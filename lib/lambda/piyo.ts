import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

// Lambda関数のハンドラー
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // リクエストから情報を取得
  const method = event.httpMethod;
  const path = event.path;
  const queryParams = event.queryStringParameters;
  const body = event.body ? JSON.parse(event.body) : {};

  // 正常なレスポンスを返す
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "リクエストが成功しました。Piyo",
      method,
      path,
      queryParams,
      body,
    }),
  };
};
