import axios from "axios";
import Papa from "papaparse";
import { ActivityArgs } from "../../../types";

// extract and return data from google sheet
export async function executeFetchGoogleSheetColumn(args: ActivityArgs) {
  try {
    const { config } = args;

    // extracting sheet data
    const sheetUrl = config.sheetUrl;
    const columnName = config.columnName;

    console.log("sheetUrl", sheetUrl);
    console.log("columnName", columnName);

    const csvUrl = sheetUrl
      .replace("edit", "export")
      .replace("usp", "format")
      .replace("sharing", "csv");

    // Fetch the CSV data from the Google Sheets URL
    const response = await axios.get(csvUrl);

    console.log("response.data", response.data);
    console.log("columnName", columnName);

    // Parse the CSV data into JSON format
    const { data } = Papa.parse(response.data, { header: true });

    // Extract data from the specified column
    const columnData = data.map((row: any) => row[columnName]);

    // Return the extracted data, filtering out undefined or empty values
    const output = columnData.filter(
      (value) => value !== undefined && value !== ""
    );

    return output;
  } catch (error) {
    throw new Error("Error executing executeFetchGoogleSheetColumn");
  }
}
