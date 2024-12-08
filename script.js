function formatDateString(dateString) {
    if (!dateString) return ""; // Return an empty string if dateString is falsy
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // If the date is invalid, return the original string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    return `${year}.${month}`; // Return in compact format (YYYY.MM)
}

// Helper function to escape fields for CSV
function escapeCsvField(field) {
    if (!field) return ""; // Return an empty string if the field is undefined or null
    return `"${String(field).replace(/"/g, '""')}"`; // Escape double quotes and wrap in quotes
}

// Generate a 4-digit code for organization IDs
function generateFourDigitCode(index) {
    return String(1000 + index).padStart(4, '0'); // Generate a 4-digit code starting at 1000
}

// Function to flatten multi-line descriptions into a single line
function flattenDescription(description) {
    return description ? description.replace(/\r?\n|\r/g, " ").trim() : "";
}

function mapJsonToCsv(jsonData) {
    const columns = [
        "id", "id_type", "public_id", "public_id_actual_at", "member_id", "member_id_actual_at", "hash_id", "sn_member_id", "sn_hash_id", "r_member_id",
        "t_hash_id", "avatar_id", "public_id_2", "lh_id", "profile_url", "email", "email_type", "full_name", "first_name", "last_name", "original_first_name",
        "original_last_name", "custom_first_name", "custom_last_name", "avatar", "headline", "mini_profile_actual_at", "location_name", "industry", "industry_actual_at",
        "summary", "address", "birthday", "badges_premium", "badges_influencer", "badges_job_seeker", "badges_open_link", "badges_hiring", "current_company",
        "current_company_custom", "current_company_position", "current_company_custom_position", "current_company_actual_at", "current_company_industry",
    ];

    // Add dynamic organization, education, and language columns
    for (let i = 1; i <= 10; i++) {
        columns.push(
            `organization_${i}`, `organization_id_${i}`, `organization_url_${i}`, `organization_title_${i}`,
            `organization_start_${i}`, `organization_end_${i}`, `organization_description_${i}`, `organization_location_${i}`,
            `organization_website_${i}`, `organization_domain_${i}`, `position_description_${i}`
        );
    }
    for (let i = 1; i <= 3; i++) {
        columns.push(
            `education_${i}`, `education_degree_${i}`, `education_fos_${i}`, `education_start_${i}`,
            `education_end_${i}`, `education_description_${i}`
        );
    }
    for (let i = 1; i <= 3; i++) {
        columns.push(`language_${i}`, `language_proficiency_${i}`);
    }

    columns.push("languages", "skills");

    const csvRow = {};

    // Basic Information
    csvRow.id = jsonData.basics?.profiles?.[0]?.username || "";
    csvRow.public_id = jsonData.basics?.profiles?.[0]?.username || "";
    csvRow.profile_url = jsonData.basics?.profiles?.[0]?.url || "";
    csvRow.email = jsonData.basics?.email || "";
    csvRow.full_name = jsonData.basics?.name || "";
    csvRow.first_name = jsonData.basics?.name?.split(" ")[0] || "";
    csvRow.last_name = jsonData.basics?.name?.split(" ").slice(1).join(" ") || "";
    csvRow.avatar = jsonData.basics?.image || "";
    csvRow.headline = jsonData.basics?.label || "";
    csvRow.location_name = jsonData.basics?.location?.address || "";
    csvRow.summary = flattenDescription(jsonData.basics?.summary || "");

    // Organizations
    (jsonData.work || []).forEach((work, index) => {
        if (index >= 10) return; // Limit to 10 organizations
        const idx = index + 1;
        const description = flattenDescription(work.summary || ""); // Flattened description
        csvRow[`organization_${idx}`] = work.name || "";
        csvRow[`organization_id_${idx}`] = generateFourDigitCode(index); // Assign a 4-digit ID
        csvRow[`organization_url_${idx}`] = `https://www.linkedin.com/company/${generateFourDigitCode(index)}`;
        csvRow[`organization_title_${idx}`] = work.position || "";
        csvRow[`organization_start_${idx}`] = formatDateString(work.startDate) || "";
        csvRow[`organization_end_${idx}`] = formatDateString(work.endDate) || "";
        csvRow[`organization_description_${idx}`] = description; // Same description
        csvRow[`position_description_${idx}`] = description; // Same description
    });

    // Education
    (jsonData.education || []).forEach((edu, index) => {
        if (index >= 3) return; // Limit to 3 education entries
        const idx = index + 1;
        csvRow[`education_${idx}`] = edu.institution || "";
        csvRow[`education_degree_${idx}`] = edu.studyType || "";
        csvRow[`education_fos_${idx}`] = edu.area || "";
        csvRow[`education_start_${idx}`] = formatDateString(edu.startDate) || "";
        csvRow[`education_end_${idx}`] = formatDateString(edu.endDate) || "";
    });

    // Languages
    (jsonData.languages || []).forEach((lang, index) => {
        if (index >= 3) return; // Limit to 3 languages
        const idx = index + 1;
        csvRow[`language_${idx}`] = lang.language || "";
        csvRow[`language_proficiency_${idx}`] = lang.fluency || "";
    });

    csvRow.languages = (jsonData.languages || []).map(lang => lang.language).join(", ");
    csvRow.skills = (jsonData.skills || []).map(skill => `${skill.name} : ${skill.level || "null"}`).join(", ");

    // Map CSV fields and return result
    const rows = [columns.map(col => escapeCsvField(csvRow[col] || "")).join(",")];
    return [columns.join(","), ...rows].join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
    // Profile 1 Elements

    const convertButton = document.getElementById("convertButton");
    const downloadButton = document.getElementById("downloadButton");
    const jsonInput = document.getElementById("jsonInput");

    // Disable download button initially
    downloadButton.disabled = true;

    convertButton.addEventListener("click", () => {
        try {
            const jsonData = JSON.parse(jsonInput.value);
            const csvData = mapJsonToCsv(jsonData);

            downloadButton.dataset.csv = csvData;
            downloadButton.disabled = false;
            downloadButton.classList.add("enabled");
        } catch (error) {
            alert("Invalid JSON. Please check your input.");
            console.error("Error parsing JSON:", error);
        }
    });

    downloadButton.addEventListener("click", () => {
        try {
            const csvData = downloadButton.dataset.csv;
            const blob = new Blob([csvData], { type: "text/csv" });
            const downloadLink = document.createElement("a");

            const jsonData = JSON.parse(jsonInput.value);
            const firstName = jsonData.basics?.name?.split(" ")[0]?.toLowerCase() || "unknown";
            const lastName = jsonData.basics?.name?.split(" ").slice(1).join("_").toLowerCase() || "user";
            const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "_");
            const fileName = `${firstName}_${lastName}_${currentDate}.csv`;

            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            alert("Error downloading the CSV file.");
            console.error("Error downloading the CSV file:", error);
        }
    });

    jsonInput.addEventListener("input", () => {
        downloadButton.disabled = true;
        downloadButton.classList.remove("enabled");
    });
