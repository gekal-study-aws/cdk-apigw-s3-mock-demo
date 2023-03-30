# API Gatewayとs3連携のモックサンプル

## リソースのデプロイ

```bash
cdk deploy --tags user=gekal
```

## リソースのクリア

```bash
cdk destroy
```

## 参照

1. [APIテストに便利！　「Amazon API Gateway」と「Amazon S3」で作る、レスポンスを動的かつ簡単に変更できるAPIモック](https://atmarkit.itmedia.co.jp/ait/articles/2302/02/news010.html)
2. [【AWS CDK】API Gateway で S3 をプロキシしてオブジェクトをダウンロードしてみた](https://dev.classmethod.jp/articles/api-gateway-proxy-to-s3-get-object-by-cdk/)
3. [【AWS CDK】API Gateway で S3 をプロキシしてオブジェクトをアップロードしてみた](https://dev.classmethod.jp/articles/api-gateway-proxy-to-s3-put-object-by-cdk/)
