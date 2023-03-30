import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import path = require('path');

export class CdkApigwS3MockDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'api-mock-s3-read-sample', {
      roleName: 'APIMockS3ReadSample',
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess')],
    });

    const bucket = new s3.Bucket(this, 'api-mock-sample-test-data', {
      bucketName: 'api-mock-sample-test-data-gekal',
    });

    const deployment = new s3deploy.BucketDeployment(this, 's3-mock-data-deployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'asset'))],
      destinationBucket: bucket,
    });

    const api = new apigateway.RestApi(this, 'apigw-s3-mock', {
      deployOptions: {
      }
    });

    const mockIntegration = new apigateway.MockIntegration({
      requestTemplates: {
        'application/json': '{"statusCode": 202}'
      },
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': '{"statusCode":200,"message":"OK."}'
          }
        },
      ]
    });

    const mock = api.root.addResource('mock', {});
    const method = mock.addMethod('GET', mockIntegration, {
      methodResponses: [
        {
          statusCode: '200'
        },
      ],
    });

    const users = mock.addResource('users', {});
    users.addMethod('GET', new apigateway.AwsIntegration({
      service: 's3',
      integrationHttpMethod: 'GET',
      path: `${bucket.bucketName}/users.json`,
      options: {
        credentialsRole: role,
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
        requestParameters: {
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Timestamp':
                'integration.response.header.Date',
              'method.response.header.Content-Length':
                'integration.response.header.Content-Length',
              'method.response.header.Content-Type':
                'integration.response.header.Content-Type',
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,Authorization'",
              'method.response.header.Access-Control-Allow-Methods':
                "'OPTIONS,POST,PUT,GET,DELETE'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
          {
            statusCode: '400',
            selectionPattern: '4\\d{2}',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,Authorization'",
              'method.response.header.Access-Control-Allow-Methods':
                "'OPTIONS,POST,PUT,GET,DELETE'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
          {
            statusCode: '500',
            selectionPattern: '5\\d{2}',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,Authorization'",
              'method.response.header.Access-Control-Allow-Methods':
                "'OPTIONS,POST,PUT,GET,DELETE'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
      },
    }),
      {
        requestParameters: {
        },
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Timestamp': true,
              'method.response.header.Content-Length': true,
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
          {
            statusCode: '400',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
          {
            statusCode: '500',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
      }
    );

    const userinfo = users.addResource('{id}', {});
    userinfo.addMethod('GET', new apigateway.AwsIntegration({
      service: 's3',
      integrationHttpMethod: 'GET',
      path: `${bucket.bucketName}/userinfo/{id}.json`,
      options: {
        credentialsRole: role,
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
        requestParameters: {
          'integration.request.path.id': 'method.request.path.id',
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Timestamp':
                'integration.response.header.Date',
              'method.response.header.Content-Length':
                'integration.response.header.Content-Length',
              'method.response.header.Content-Type':
                'integration.response.header.Content-Type',
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,Authorization'",
              'method.response.header.Access-Control-Allow-Methods':
                "'OPTIONS,POST,PUT,GET,DELETE'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
          {
            statusCode: '400',
            selectionPattern: '4\\d{2}',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,Authorization'",
              'method.response.header.Access-Control-Allow-Methods':
                "'OPTIONS,POST,PUT,GET,DELETE'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
          {
            statusCode: '500',
            selectionPattern: '5\\d{2}',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,Authorization'",
              'method.response.header.Access-Control-Allow-Methods':
                "'OPTIONS,POST,PUT,GET,DELETE'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
      },
    }),
      {
        requestParameters: {
          'method.request.path.id': true,
        },
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Timestamp': true,
              'method.response.header.Content-Length': true,
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
          {
            statusCode: '400',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
          {
            statusCode: '500',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
      }
    );
  }
}
