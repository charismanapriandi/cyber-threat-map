var express = require("express");
var router = express.Router();
const fs = require("fs");
const util = require("util");
const { Pool } = require("pg");
require("dotenv").config();
const maps_id = require('../public/id.json');
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

// Promisify fs.writeFile and fs.readFile for use with async/await
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

const saveCSVToFile = async(filename, csv) => {
    await writeFileAsync(filename, csv);
};

const readCSVAndEncode = async(filename) => {
    const fileContents = await readFileAsync(filename, { encoding: "utf-8" });
    const base64Encoded = Buffer.from(fileContents, "utf-8").toString("base64");
    return base64Encoded;
};
const jsonToBase64Csv = (jsonString) => {
    // Step 1: Parse the JSON string into a JavaScript object
    const jsonObj = JSON.parse(jsonString);

    // Step 2: Convert the JavaScript object to a CSV string
    const keys = Object.keys(jsonObj[0]);
    let csvString = keys.join(",") + "\n";

    jsonObj.forEach((item) => {
        const values = keys.map((key) => {
            const value = item[key];
            return typeof value === "string" ? `"${value}"` : value;
        });
        csvString += values.join(",") + "\n";
    });

    // Step 3: Encode the CSV string as Base64
    const base64Csv = btoa(csvString);

    return base64Csv;
};
const resultsToCSV = (results) => {
    if (!Array.isArray(results) || results.length === 0) {
        return "";
    }

    const header = Object.keys(results[0]).join(",") + "\r\n";
    const rows = results
        .map((row) => {
            return Object.values(row).join(",");
        })
        .join("\r\n");

    return header + rows;
};
/* GET home page. */
router.get("/", async function(req, res, next) {
    const limit = parseInt(req.query.limit) || 5000; // Default limit is 100 rows
    const offset = parseInt(req.query.offset) || 0;
    // const order = `ORDER BY "As of Date" DESC`
    const order = `ORDER BY "As of Date" DESC`;
    // let querynya = `SELECT
    //     CONCAT(fin.day, '/', fin.month, '/', fin.year, ' ', fin.hour, ':', fin.minute) AS "As of Date",
    //     fin.year AS "Fiscal Year",
    //     dstc.region AS "Region",
    //     CONCAT(dstc.name_en, '  (', dst.ip, ')') AS "Borrower Country",
    //     dst.country AS "Borrower Country Code",
    //     CONCAT(fin.year, fin.month, fin.day, fin.hour, fin.minute) AS "Project ID",
    //     'IP_MAP_REPORT' AS "Project Name",
    //     fin.signature AS "Procurement Type",
    //     CASE
    //         WHEN fin.priority = 1 THEN 'High Priority'
    //         WHEN fin.priority = 2 THEN 'Medium Priority'
    //         WHEN fin.priority = 3 THEN 'Low Priority'
    //         ELSE 'Very Low Priority'
    //     END AS "Procurement Category",
    //     fin.sensor AS "Procurement Method",
    //     dst.isp_name AS "Product line",
    //     dst.organization_name AS "WB Contract Number",
    //     fin.signature AS "Major Sector",
    //     src.organization_name AS "Contract Description",
    //     CONCAT(fin.year, '/', fin.month, '/', fin.day, ' ', fin.hour, ':', fin.minute) AS "Contract Signing Date",
    //     src.isp_name AS "Supplier",
    //     CONCAT(srcc.name_en, '  (', src.ip, ')') AS "Supplier Country",
    //     srcc.code AS "Supplier Country Code",
    //     CASE
    //         WHEN fin.day IS NOT NULL THEN '0'
    //     END AS "Total Contract Amount (USD)",
    //     CASE
    //         WHEN fin.day IS NOT NULL THEN '-'
    //     END AS "Borrower Contract Reference Number"
    // FROM
    //     ip_map_summary fin
    // JOIN
    //     ip_map src ON src.ip = fin.ip_src
    // JOIN
    //     ip_map dst ON dst.ip = fin.ip_dst
    // JOIN
    //     countries srcc ON srcc.code = src.country
    // JOIN
    //     countries dstc ON dstc.code = dst.country ${order};
    // `;
    let querynya = `SELECT
        CONCAT(fin.day, '/', fin.month, '/', fin.year, ' ', fin.hour, ':', fin.minute) AS "As of Date",
        fin.year AS "Fiscal Year",
        dstc.region AS "Region",
        CONCAT(dstc.name_en, '  (', dst.ip, ')') AS "Borrower Country",
        dst.country AS "Borrower Country Code",
        CONCAT(fin.year, fin.month, fin.day, fin.hour, fin.minute) AS "Project ID",
        'IP_MAP_REPORT' AS "Project Name",
        fin.signature AS "Procurement Type",
        CASE
            WHEN fin.priority = 1 THEN 'High Priority'
            WHEN fin.priority = 2 THEN 'Medium Priority'
            WHEN fin.priority = 3 THEN 'Low Priority'
            ELSE 'Very Low Priority'
        END AS "Procurement Category",
        fin.sensor AS "Procurement Method",
        dst.isp_name AS "Product line",
        dst.organization_name AS "WB Contract Number",
        fin.signature AS "Major Sector",
        src.organization_name AS "Contract Description",
        CONCAT(fin.year, '/', fin.month, '/', fin.day, ' ', fin.hour, ':', fin.minute) AS "Contract Signing Date",
        src.isp_name AS "Supplier",
        CONCAT(srcc.name_en, '  (', src.ip, ')') AS "Supplier Country",
        srcc.code AS "Supplier Country Code",
        CASE
            WHEN fin.day IS NOT NULL THEN '0'
        END AS "Total Contract Amount (USD)",
        CASE
            WHEN fin.day IS NOT NULL THEN '-'
        END AS "Borrower Contract Reference Number"
    FROM
        ip_map_summary fin
    JOIN
        ip_map src ON src.ip = fin.ip_src
    JOIN
        ip_map dst ON dst.ip = fin.ip_dst
    JOIN
        countries srcc ON srcc.code = src.country
    JOIN
        countries dstc ON dstc.code = dst.country ${order} LIMIT ${limit} OFFSET ${offset}; 
    `;
    // const querynya = `SELECT
    //     fin.day || '/' || fin.month || '/' || fin.year || ' ' || fin.hour || ':' || fin.minute as "As of Date" ,
    //     fin.year as "Fiscal Year" , dstc.region as "Region" , dstc.name_en || '  (' || dst.ip || ')' as "Borrower Country" ,
    //     dst.country as "Borrower Country Code" ,
    //     fin.year || '' || fin.month || '' || fin.day || '' || fin.hour || '' || fin.minute as "Project ID" ,
    //     CASE WHEN dst.ip IS NOT NULL THEN 'IP_MAP_REPORT' ELSE 'IP_MAP_REPORT' END as "Project Name" ,
    //     fin.signature as "Procurement Type" ,
    //     CASE WHEN fin.priority = 1 THEN 'High Priority' WHEN fin.priority = 2 THEN 'Medium Priority'
    //     WHEN fin.priority = 3 THEN 'Low Priority' ELSE 'Very Low Priority' END as "Procurement Category" , fin.sensor as "Procurement Method" ,
    //     dst.isp_name as "Product line" , dst.organization_name as "WB Contract Number" , fin.signature as "Major Sector" ,
    //     src.organization_name as "Contract Description" ,
    //     fin.year || '/' || fin.month || '/' || fin.day || ' ' || fin.hour || ':' || fin.minute as "Contract Signing Date" ,
    //     src.isp_name as "Supplier" , srcc.name_en || '  (' || src.ip || ')' as "Supplier Country" , srcc.code as "Supplier Country Code" ,
    //     CASE WHEN fin.day IS NOT NULL THEN '0' END as "Total Contract Amount (USD)" ,
    //     CASE WHEN fin.day IS NOT NULL THEN '-' END as "Borrower Contract Reference Number"
    //     FROM ip_map_summary fin
    //     JOIN ip_map src ON (src.ip = fin.ip_src)
    //     JOIN ip_map dst ON (dst.ip = fin.ip_dst)
    //     JOIN countries srcc ON (srcc.code = src.country)
    //     JOIN countries dstc ON (dstc.code = dst.country)
    //     `;
    try {
        const client = await pool.connect();
        try {
            const { rows } = await client.query(querynya);
            // const data = { data: 'z' };
            // const data = { data: JSON.stringify(rows) };
            // const datanya = jsonToBase64Csv(JSON.stringify(rows))
            // const data = { data: datanya };
            const csv = await resultsToCSV(rows);

            const filename = "./maps/output.csv";
            // const filename = "maps/output.csv";

            await saveCSVToFile(filename, csv);
            const base64EncodedCSV = await readCSVAndEncode(filename);

            // console.log('Base64 Encoded CSV:', base64EncodedCSV);
            const data = { data: base64EncodedCSV, maps_id: JSON.stringify(maps_id) };
            // console.log(resultsToCSV(rows));
            res.render("maps", data);
            // res.render("maps");
        } catch (error) {
            console.error(error);
            // client.release();
            res.status(500).send("An error occurred while fetching data.");
        } finally {
            client.release();
        }
    } catch (error) {
        const filename = "./maps/output.csv";
        // const filename = "maps/output.csv";
        const base64EncodedCSV = await readCSVAndEncode(filename);

        // console.log('Base64 Encoded CSV:', base64EncodedCSV);
        const data = { data: base64EncodedCSV, maps_id: JSON.stringify(maps_id) };
        // console.log(resultsToCSV(rows));
        res.render("maps", data);
    }
});

module.exports = router;