
function mapJsonToCsv(jsonData) {
    // Define the column names in the required order
    const columns = [
  "id", "id_type", "public_id", "public_id_actual_at", "member_id", "member_id_actual_at", 
  "hash_id", "sn_member_id", "sn_hash_id", "r_member_id", "t_hash_id", "avatar_id", 
  "public_id_2", "lh_id", "profile_url", "email", "email_type", "full_name", "first_name", 
  "last_name", "original_first_name", "original_last_name", "custom_first_name", 
  "custom_last_name", "avatar", "headline", "mini_profile_actual_at", "location_name", 
  "industry", "industry_actual_at", "summary", "address", "birthday", "badges_premium", 
  "badges_influencer", "badges_job_seeker", "badges_open_link", "badges_hiring", 
  "current_company", "current_company_custom", "current_company_position", 
  "current_company_custom_position", "current_company_actual_at", 
  "current_company_industry", "organization_1", "organization_id_1", "organization_url_1", 
  "organization_title_1", "organization_start_1", "organization_end_1", 
  "organization_description_1", "organization_location_1", "organization_website_1", 
  "organization_domain_1", "position_description_1", "organization_2", "organization_id_2", 
  "organization_url_2", "organization_title_2", "organization_start_2", 
  "organization_end_2", "organization_description_2", "organization_location_2", 
  "organization_website_2", "organization_domain_2", "position_description_2", 
  "organization_3", "organization_id_3", "organization_url_3", "organization_title_3", 
  "organization_start_3", "organization_end_3", "organization_description_3", 
  "organization_location_3", "organization_website_3", "organization_domain_3", 
  "position_description_3", "organization_4", "organization_id_4", "organization_url_4", 
  "organization_title_4", "organization_start_4", "organization_end_4", 
  "organization_description_4", "organization_location_4", "organization_website_4", 
  "organization_domain_4", "position_description_4", "organization_5", "organization_id_5", 
  "organization_url_5", "organization_title_5", "organization_start_5", 
  "organization_end_5", "organization_description_5", "organization_location_5", 
  "organization_website_5", "organization_domain_5", "position_description_5", 
  "organization_6", "organization_id_6", "organization_url_6", "organization_title_6", 
  "organization_start_6", "organization_end_6", "organization_description_6", 
  "organization_location_6", "organization_website_6", "organization_domain_6", 
  "position_description_6", "organization_7", "organization_id_7", "organization_url_7", 
  "organization_title_7", "organization_start_7", "organization_end_7", 
  "organization_description_7", "organization_location_7", "organization_website_7", 
  "organization_domain_7", "position_description_7", "organization_8", 
  "organization_id_8", "organization_url_8", "organization_title_8", "organization_start_8", 
  "organization_end_8", "organization_description_8", "organization_location_8", 
  "organization_website_8", "organization_domain_8", "position_description_8", 
  "organization_9", "organization_id_9", "organization_url_9", "organization_title_9", 
  "organization_start_9", "organization_end_9", "organization_description_9", 
  "organization_location_9", "organization_website_9", "organization_domain_9", 
  "position_description_9", "organization_10", "organization_id_10", "organization_url_10", 
  "organization_title_10", "organization_start_10", "organization_end_10", 
  "organization_description_10", "organization_location_10", "organization_website_10", 
  "organization_domain_10", "position_description_10", "education_1", 
  "education_degree_1", "education_fos_1", "education_start_1", "education_end_1", 
  "education_description_1", "education_2", "education_degree_2", "education_fos_2", 
  "education_start_2", "education_end_2", "education_description_2", "education_3", 
  "education_degree_3", "education_fos_3", "education_start_3", "education_end_3", 
  "education_description_3", "language_1", "language_proficiency_1", "language_2", 
  "language_proficiency_2", "language_3", "language_proficiency_3", "languages", "skills"
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

// Construct the csvRow
const csvRow = {
  id: jsonData.basics?.profiles?.[0]?.username || "",
  public_id: jsonData.basics?.profiles?.[0]?.username || "",
  profile_url: jsonData.basics?.profiles?.[0]?.url || "",
  email: jsonData.basics?.email || "",
  full_name: sanitizeName(jsonData.basics?.name || ""),
  first_name: extractFirstName(sanitizeName(jsonData.basics?.name || "")),
  last_name: extractLastName(sanitizeName(jsonData.basics?.name || "")),
  avatar: jsonData.basics?.image || ""
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
