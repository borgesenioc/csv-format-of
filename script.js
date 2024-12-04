// Helper function to escape fields for CSV
function escapeCsvField(field) {
    if (!field) return "";
    return `"${field.replace(/"/g, '""').replace(/\r?\n|\r/g, " ")}"`; // Escape quotes, replace newlines with spaces
}

// Helper function to get today's date in yyyy-mm-dd format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
}

// Function to map JSON to CSV
function mapJsonToCsv(jsonData) {
    const columns = [
        "id", "public_id", "profile_url", "email", "full_name", "first_name", "last_name", "avatar", "headline", "location_name", "summary",
        "organization_1", "organization_title_1", "organization_start_1", "organization_end_1", "organization_location_1", "position_description_1",
        "education_1", "education_degree_1", "education_fos_1", "education_start_1", "education_end_1",
        "language_1", "language_proficiency_1",
        "skills"
    ];

    const csvRow = {
        id: jsonData.basics?.profiles?.[0]?.username || "",
        public_id: jsonData.basics?.profiles?.[0]?.username || "",
        profile_url: jsonData.basics?.profiles?.[0]?.url || "",
        email: jsonData.basics?.email || "",
        full_name: jsonData.basics?.name || "",
        first_name: jsonData.basics?.name?.split(" ")[0] || "",
        last_name: jsonData.basics?.name?.split(" ").slice(1).join(" ") || "",
        avatar: jsonData.basics?.image || "",
        headline: jsonData.basics?.label || "",
        location_name: jsonData.basics?.location?.address || "",
        summary: (jsonData.work || []).map(work => work.summary || "").join(", "),
        organization_1: jsonData.work?.[0]?.name || "",
        organization_title_1: jsonData.work?.[0]?.position || "",
        organization_start_1: jsonData.work?.[0]?.startDate || "",
        organization_end_1: jsonData.work?.[0]?.endDate || "",
        organization_location_1: jsonData.work?.[0]?.location || "",
        position_description_1: jsonData.work?.[0]?.summary || "",
        education_1: jsonData.education?.[0]?.institution || "",
        education_degree_1: jsonData.education?.[0]?.studyType || "",
        education_fos_1: jsonData.education?.[0]?.area || "",
        education_start_1: jsonData.education?.[0]?.startDate || "",
        education_end_1: jsonData.education?.[0]?.endDate || "",
        language_1: jsonData.languages?.[0]?.language || "",
        language_proficiency_1: jsonData.languages?.[0]?.fluency || "",
        skills: (jsonData.skills || []).map(skill => `${skill.name} : ${skill.level || "null"}`).join(", ")
    };

    const rows = [columns.map(col => escapeCsvField(csvRow[col])).join(",")];
    return [columns.join(","), ...rows].join("\n");
}

// Example usage
document.addEventListener("DOMContentLoaded", () => {
    const convertButton = document.getElementById("convertButton");
    const downloadButton = document.getElementById("downloadButton");
    const jsonInput = document.getElementById("jsonInput");
    const csvOutput = document.getElementById("csvOutput");

    convertButton.addEventListener("click", () => {
        try {
            const jsonData = JSON.parse(jsonInput.value);
            const csvData = mapJsonToCsv(jsonData);
            csvOutput.value = csvData;
            downloadButton.disabled = false;
        } catch (error) {
            alert("Invalid JSON. Please check your input.");
            console.error(error);
        }
    });

    downloadButton.addEventListener("click", () => {
        const firstName = document.getElementById("csvOutput").value.split(",")[5]?.replace(/"/g, "") || "output";
        const lastName = document.getElementById("csvOutput").value.split(",")[6]?.replace(/"/g, "") || "";
        const fileName = `${firstName}_${lastName}_${getCurrentDate()}.csv`;

        const blob = new Blob([csvOutput.value], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
    });
});