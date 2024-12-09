let allProfilesCsv = []; // Array to hold CSV rows for all profiles

function formatDateString(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}.${month}`;
}

function escapeCsvField(field) {
    if (!field) return "";
    return `"${String(field).replace(/"/g, '""')}"`;
}

function generateFourDigitCode(index) {
    return String(1000 + index).padStart(4, "0");
}

function flattenDescription(description) {
    return description ? description.replace(/\r?\n|\r/g, " ").trim() : "";
}

function mapJsonToCsv(jsonData) {
    const columns = [
        "id", "id_type", "public_id", "profile_url", "email", "full_name", "first_name", "last_name",
        "avatar", "headline", "location_name", "summary",
        ...Array.from({ length: 10 }, (_, i) => [
            `organization_${i + 1}`, `organization_id_${i + 1}`, `organization_url_${i + 1}`,
            `organization_title_${i + 1}`, `organization_start_${i + 1}`, `organization_end_${i + 1}`,
            `organization_description_${i + 1}`, `position_description_${i + 1}`
        ]).flat(),
        ...Array.from({ length: 3 }, (_, i) => [
            `education_${i + 1}`, `education_degree_${i + 1}`, `education_fos_${i + 1}`,
            `education_start_${i + 1}`, `education_end_${i + 1}`
        ]).flat(),
        ...Array.from({ length: 3 }, (_, i) => [`language_${i + 1}`, `language_proficiency_${i + 1}`]).flat(),
        "languages", "skills"
    ];

    const csvRow = {};

    // Basic Information
    csvRow.id = jsonData.basics?.profiles?.[0]?.username || "";
    csvRow.id_type = ""; // Define logic if available, else keep empty
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
        if (index >= 10) return;
        const idx = index + 1;
        csvRow[`organization_${idx}`] = work.name || "";
        csvRow[`organization_id_${idx}`] = generateFourDigitCode(index);
        csvRow[`organization_url_${idx}`] = work.url || "";
        csvRow[`organization_title_${idx}`] = work.position || "";
        csvRow[`organization_start_${idx}`] = formatDateString(work.startDate) || "";
        csvRow[`organization_end_${idx}`] = formatDateString(work.endDate) || "";
        csvRow[`organization_description_${idx}`] = flattenDescription(work.summary || "");
        csvRow[`position_description_${idx}`] = flattenDescription(work.summary || "");
    });

    // Education
    (jsonData.education || []).forEach((edu, index) => {
        if (index >= 3) return;
        const idx = index + 1;
        csvRow[`education_${idx}`] = edu.institution || "";
        csvRow[`education_degree_${idx}`] = edu.studyType || "";
        csvRow[`education_fos_${idx}`] = edu.area || "";
        csvRow[`education_start_${idx}`] = formatDateString(edu.startDate) || "";
        csvRow[`education_end_${idx}`] = formatDateString(edu.endDate) || "";
    });

    // Languages
    (jsonData.languages || []).forEach((lang, index) => {
        if (index >= 3) return;
        const idx = index + 1;
        csvRow[`language_${idx}`] = lang.language || "";
        csvRow[`language_proficiency_${idx}`] = lang.fluency || "";
    });

    csvRow.languages = (jsonData.languages || []).map(lang => lang.language).join(", ");
    csvRow.skills = (jsonData.skills || []).map(skill => skill.name).join(", ");

    // Explicitly map columns to values in csvRow
    const row = columns.map(col => escapeCsvField(csvRow[col] || "")).join(",");

    return [columns.join(","), row];
}

document.addEventListener("DOMContentLoaded", () => {
    const profiles = [1, 2, 3, 4, 5];
    const downloadAllButton = document.getElementById("downloadAllButton");

    profiles.forEach(profile => {
        const convertButton = document.getElementById(`convertButton${profile}`);
        const jsonInput = document.getElementById(`jsonInput${profile}`);
        const successMessage = document.getElementById(`successMessage${profile}`);

        convertButton.addEventListener("click", () => {
            try {
                const jsonData = JSON.parse(jsonInput.value);
                const [headers, csvRow] = mapJsonToCsv(jsonData);
        
                if (allProfilesCsv.length === 0) {
                    allProfilesCsv.push(headers); // Add headers only once
                }
                allProfilesCsv.push(csvRow); // Add data row
        
                successMessage.textContent = `Profile ${profile} added to the combined CSV.`;
                successMessage.classList.remove("hidden");
        
                // Hide the input container after successful addition
                const inputContainer = document.getElementById(`inputContainer${profile}`);
                inputContainer.style.display = "none";
        
                downloadAllButton.disabled = false; // Enable the main download button
            } catch (error) {
                alert(`Invalid JSON for Profile ${profile}. Please check your input.`);
                console.error(`Error parsing JSON for Profile ${profile}:`, error);
            }
        });
    });

    downloadAllButton.addEventListener("click", () => {
        if (allProfilesCsv.length <= 1) {
            alert("No profiles added to download.");
            return;
        }
    
        const csvContent = allProfilesCsv.join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv" });
        const downloadLink = document.createElement("a");
    
        const profileCount = allProfilesCsv.length - 1; // Exclude header from count
        const now = new Date();
        const datePart = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            .toLowerCase()
            .replace(/,/, "")
            .replace(/ /g, "_");
        const timePart = `${now.getHours()}h_${now.getMinutes()}m`;
        const fileName = `${profileCount}_profiles_${datePart}_${timePart}.csv`;
    
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
    
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});