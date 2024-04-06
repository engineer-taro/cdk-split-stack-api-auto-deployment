import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AccessLogFormat,
  Deployment,
  LogGroupLogDestination,
  RestApi,
  Stage,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { createFilesHash } from "./util/create-file-hash";

interface ApiDeploymentStackProps extends cdk.StackProps {
  apiId: string;
  rootId: string;
  logGroupName: string;
}

export class ApiDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiDeploymentStackProps) {
    super(scope, id, props);

    // api-stackで定義したAPIGateway
    const apiGateway = RestApi.fromRestApiAttributes(this, "api", {
      restApiId: props.apiId,
      rootResourceId: props.rootId,
    });

    // Deploymentを定義
    const deployment = new Deployment(this, "base-api-deployment", {
      api: apiGateway,
      retainDeployments: true,
    });
    createFilesHash(["lib/lambda-stack.ts"])
      .then((fileHash) => deployment.addToLogicalId(fileHash))
      .catch((error) => {
        throw new Error(`Error reading files: ${error}`);
      });

    // Stageを定義
    const logGroup = LogGroup.fromLogGroupName(
      this,
      "api-gateway-log",
      props.logGroupName
    );
    const stage = new Stage(this, "base-api-stage", {
      deployment,
      stageName: "prod",
      accessLogDestination: new LogGroupLogDestination(logGroup),
      accessLogFormat: AccessLogFormat.clf(),
    });

    const usagePlan = new UsagePlan(this, "base-api-usage-plan", {
      name: "base-api-usage-plan",
      throttle: {
        rateLimit: 1000,
        burstLimit: 100,
      },
      apiStages: [
        {
          api: apiGateway,
          stage,
        },
      ],
    });
  }
}
