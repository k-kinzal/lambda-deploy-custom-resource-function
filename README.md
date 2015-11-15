# lambda-deploy-custom-resource-function

[![Build Status](https://travis-ci.org/k-kinzal/lambda-deploy-custom-resource-function.svg?branch=develop)](https://travis-ci.org/k-kinzal/lambda-deploy-custom-resource-function)
[![Dependency Status](https://david-dm.org/k-kinzal/lambda-deploy-custom-resource-function.png?theme=shields.io)](https://david-dm.org/k-kinzal/lambda-deploy-custom-resource-function)
[![devDependency Status](https://david-dm.org/k-kinzal/lambda-deploy-custom-resource-function/dev-status.png?theme=shields.io)](https://david-dm.org/k-kinzal/lambda-deploy-custom-resource-function#info=devDependencies)

It will deploy the AWS Lambda of general-purpose Lambda Function.

## Get started

Please be incorporated into your CloudFormation.

```json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "",
  "Resources": {
    "LambdaDeployCustomResourceExecuteRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }]
        },
        "Path": "/",
        "Policies": [{
          "PolicyName": "lambda_exec_role",
          "PolicyDocument": {
            "Version":"2012-10-17",
            "Statement":[
              {
                "Effect": "Allow",
                "Action": [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents"
                ],
                "Resource": [
                  "arn:aws:logs:*:*:*"
                ]
              },
              {
               "Effect": "Allow",
                "Action": [
                    "lambda:createFunction",
                    "lambda:updateFunctionCode",
                    "lambda:updateFunctionConfiguration",
                    "lambda:deleteFunction",
                    "iam:PassRole"
                ],
                "Resource": [
                  "*"
                ]
              }
            ]
          }
        }]
      }
    },
    "LambdaExampleExecuteRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }]
        },
        "Path": "/",
        "Policies": [{
          "PolicyName": "lambda_exec_role",
          "PolicyDocument": {
            "Version":"2012-10-17",
            "Statement":[
              {
                "Effect": "Allow",
                "Action": [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents"
                ],
                "Resource": [
                  "arn:aws:logs:*:*:*"
                ]
              }
            ]
          }
        }]
      }
    },
    "LambdaDeployCustomResourceFunction": {
      "Type" : "AWS::Lambda::Function",
      "Properties" : {
        "Code" : {
          "S3Bucket" : "file-repositories",
          "S3Key" : "lambda/lambda-deploy-custom-resource-function/0.0.1.zip"
        },
        "Description" : "It will deploy the AWS Lambda of general-purpose Lambda Function.",
        "Handler" : "src/index.handler",
        "MemorySize" : 128,
        "Role" : {"Fn::GetAtt" : [ "LambdaDeployCustomResourceExecuteRole", "Arn" ]},
        "Runtime" : "nodejs",
        "Timeout" : 60
      },
      "DependsOn" : "LambdaDeployCustomResourceExecuteRole"
    },
    "LambdaExampleFunction": {
       "Type": "AWS::CloudFormation::CustomResource",
       "Version" : "1.0",
       "Properties" : {
          "ServiceToken": {"Fn::GetAtt" : [ "LambdaDeployCustomResourceFunction", "Arn" ]},
          "URL": "[Your Lambda function URL]",
          "FunctionName": "example-function",
          "Handler": "src/index.handler",
          "Role": { "Fn::GetAtt": ["LambdaExampleExecuteRole", "Arn"] },
          "Runtime": "nodejs",
          "Description": "Example function.",
          "MemorySize": 128,
          "Publish": true,
          "Timeout": 3,
          "Config": {
            "key1": 1,
            "key2": "str",
            "key3": [1, 2, 3]
          }
       },
      "DependsOn" : ["LambdaExampleExecuteRole", "LambdaDeployCustomResourceFunction"]
    }
  }
}
```

# License

MIT

