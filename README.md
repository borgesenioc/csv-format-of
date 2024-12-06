# LinkedIn JSON to CSV Converter

A simple web app that converts JSON data extracted from LinkedIn into a predefined CSV format. This tool makes it easy to process and analyze LinkedIn data by transforming it into a structured CSV file.

## Features

- **JSON Input**: Allows users to paste JSON data into an input box.
- **Validation**: Ensures the JSON structure is correct and matches the predefined schema.
- **CSV Output**: Converts JSON data into a downloadable CSV file.
- **Preview**: Displays the generated CSV file in a preview area to ensure proper mapping.

## Prerequisites

This tool relies on the **JSON Resume Exporter** Chrome extension to extract LinkedIn data. Follow these steps to set it up:

1. Install the extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/json-resume-exporter/caobgmmcpklomkcckaenhjlokpmfbdec).
2. Enable the extension and use it to export JSON data from LinkedIn profiles.
3. Copy the extracted JSON and paste it into the app's input box.

## Live Demo

The app is deployed on Vercel and accessible here: [LinkedIn JSON to CSV Converter](https://<your-project-name>.vercel.app).

## Predefined CSV Structure

The generated CSV will include the following columns:
- `id`
- `public_id`
- `profile_url`
- `email`
- `full_name`
- `first_name`
- `last_name`
- `headline`
- `location_name`
- `organization_1`
- `organization_title_1`
- `organization_start_1`
- `organization_end_1`
- `organization_location_1`
- `position_description_1`
- `education_1`
- `education_degree_1`
- `education_fos_1`
- `education_start_1`
- `education_end_1`
- `language_1`
- `language_proficiency_1`
- `skills`
- And more (refer to `columns` in the source code for the complete list).

## Workflow

1. **Extract JSON from LinkedIn**:
   - Use the JSON Resume Exporter extension to export data from LinkedIn profiles.
   - Copy the exported JSON.

2. **Convert JSON to CSV**:
   - Paste the JSON into the app: [LinkedIn JSON to CSV Converter](https://<your-project-name>.vercel.app).
   - Click **Convert to CSV** to generate the CSV file.
   - Click **Download CSV** to save the file to your device.

3. **Upload CSV to OnFrontiers**:
   - Go to the [OnFrontiers Profile Uploader](https://app.onfrontiers.com/profile-uploader).
   - Import the CSV file and merge it with the registered expert profile.

4. **Add a Profile Picture** (optional):
   - Visit the LinkedIn profile, right-click on the profile picture, and copy the image address.
   - In OnFrontiers, navigate to the expert's profile and click **Upload Photo**.
   - Select **Link (URL)**, paste the copied image address, and click **Save**.

## Local Development

To run the app locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   Install dependencies (if applicable):

bash
Copy code
npm install
Run a local development server:

bash
Copy code
npm run dev
Open your browser and navigate to:

arduino
Copy code
http://localhost:3000
Deployment
This project is deployed on Vercel. To deploy it yourself:

Link your GitHub repository to Vercel by signing in at Vercel.
Add your repository and select the correct settings (default settings should work).
Deploy the main branch.
Once deployed, you can access your app at a URL like https://<your-project-name>.vercel.app.
Project Structure
index.html: The main HTML file for the app's structure.
script.js: JavaScript file for handling JSON parsing and CSV generation.
style.css: CSS file for styling the app.
Contributing
We welcome contributions! If you'd like to improve the project, follow these steps:

Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature/<feature-name>
Commit your changes and push them:
bash
Copy code
git commit -m "Add <feature-description>"
git push origin feature/<feature-name>
Submit a pull request.
Issues
If you encounter any issues or have feature requests, please create an issue in this repository.

License
This project is open source and available under the MIT License.

Enjoy converting your LinkedIn JSON data effortlessly!

javascript
Copy code

Replace `<your-project-name>` and `<your-username>` with your actual project and GitHub details.




