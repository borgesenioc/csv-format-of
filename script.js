
function mapJsonToCsv(jsonData) {
    // Define the column names in the required order
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

    // Initialize CSV rows
    const rows = [];

    // Extract data from JSON and map to CSV columns
    const basics = jsonData.basics || {};
    const work = jsonData.work || [];
    const education = jsonData.education || [];

    // Helper function to sanitize names
function sanitizeName(name) {
  if (!name) return "";
  // Define patterns to remove common prefixes, titles, and suffixes
  const patternsToRemove = [
    /\b(dr\.?|phd|sir|mr\.?|ms\.?|mrs\.?|prof\.?|gen\.?|lt\.?|col\.?|maj\.?|sgt\.?|cpt\.?|admiral|commander|capt\.?)\b/gi, // Titles
    /\b(ret|retired)\b/gi, // Military context
    /\b(jr\.?|sr\.?|iii|iv|v)\b/gi // Suffixes
  ];
  
  // Remove all patterns from the name
  let sanitized = name;
  patternsToRemove.forEach(pattern => {
    sanitized = sanitized.replace(pattern, "");
  });
  
  // Trim extra spaces and return
  return sanitized.replace(/\s+/g, " ").trim();
}

// Extract first and last names from sanitized full name
function extractFirstName(name) {
  return name.split(" ")[0] || "";
}

function extractLastName(name) {
  const parts = name.split(" ");
  return parts.slice(1).join(" ") || "";
}

 // Helper function to format skills
function formatSkills(skillsArray) {
    if (!skillsArray || skillsArray.length === 0) return "";
    return skillsArray
        .map(skill => `${skill.name} : ${skill.level || "null"}`)
        .join(", ");

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
    
  organization_1: jsonData.work?.[0]?.name || "",
  organization_title_1: jsonData.work?.[0]?.position || "",
  organization_start_1: jsonData.work?.[0]?.startDate || "",
  organization_end_1: jsonData.work?.[0]?.endDate || "",
  organization_location_1: jsonData.work?.[0]?.location || "",
  position_description_1: jsonData.work?.[0]?.summary || "",
    
  organization_1: jsonData.work?.[0]?.name || "",
  organization_title_1: jsonData.work?.[0]?.position || "",
  organization_start_1: jsonData.work?.[0]?.startDate || "",
  organization_end_1: jsonData.work?.[0]?.endDate || "",
  organization_location_1: jsonData.work?.[0]?.location || "",
  position_description_1: jsonData.work?.[0]?.summary || "",

  organization_2: jsonData.work?.[1]?.name || "",
  organization_title_2: jsonData.work?.[1]?.position || "",
  organization_start_2: jsonData.work?.[1]?.startDate || "",
  organization_end_2: jsonData.work?.[1]?.endDate || "",
  organization_location_2: jsonData.work?.[1]?.location || "",
  position_description_2: jsonData.work?.[1]?.summary || "",

  organization_3: jsonData.work?.[2]?.name || "",
  organization_title_3: jsonData.work?.[2]?.position || "",
  organization_start_3: jsonData.work?.[2]?.startDate || "",
  organization_end_3: jsonData.work?.[2]?.endDate || "",
  organization_location_3: jsonData.work?.[2]?.location || "",
  position_description_3: jsonData.work?.[2]?.summary || "",

  organization_4: jsonData.work?.[3]?.name || "",
  organization_title_4: jsonData.work?.[3]?.position || "",
  organization_start_4: jsonData.work?.[3]?.startDate || "",
  organization_end_4: jsonData.work?.[3]?.endDate || "",
  organization_location_4: jsonData.work?.[3]?.location || "",
  position_description_4: jsonData.work?.[3]?.summary || "",

  organization_5: jsonData.work?.[4]?.name || "",
  organization_title_5: jsonData.work?.[4]?.position || "",
  organization_start_5: jsonData.work?.[4]?.startDate || "",
  organization_end_5: jsonData.work?.[4]?.endDate || "",
  organization_location_5: jsonData.work?.[4]?.location || "",
  position_description_5: jsonData.work?.[4]?.summary || "",

  organization_6: jsonData.work?.[5]?.name || "",
  organization_title_6: jsonData.work?.[5]?.position || "",
  organization_start_6: jsonData.work?.[5]?.startDate || "",
  organization_end_6: jsonData.work?.[5]?.endDate || "",
  organization_location_6: jsonData.work?.[5]?.location || "",
  position_description_6: jsonData.work?.[5]?.summary || "",

  organization_7: jsonData.work?.[6]?.name || "",
  organization_title_7: jsonData.work?.[6]?.position || "",
  organization_start_7: jsonData.work?.[6]?.startDate || "",
  organization_end_7: jsonData.work?.[6]?.endDate || "",
  organization_location_7: jsonData.work?.[6]?.location || "",
  position_description_7: jsonData.work?.[6]?.summary || "",

  organization_8: jsonData.work?.[7]?.name || "",
  organization_title_8: jsonData.work?.[7]?.position || "",
  organization_start_8: jsonData.work?.[7]?.startDate || "",
  organization_end_8: jsonData.work?.[7]?.endDate || "",
  organization_location_8: jsonData.work?.[7]?.location || "",
  position_description_8: jsonData.work?.[7]?.summary || "",

  organization_9: jsonData.work?.[8]?.name || "",
  organization_title_9: jsonData.work?.[8]?.position || "",
  organization_start_9: jsonData.work?.[8]?.startDate || "",
  organization_end_9: jsonData.work?.[8]?.endDate || "",
  organization_location_9: jsonData.work?.[8]?.location || "",
  position_description_9: jsonData.work?.[8]?.summary || "",

  organization_10: jsonData.work?.[9]?.name || "",
  organization_title_10: jsonData.work?.[9]?.position || "",
  organization_start_10: jsonData.work?.[9]?.startDate || "",
  organization_end_10: jsonData.work?.[9]?.endDate || "",
  organization_location_10: jsonData.work?.[9]?.location || "",
  position_description_10: jsonData.work?.[9]?.summary || "",

  education_1: jsonData.education?.[0]?.institution || "",
  education_degree_1: jsonData.education?.[0]?.studyType || "",
  education_fos_1: jsonData.education?.[0]?.area || "",
  education_start_1: jsonData.education?.[0]?.startDate || "",
  education_end_1: jsonData.education?.[0]?.endDate || "",

  education_2: jsonData.education?.[1]?.institution || "",
  education_degree_2: jsonData.education?.[1]?.studyType || "",
  education_fos_2: jsonData.education?.[1]?.area || "",
  education_start_2: jsonData.education?.[1]?.startDate || "",
  education_end_2: jsonData.education?.[1]?.endDate || "",

  education_3: jsonData.education?.[2]?.institution || "",
  education_degree_3: jsonData.education?.[2]?.studyType || "",
  education_fos_3: jsonData.education?.[2]?.area || "",
  education_start_3: jsonData.education?.[2]?.startDate || "",
  education_end_3: jsonData.education?.[2]?.endDate || "",

  language_1: jsonData.languages?.[0]?.language || "",
  language_proficiency_1: jsonData.languages?.[0]?.fluency || "",

  language_2: jsonData.languages?.[1]?.language || "",
  language_proficiency_2: jsonData.languages?.[1]?.fluency || "",

  language_3: jsonData.languages?.[2]?.language || "",
  language_proficiency_3: jsonData.languages?.[2]?.fluency || "",

  skills: formatSkills(jsonData.skills || [])  
};

    // Push mapped data in order
    rows.push(columns.map(col => csvRow[col] || "").join(","));

    // Return the final CSV string
    return [columns.join(","), ...rows].join("\n");
}

// Example usage:
const jsonData = {
    "basics": {
        "name": "Orlando Gonzalez",
        "location": { "address": "United States" },
        "profiles": [{ "url": "https://www.linkedin.com/in/orlando-gonzalez-03276917/" }]
    },
    "work": [
        {
            "name": "Resource Management Concepts, Inc.",
            "position": "Information Assurance Analyst",
            "startDate": "2023-11-30",
            "endDate": ""
        }
    ],
    "education": [
        {
            "institution": "ITT Technical Institute-San Bernardino",
            "studyType": "Bachelor's degree",
            "area": "Information Systems Security",
            "startDate": "2004-12-31",
            "endDate": "2007-12-31"
        }
    ]
};

console.log(mapJsonToCsv(jsonData));
