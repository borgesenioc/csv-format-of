// Function to map JSON to CSV
function mapJsonToCsv(jsonData) {
    const columns = [
        "id", "public_id", "profile_url", "email", "full_name", "first_name", "last_name", "avatar", "headline", "location_name", "summary",
        "organization_1", "organization_title_1", "organization_start_1", "organization_end_1", "organization_location_1", "position_description_1",
        "organization_2", "organization_title_2", "organization_start_2", "organization_end_2", "organization_location_2", "position_description_2",
        "organization_3", "organization_title_3", "organization_start_3", "organization_end_3", "organization_location_3", "position_description_3",
        "organization_4", "organization_title_4", "organization_start_4", "organization_end_4", "organization_location_4", "position_description_4",
        "organization_5", "organization_title_5", "organization_start_5", "organization_end_5", "organization_location_5", "position_description_5",
        "organization_6", "organization_title_6", "organization_start_6", "organization_end_6", "organization_location_6", "position_description_6",
        "organization_7", "organization_title_7", "organization_start_7", "organization_end_7", "organization_location_7", "position_description_7",
        "organization_8", "organization_title_8", "organization_start_8", "organization_end_8", "organization_location_8", "position_description_8",
        "organization_9", "organization_title_9", "organization_start_9", "organization_end_9", "organization_location_9", "position_description_9",
        "organization_10", "organization_title_10", "organization_start_10", "organization_end_10", "organization_location_10", "position_description_10",
        "education_1", "education_degree_1", "education_fos_1", "education_start_1", "education_end_1",
        "education_2", "education_degree_2", "education_fos_2", "education_start_2", "education_end_2",
        "education_3", "education_degree_3", "education_fos_3", "education_start_3", "education_end_3",
        "language_1", "language_proficiency_1",
        "language_2", "language_proficiency_2",
        "language_3", "language_proficiency_3",
        "skills"
    ];

    const rows = [];

    // Helper functions
    function sanitizeName(name) {
        if (!name) return "";
        const patternsToRemove = [
            /\b(dr\.?|phd|sir|mr\.?|ms\.?|mrs\.?|prof\.?|gen\.?|lt\.?|col\.?|maj\.?|sgt\.?|cpt\.?|admiral|commander|capt\.?)\b/gi,
            /\b(ret|retired)\b/gi,
            /\b(jr\.?|sr\.?|iii|iv|v)\b/gi
        ];
        return patternsToRemove.reduce((sanitized, pattern) => sanitized.replace(pattern, ""), name).trim();
    }

    function extractFirstName(name) {
        return name.split(" ")[0] || "";
    }

    function extractLastName(name) {
        const parts = name.split(" ");
        return parts.slice(1).join(" ") || "";
    }

    function formatSkills(skillsArray) {
        if (!skillsArray || skillsArray.length === 0) return "";
        return skillsArray.map(skill => `${skill.name} : ${skill.level || "null"}`).join(", ");
    }

    // Construct the csvRow
    const csvRow = {
        id: jsonData.basics?.profiles?.[0]?.username || "",
        public_id: jsonData.basics?.profiles?.[0]?.username || "",
        profile_url: jsonData.basics?.profiles?.[0]?.url || "",
        email: jsonData.basics?.email || "",
        full_name: sanitizeName(jsonData.basics?.name || ""),
        first_name: extractFirstName(sanitizeName(jsonData.basics?.name || "")),
        last_name: extractLastName(sanitizeName(jsonData.basics?.name || "")),
        avatar: jsonData.basics?.image || "",
        headline: jsonData.basics?.label || "",
        location_name: jsonData.basics?.location?.address || "",
        summary: jsonData.basics?.summary || "",
        skills: formatSkills(jsonData.skills || [])
    };

    // Add work and education mappings dynamically
    for (let i = 0; i < 10; i++) {
        csvRow[`organization_${i + 1}`] = jsonData.work?.[i]?.name || "";
        csvRow[`organization_title_${i + 1}`] = jsonData.work?.[i]?.position || "";
        csvRow[`organization_start_${i + 1}`] = jsonData.work?.[i]?.startDate || "";
        csvRow[`organization_end_${i + 1}`] = jsonData.work?.[i]?.endDate || "";
        csvRow[`organization_location_${i + 1}`] = jsonData.work?.[i]?.location || "";
        csvRow[`position_description_${i + 1}`] = jsonData.work?.[i]?.summary || "";
    }

    for (let i = 0; i < 3; i++) {
        csvRow[`education_${i + 1}`] = jsonData.education?.[i]?.institution || "";
        csvRow[`education_degree_${i + 1}`] = jsonData.education?.[i]?.studyType || "";
        csvRow[`education_fos_${i + 1}`] = jsonData.education?.[i]?.area || "";
        csvRow[`education_start_${i + 1}`] = jsonData.education?.[i]?.startDate || "";
        csvRow[`education_end_${i + 1}`] = jsonData.education?.[i]?.endDate || "";
    }

    for (let i = 0; i < 3; i++) {
        csvRow[`language_${i + 1}`] = jsonData.languages?.[i]?.language || "";
        csvRow[`language_proficiency_${i + 1}`] = jsonData.languages?.[i]?.fluency || "";
    }

    rows.push(columns.map(col => csvRow[col] || "").join(","));
    return [columns.join(","), ...rows].join("\n");
}

// Add event listeners
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
        const blob = new Blob([csvOutput.value], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "output.csv";
        downloadLink.click();
    });
});