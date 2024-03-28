## Overview

 Data Splitter is a web-based tool designed to facilitate the viewing and exploration of large CSV files. It offers a user-friendly interface for navigating through paginated data, with built-in features for filtering and searching specific content. This README provides an overview of the project, its key features, usage instructions, technologies used, and more.

## Features

- **Pagination:** Divide CSV data into manageable chunks and present it across multiple pages.
- **Data Filtering:** Enable users to filter data based on specific criteria and search for relevant information.
- **Responsive Design:** Adapt to various screen sizes for optimal viewing experience across devices.
- **Interactive Controls:** Provide intuitive buttons and interactive elements for seamless data interaction and exploration.

## Usage

1. **Data Loading:** Specify the input CSV file path (`inputCSVPath`) and output directory (`outputDir`).
2. **Filtering Data:** Utilize the filter input field and button to search for specific content within the CSV data.
3. **Pagination Controls:** Navigate through different pages of data using the pagination buttons.

## Technologies Used

- **JavaScript:** Scripting dynamic behavior and interactivity.
- **HTML/CSS:** Structuring the web interface and applying styles.
- **Node.js:** Handling server-side file system operations and HTTP requests.
- **Fetch API:** Asynchronously fetching CSV data and total page information.
- **CSV Parsing:** Implementing custom parsing logic for efficient data extraction and processing.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mikek92/Data-Splitter.git
Navigate to the project directory:


----------- 1# Installing ------------------------

To get started with the project, clone the repository and install the dependencies.

Install dependencies:
```bash
npm install
```

-----------  Running the Application -----------

To start the application in development mode with nodemon (which will automatically restart the server upon changes):
start

   ```bash
npm run dev
   ```

To start the application in production mode:

```bash

npm start
```
# Built With

Node.js - The runtime server environment
Express - The web framework used
npm - Dependency Management
______________
Open your web browser and navigate to http://localhost:3000 to access the Data-Splitter.
