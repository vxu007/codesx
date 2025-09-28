# Bulk PDF to DOCX Converter

This is a Next.js application that allows users to upload multiple PDF files and convert them into DOCX format. The converted files are then zipped and made available for download.

## Features

-   Bulk PDF to DOCX conversion
-   File size validation (max 100MB per file)
-   Progress bar to show conversion status
-   Download converted files as a single ZIP archive
-   Modern, responsive UI with dark mode support

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the application in development mode, use the following command:

```bash
npm run dev
```

Open [http://localhost:3030](http://localhost:3030) with your browser to see the result.

## Docker

This application is containerized using Docker for easy deployment.

### Using Docker Compose (Recommended)

For a streamlined experience, you can use Docker Compose to build and run the application with a single command.

**Build and Run:**

```bash
docker-compose up --build -d
```

**Stop the Application:**

```bash
docker-compose down
```

### Manual Docker Commands

If you prefer to manage the container manually, you can use the following commands:

**Build the Docker Image:**

```bash
docker build -t pdf-converter .
```

**Run the Docker Container:**

```bash
docker run -d -p 3030:3030 pdf-converter
```

The application will be accessible at [http://localhost:3030](http://localhost:3030).