// Profile 2 Elements
const convertButton2 = document.getElementById("convertButton2");
const downloadButton2 = document.getElementById("downloadButton2");
const jsonInput2 = document.getElementById("jsonInput2");

// Disable Profile 2's download button initially
downloadButton2.disabled = true;

convertButton2.addEventListener("click", () => {
    try {
        const jsonData = JSON.parse(jsonInput2.value);
        const csvData = mapJsonToCsv(jsonData);

        downloadButton2.dataset.csv = csvData;
        downloadButton2.disabled = false;
        downloadButton2.classList.add("enabled");
    } catch (error) {
        alert("Invalid JSON for Profile 2. Please check your input.");
        console.error("Error parsing JSON for Profile 2:", error);
    }
});

downloadButton2.addEventListener("click", () => {
    try {
        const csvData = downloadButton2.dataset.csv;
        const blob = new Blob([csvData], { type: "text/csv" });
        const downloadLink = document.createElement("a");

        const jsonData = JSON.parse(jsonInput2.value);
        const firstName = jsonData.basics?.name?.split(" ")[0]?.toLowerCase() || "unknown";
        const lastName = jsonData.basics?.name?.split(" ").slice(1).join("_").toLowerCase() || "user";
        const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "_");
        const fileName = `${firstName}_${lastName}_${currentDate}_profile2.csv`;

        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } catch (error) {
        alert("Error downloading the CSV file for Profile 2.");
        console.error("Error downloading CSV for Profile 2:", error);
    }
});

jsonInput2.addEventListener("input", () => {
    downloadButton2.disabled = true;
    downloadButton2.classList.remove("enabled");
});



});