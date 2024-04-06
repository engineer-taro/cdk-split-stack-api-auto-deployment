import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { LogGroup } from "aws-cdk-lib/aws-logs";

export class ApiStack extends cdk.Stack {
  public readonly apiId: string;
  public readonly rootId: string;
  public readonly logGroupName: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, "base-api-log-group");

    const api = new RestApi(this, "base-api", {
      deploy: false,
      cloudWatchRole: true,
    });

    api.addUsagePlan("base-api-usage-plan", {
      name: "base-api-usage-plan",
      throttle: {
        rateLimit: 1000,
        burstLimit: 100,
      },
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
        },
      ],
    });

    api.root.addMethod("any");

    this.apiId = api.restApiId;
    this.rootId = api.restApiRootResourceId;
    this.logGroupName = logGroup.logGroupName;
  }
}
