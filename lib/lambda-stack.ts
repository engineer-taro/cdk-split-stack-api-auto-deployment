import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface LambdaStackProps extends cdk.StackProps {
  apiId: string;
  rootId: string;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // api-stackで定義したAPIGateway
    const apiGateway = RestApi.fromRestApiAttributes(this, "api", {
      restApiId: props.apiId,
      rootResourceId: props.rootId,
    });

    // hoge: Lambda定義
    const hogeLambda = new NodejsFunction(this, "hoge-lambda", {
      entry: "lib/lambda/hoge.ts",
      handler: "handler",
      bundling: {
        externalModules: ["aws-sdk"],
        forceDockerBundling: false,
      },
    });

    // hogeLambda: API GatewayとLambdaの統合
    const hogeIntegration = new LambdaIntegration(hogeLambda, {
      proxy: true,
    });
    apiGateway.root.addResource("hoge").addMethod("GET", hogeIntegration);

    // fuga
    const fugaLambda = new NodejsFunction(this, "fuga-lambda", {
      entry: "lib/lambda/fuga.ts",
      handler: "handler",
      bundling: {
        externalModules: ["aws-sdk"],
        forceDockerBundling: false,
      },
    });
    const fugaIntegration = new LambdaIntegration(fugaLambda, {
      proxy: true,
    });
    apiGateway.root.addResource("fuga").addMethod("GET", fugaIntegration);

    // piyo
    const piyoLambda = new NodejsFunction(this, "piyo-lambda", {
      entry: "lib/lambda/piyo.ts",
      handler: "handler",
      bundling: {
        externalModules: ["aws-sdk"],
        forceDockerBundling: false,
      },
    });
    const piyoIntegration = new LambdaIntegration(piyoLambda, {
      proxy: true,
    });
    apiGateway.root.addResource("piyo").addMethod("GET", piyoIntegration);
  }
}
