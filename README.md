
# **Take Home Log Service**

This is a lightweight, purpose-built HTTP REST API for querying and filtering log files. Designed with performance in mind, the service supports large log files (>1GB) and provides a customizable way to retrieve and filter log data.


## **Features**

1. **RESTful API** for querying log files.
2. Retrieve the newest log entries first (reverse chronological order).
3. Query parameters:
   - **Filename**: Specify the log file located in `/var/log`.
   - **Last `n` lines**: Fetch the most recent `n` entries.
   - **Keyword filtering**: Filter log entries containing specific text or keywords.
4. Efficient handling of large files (>1GB) without pre-built log aggregation systems.
5. Minimal external dependencies, purpose-built for log retrieval.


## **Getting Started**

### **Prerequisites**
- **Node.js** (v16+ recommended)
- **npm** (v7+ recommended)

---

### **Installation**
 Install dependencies:
   ```bash
   npm install
   ```

---

### **Running the Service**

#### **Development Mode**
For live development with hot-reloading:
```bash
npm run build
npm run dev
```
For running tests
```bash
npm run build
npm test
```

#### **Environment Variables**
- `PORT`: Port number for the service (default: `3000`).

---

### **Usage**

#### **1. Health Check**
- **Endpoint**: `GET /health`
- **Description**: Verifies the service is running.
- **Response**:
  ```json
  "Service is healthy! 🐐"
  ```

---

#### **2. Log Retrieval**
- **Endpoint**: `GET /log`
- **Description**: Retrieves log entries from a specified file.
- **Query Parameters**:
  - `filename` (required): Name of the file within `/var/log`.
  - `lines` (optional): Number of the most recent lines to fetch (default: `100`, max: `100,000`).
  - `keyword` (optional): Filter log entries containing the keyword.
- **Example Request**:
  ```bash
  curl "http://localhost:3000/log?filename=test-log.txt&lines=50&keyword=error"
  ```
- **Example Response**:
  ```json
  {
    "filename": "test-log.txt",
    "lines": 50,
    "keyword": "error",
    "results": [
      "2025-01-20 12:45:01 [ERROR] Something went wrong",
      "2025-01-20 12:44:59 [ERROR] Another error occurred"
    ],
    "count": 2
  }
  ```

---

### **Design Overview**
![component diagram](/img/takehome.drawio.png "Component Diagram")



### **Component Responsibilities**

#### **LogReader**
**Description**: Handles efficient file reading, focusing on retrieving the last `n` lines of large log files while respecting memory and performance constraints.

**Responsibilities**:
- Reads log files in reverse order to retrieve the most recent `n` lines.
- Processes files in configurable chunks (default: 1MB) for efficient handling of large files.
- Enforces safety limits:
  - Maximum of `100,000` lines for memory safety.
  - Maximum line length to prevent excessive memory usage.
- Provides configurable options:
  - `chunkSize` to adjust the size of file chunks being read.
  - `maxLineLength` to control truncation of long lines.
- Ensures safe cleanup of file streams on errors or completion.

### **SearchOrchestrator**
**Description**: Serves as the central business logic layer, orchestrating interactions between the `LogReader` and `TextFilter` to fulfill log search requests.

**Responsibilities**:
- Validates user input (e.g., filename, line count, keyword).
- Ensures safe file path handling to restrict access to `/var/log`.
- Delegates:
  - File reading to the `LogReader`.
  - Keyword-based filtering to the `TextFilter`.
- Combines results from multiple processing steps into a structured response.
- Handles errors and exceptions gracefully, ensuring consistent error messages.


### **TextFilter**
**Description**: Provides keyword-based filtering functionality for log data, ensuring case-insensitive and configurable filtering.

**Responsibilities**:
- Filters lines containing a specific keyword (case-insensitive).
- Supports filtering of logs with partial matches.
- Ensures efficient filtering for large sets of log lines.

---

### How They Work Together:
- **REST API**: Receives HTTP requests and extracts query parameters.
- **SearchOrchestrator**: Validates the request and orchestrates interactions with `LogReader` and `TextFilter`.
- **LogReader**: Retrieves the last `n` lines from the specified log file.
- **TextFilter**: Filters the retrieved log lines based on the provided keyword.
- **Response**: The filtered and formatted results are returned to the client.


---

### **Folder Structure**
```
src/
├── app.ts             # Express app setup
├── index.ts           # Service entry point
├── routes/            # Route definitions
│   └── logRoutes.ts   # Log retrieval logic
├── components/        # Core business logic
│   ├── LogReader.ts   # Reads log files efficiently
│   └── TextFilter.ts  # Filters log lines by keyword
```



---

### **License**
This project is licensed under the MIT License.