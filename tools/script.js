import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 5,
  duration: "30s",
};

/**
 * NOTE: デプロイ時に瞬断が起こるかどうか検証するために作成
 * `k6 run tools/script.js` で実行
 */
export default function () {
  http.get(
    "https://hogehogehoge.execute-api.ap-northeast-1.amazonaws.com/prod/piyo" // APIGatewayがデプロイされた後にこちらを変更してテストできる.
  );
  sleep(0.01);
}
