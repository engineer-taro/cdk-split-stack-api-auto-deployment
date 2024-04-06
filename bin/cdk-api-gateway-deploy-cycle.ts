import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { LambdaStack } from "../lib/lambda-stack";
import { ApiDeploymentStack } from "../lib/api-deployment-stack";

const app = new cdk.App();

const apiStack = new ApiStack(app, "api-stack", {});

const lambdaStack = new LambdaStack(app, "lambda-stack", {
  apiId: apiStack.apiId,
  rootId: apiStack.rootId,
});

const apiDeploymentStack = new ApiDeploymentStack(app, "api-deployment-stack", {
  apiId: apiStack.apiId,
  rootId: apiStack.rootId,
  logGroupName: apiStack.logGroupName,
});
apiDeploymentStack.addDependency(lambdaStack);
