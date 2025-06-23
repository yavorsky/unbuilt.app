export const awsAmplify = [
  {
    name: 'headers' as const,
    score: 1.4,
    headers: {
      // CloudFront headers (Amplify uses CloudFront)
      'x-amz-cf-id': /.+/,
      'x-amz-cf-pop': /.+/,
      'x-cache': /from cloudfront/i,
      // Amplify specific headers
      'x-amzn-requestid': /.+/,
    },
  },
  {
    name: 'dom-markers' as const,
    score: 0.3,
    documents: [
      // Amplify UI components
      /amplify-authenticator/,
      /amplify-sign-in|amplify-sign-out/,
      /amplify-s3-album|amplify-photo-picker/,
      // Amplify generated attributes
      /data-amplify/,
    ],
  },
  {
    name: 'filenames' as const,
    score: 0.5,
    filenames: [
      // Amplify domains
      /\.amplifyapp\.com\//,
      // Amplify static assets
      /aws-amplify\.s3\.amazonaws\.com\//,
      // Amplify API paths
      /\/amplify\/api\//,
    ],
  },
];
