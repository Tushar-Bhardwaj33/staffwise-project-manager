# Assignment 3 Submission

## 1. Repository & URL
**GitHub Repository:** `[INSERT_YOUR_GITHUB_REPO_URL_HERE]`
**Deployed Frontend URL:** `https://dw9cd5iulcypt.cloudfront.net/`

## 2. CI/CD Workflow Screenshot
*[INSERT_SCREENSHOT_OF_SUCCESSFUL_GITHUB_ACTION_RUN]*

---

## 3. Workflow Explanation
The CI/CD pipeline is built using **GitHub Actions** and is triggered automatically whenever code is pushed to the `main` branch (specifically when files inside the `client/` directory are modified). 

The workflow performs the following automated steps:
1. **Checkout & Setup:** Checks out the latest repository code and sets up Node.js.
2. **Build:** Installs dependencies (`npm ci`) and builds the React/Vite frontend into static assets (`npm run build`).
3. **Authentication:** Securely assumes an AWS IAM identity using secrets stored in GitHub.
4. **Deploy:** Uses the AWS CLI to sync the built static assets directly to the S3 bucket. The `--delete` flag is used to ensure old, unused assets are purged.
5. **Cache Invalidation:** Triggers a CloudFront invalidation for `/*` so that the global edge network immediately serves the newest version of the website to end users.

## 4. Secure Credential Management
AWS credentials were provided to the workflow securely following the **principle of least privilege**. 

1. **IAM Policy & User:** A dedicated IAM User was created in AWS specifically for GitHub Actions. Rather than attaching administrator privileges, a custom inline IAM Policy was created. This policy exclusively allows `s3:PutObject`, `s3:GetObject`, `s3:ListBucket`, and `s3:DeleteObject` on the exact frontend S3 bucket, along with `cloudfront:CreateInvalidation` on the specific CloudFront distribution.
2. **GitHub Secrets:** The AWS Access Key and Secret Key for this least-privilege user were generated and immediately stored in **GitHub Repository Secrets**, along with the S3 Bucket Name and CloudFront ID.
3. **Execution:** The workflow references these credentials at runtime using the `aws-actions/configure-aws-credentials` action. Credentials are automatically masked in the workflow logs and are **never** hardcoded or committed to the codebase.
