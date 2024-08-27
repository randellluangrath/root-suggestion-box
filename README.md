# root-suggestion-box

https://github.com/user-attachments/assets/84c55bb4-044f-4a47-9ae5-fd071abdcebe

This full-stack application is built with Next.js for the frontend and Node.js with Express for the backend. The project is structured into two primary directories: client for the frontend and server for the backend.

On the server side, suggestions are automatically populated every 15 seconds. However, to receive real-time updates from the server, users must connect to the WebSocket after signing in. Without this connection, server-to-client updates will not be received.

### 1. Install Root Dependencies

First, install the root-level dependencies by running the following command:

```bash
npm install
```

This command will install the dependencies needed to run the scripts that manage both the client and server.

### 2. Install Client and Server Dependencies

To install all necessary dependencies for both the client and server, run the following command from the root directory:

```bash
npm run install:all
```

This command will automatically navigate to the client and server directories and install the dependencies in each.

### 3. Create a `.env` File

Before running the application, you'll need to create a .env file in the root directory. This file will store environment variables used by the application.

1. Create a .env file in the root directory of the server project:

```bash
touch .env
```

2. Add the following line to the .env file to set up your JWT signing key:

```bash
SIGNING_KEY=your_generated_signing_key_here
```

### 4. Generate a JWT Signing Key

To generate a secure JWT signing key, you can use the following command in a Node.js environment:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will output a random 128-character hexadecimal string, which you can then copy and paste into your .env file as the value for SIGNING_KEY.

### 5. Running the Application

To start both the client and server in development mode:

```bash
npm run dev
```

### 6. Access the Application

After starting the application, navigate to:

```bash
http://localhost:3000/suggestion-boxes
```

This will open the Suggestion Boxes page in your browser.
