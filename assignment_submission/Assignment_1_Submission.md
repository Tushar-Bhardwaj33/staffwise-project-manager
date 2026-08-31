# Assignment 1 Submission

## Deployed Frontend URL
**URL:** `https://dw9cd5iulcypt.cloudfront.net/`

---

## Architecture Description
The application is deployed using a decoupled, highly-available architecture on AWS:

1. **Frontend Hosting (S3 + CloudFront):** The React/Vite frontend application is compiled into static assets and hosted in an Amazon S3 bucket. Amazon CloudFront is deployed in front of the S3 bucket to act as a Content Delivery Network (CDN), caching the assets globally at edge locations and providing secure HTTPS access.
2. **Backend Hosting (EC2):** The Node.js backend API is deployed on an Amazon EC2 instance running in a VPC. The server runs on a custom TCP port (5000). 
3. **Security (IAM & Security Groups):** To ensure security, the EC2 instance is not exposed to the open internet. Its Security Group is configured to restrict inbound traffic on port 5000 exclusively to CloudFront's Managed Prefix List (`com.amazonaws.global.cloudfront.origin-facing`). This forces all traffic to flow through CloudFront, simulating a private subnet environment without the added complexity of a NAT Gateway. IAM roles follow the principle of least privilege, restricting access to only necessary resources.

---

## Frontend-Backend Communication
The frontend communicates with the backend seamlessly using **CloudFront as a Reverse Proxy**:

1. **Path-Based Routing:** The CloudFront distribution is configured with two Origins (S3 and EC2). It uses a Behavior with the path pattern `/api/*` to route all API traffic specifically to the EC2 Origin over HTTP on port 5000. All other traffic defaults to the S3 Origin to serve the frontend UI.
2. **Relative API Calls:** Because CloudFront handles both the frontend and backend under the exact same domain name, the frontend code utilizes relative URL paths. When the browser makes a request to `/api/auth/register`, it goes to CloudFront.
3. **HTTPS Termination & CORS:** CloudFront terminates the secure HTTPS connection from the client's browser, eliminating `ERR_SSL_PROTOCOL_ERROR` issues. It also completely bypasses CORS restrictions because the browser perceives the frontend and backend as sharing the exact same origin domain. CloudFront forwards the request (including all headers and cookies) to the EC2 backend, retrieves the response, and serves it back to the client securely.
