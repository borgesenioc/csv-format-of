// Helper function to escape fields for CSV
function escapeCsvField(field) {
    if (!field) return "";
    return `"${field.replace(/"/g, '""')}"`; // Escape double quotes and wrap in quotes
}

// Function to map JSON to CSV
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
    csvRow.summary = (jsonData.work || []).map(work => work.summary || "").join(", ");

    // Organizations
    (jsonData.work || []).forEach((work, index) => {
        if (index >= 10) return; // Limit to 10 organizations
        const idx = index + 1;
        csvRow[`organization_${idx}`] = work.name || "";
        csvRow[`organization_title_${idx}`] = work.position || "";
        csvRow[`organization_start_${idx}`] = work.startDate || "";
        csvRow[`organization_end_${idx}`] = work.endDate || "";
        csvRow[`organization_location_${idx}`] = work.location || "";
        csvRow[`position_description_${idx}`] = work.summary || "";
    });

    // Education
    (jsonData.education || []).forEach((edu, index) => {
        if (index >= 3) return; // Limit to 3 education entries
        const idx = index + 1;
        csvRow[`education_${idx}`] = edu.institution || "";
        csvRow[`education_degree_${idx}`] = edu.studyType || "";
        csvRow[`education_fos_${idx}`] = edu.area || "";
        csvRow[`education_start_${idx}`] = edu.startDate || "";
        csvRow[`education_end_${idx}`] = edu.endDate || "";
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
        const blob = new Blob([csvOutput.value], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
        const fileName =
            csvOutput.value.split(",")[16]?.trim() || "output"; // Use full_name or default
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${fileName}_${currentDate}.csv`;
        downloadLink.click();
    });
});