import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    DARK_BG = RGBColor(15, 23, 42)      # #0F172A
    CYAN = RGBColor(56, 189, 248)       # #38BDF8
    VIOLET = RGBColor(168, 85, 247)     # #A855F7
    EMERALD = RGBColor(16, 185, 129)    # #10B981
    WHITE = RGBColor(248, 250, 252)     # #F8FAFC
    GRAY = RGBColor(148, 163, 184)      # #94A3B8
    CARD_BG = RGBColor(30, 41, 59)      # #1E293B

    def set_slide_background(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = DARK_BG

    def add_header(slide, tag_text, title_text):
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11), Inches(0.35))
        tf_tag = tag_box.text_frame
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = CYAN

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.75))
        tf_title = title_box.text_frame
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE

    def create_bullet_slide(tag, title, bullet_points):
        slide = prs.slides.add_slide(blank_layout)
        set_slide_background(slide)
        add_header(slide, tag, title)

        box = slide.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(5.2))
        tf = box.text_frame
        tf.word_wrap = True

        for i, pt in enumerate(bullet_points):
            p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
            p.text = "•  " + pt
            p.font.size = Pt(17)
            p.font.color.rgb = WHITE
            p.space_after = Pt(16)
        return slide

    # ----------------------------------------------------
    # Slide 1: Title Slide (AZ-204 Report)
    # ----------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1)

    tb1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.33), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p0 = tf1.paragraphs[0]
    p0.text = "MICROSOFT AZURE"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = CYAN

    p1 = tf1.add_paragraph()
    p1.text = "AZ-204: Developing Solutions for Microsoft Azure"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_before = Pt(8)

    p2 = tf1.add_paragraph()
    p2.text = "Industrial Cloud & DevOps Training Report"
    p2.font.size = Pt(22)
    p2.font.color.rgb = GRAY
    p2.space_before = Pt(8)

    tb_card = slide1.shapes.add_textbox(Inches(1.0), Inches(4.5), Inches(11.33), Inches(2.2))
    tf_card = tb_card.text_frame
    tf_card.word_wrap = True

    p_card1 = tf_card.paragraphs[0]
    p_card1.text = "Candidate Name: Nehul Singh Negi  |  Roll No: 23EACCS809"
    p_card1.font.size = Pt(18)
    p_card1.font.bold = True
    p_card1.font.color.rgb = CYAN

    p_card2 = tf_card.add_paragraph()
    p_card2.text = "Organization: GRRAS Solutions Pvt. Ltd.  |  Duration: 45 Days (Industrial Cloud Training)"
    p_card2.font.size = Pt(16)
    p_card2.font.color.rgb = WHITE
    p_card2.space_before = Pt(8)

    # ----------------------------------------------------
    # Slide 2: About the Organization (GRRAS Solutions)
    # ----------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "ORGANIZATION", "About the Organization: GRRAS Solutions Pvt. Ltd.")

    box2_left = slide2.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(6.5), Inches(5.2))
    tf2_left = box2_left.text_frame
    tf2_left.word_wrap = True

    p_g1 = tf2_left.paragraphs[0]
    p_g1.text = "GRRAS Solutions Pvt. Ltd. is a Jaipur-based IT training and skill development institute focused on emerging technologies such as Cloud Computing, DevOps, Cybersecurity, Data Science, and Full-Stack Development."
    p_g1.font.size = Pt(17)
    p_g1.font.color.rgb = WHITE
    p_g1.space_after = Pt(14)

    p_g2 = tf2_left.add_paragraph()
    p_g2.text = "The organization delivers structured, hands-on, assessment-driven training programs for students and working professionals in partnership with academic institutions."
    p_g2.font.size = Pt(16)
    p_g2.font.color.rgb = GRAY
    p_g2.space_after = Pt(14)

    p_g3 = tf2_left.add_paragraph()
    p_g3.text = "Training is delivered through real-world assignments, cloud labs, and mentor-reviewed assessments—the model followed throughout this 45-day program."
    p_g3.font.size = Pt(16)
    p_g3.font.color.rgb = WHITE

    box2_right = slide2.shapes.add_textbox(Inches(7.7), Inches(1.6), Inches(4.8), Inches(5.2))
    tf2_right = box2_right.text_frame
    tf2_right.word_wrap = True

    stats = [
        ("4", "Hands-on Lab Assessments Completed"),
        ("45 Days", "Total Training Duration"),
        ("10+", "Azure Services & Tools Used")
    ]
    for val, lbl in stats:
        p_val = tf2_right.add_paragraph()
        p_val.text = val
        p_val.font.size = Pt(32)
        p_val.font.bold = True
        p_val.font.color.rgb = CYAN
        
        p_lbl = tf2_right.add_paragraph()
        p_lbl.text = lbl
        p_lbl.font.size = Pt(14)
        p_lbl.font.color.rgb = GRAY
        p_lbl.space_after = Pt(18)

    # ----------------------------------------------------
    # Slide 3: Training Domain & Duration (Timeline)
    # ----------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "COURSE STRUCTURE", "Training Domain & Duration")

    box3_l = slide3.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.5), Inches(5.2))
    tf3_l = box3_l.text_frame
    tf3_l.word_wrap = True

    p3_1 = tf3_l.paragraphs[0]
    p3_1.text = "Course: AZ-204 Developing Solutions for Microsoft Azure"
    p3_1.font.size = Pt(18)
    p3_1.font.bold = True
    p3_1.font.color.rgb = CYAN
    p3_1.space_after = Pt(14)

    p3_details = [
        "Format: Hands-on lab assessments, mentor-reviewed",
        "Duration: 45 Days Intensive Cloud & DevOps Program",
        "Delivery Tools: Azure Portal, VS Code, Postman, Azure CLI",
        "Focus Areas: Compute, Storage, Security, Monitoring, DevOps"
    ]
    for d in p3_details:
        p_d = tf3_l.add_paragraph()
        p_d.text = "• " + d
        p_d.font.size = Pt(16)
        p_d.font.color.rgb = WHITE
        p_d.space_after = Pt(12)

    box3_r = slide3.shapes.add_textbox(Inches(6.6), Inches(1.6), Inches(5.9), Inches(5.2))
    tf3_r = box3_r.text_frame
    tf3_r.word_wrap = True

    p3_hdr = tf3_r.paragraphs[0]
    p3_hdr.text = "Assessment Timeline Cadence:"
    p3_hdr.font.size = Pt(18)
    p3_hdr.font.bold = True
    p3_hdr.font.color.rgb = VIOLET
    p3_hdr.space_after = Pt(12)

    timeline = [
        ("16 June", "Project 1: Azure Web App + Function App (HTTP Trigger)"),
        ("22 June", "Project 2: Full-Stack CV Vault (Express, Mongo, Blob, Key Vault)"),
        ("26 June", "Project 3: Dockerize Express App & Deploy to Container Apps"),
        ("1 July", "Project 4: Azure AD App Registration, OAuth2 & DevOps Service Connection")
    ]
    for dt, desc in timeline:
        p_t = tf3_r.add_paragraph()
        p_t.text = f"📅 {dt} — {desc}"
        p_t.font.size = Pt(15)
        p_t.font.color.rgb = WHITE
        p_t.space_after = Pt(12)

    # ----------------------------------------------------
    # Slide 4: Technologies & Tools Learned (Card Grid Layout)
    # ----------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "TECH STACK & TOOLING", "Technologies & Tools Learned During Training")

    tools_grid = [
        ("⚡ Azure Compute", "Azure App Service (Linux Web Apps), Azure Functions (HTTP Serverless), Azure Container Apps"),
        ("🐳 Containers & Registry", "Docker Engine Containerization, Azure Container Registry (ACR) Image Hosting"),
        ("🗄️ Storage & Databases", "Azure Blob Storage (CV Binary Files), Cosmos DB & MongoDB Atlas (NoSQL Metadata Layer)"),
        ("🔐 Security & Identity", "Microsoft Entra ID (Azure AD App Registration & OAuth2), Azure Key Vault & Managed Identity"),
        ("🚀 DevOps & Observability", "Azure DevOps (Service Connections, CI/CD Automation), Application Insights (Logging & Telemetry)"),
        ("🛠️ CLI & API Testing", "Azure CLI, PowerShell Scripting & Automation, Postman API Testing Suite")
    ]

    # Render as 2 columns x 3 rows grid
    col_width = Inches(5.6)
    row_height = Inches(1.5)
    start_lefts = [Inches(0.8), Inches(6.8)]
    start_tops = [Inches(1.6), Inches(3.3), Inches(5.0)]

    for idx, (title, desc) in enumerate(tools_grid):
        col_idx = idx % 2
        row_idx = idx // 2

        l = start_lefts[col_idx]
        t = start_tops[row_idx]

        tb_tool = slide4.shapes.add_textbox(l, t, col_width, row_height)
        tf_tool = tb_tool.text_frame
        tf_tool.word_wrap = True

        p_tt = tf_tool.paragraphs[0]
        p_tt.text = title
        p_tt.font.size = Pt(17)
        p_tt.font.bold = True
        p_tt.font.color.rgb = CYAN

        p_td = tf_tool.add_paragraph()
        p_td.text = desc
        p_td.font.size = Pt(14)
        p_td.font.color.rgb = WHITE
        p_td.space_before = Pt(4)

    # ----------------------------------------------------
    # Slide 5: Project Methodology
    # ----------------------------------------------------
    create_bullet_slide(
        "METHODOLOGY",
        "Project Methodology: Plan → Build → Containerize → Secure → Deploy → Monitor",
        [
            "Step 1 (Plan): Define endpoints & Azure resources needed for each lab assessment.",
            "Step 2 (Build): Develop Express.js REST APIs and Azure Functions locally.",
            "Step 3 (Containerize): Write multi-stage Dockerfile and validate with local Docker runs.",
            "Step 4 (Secure): Store secrets in Azure Key Vault & configure Managed Identity and RBAC roles.",
            "Step 5 (Deploy): Push Docker images to ACR and deploy to Azure Web App / Container Apps.",
            "Step 6 (Monitor): Verify telemetry with Application Insights & validate HTTP status with Postman."
        ]
    )

    # ----------------------------------------------------
    # Slide 6: Project 1: Web App & Serverless Function (16 June)
    # ----------------------------------------------------
    create_bullet_slide(
        "ASSESSMENT 1 — 16 JUNE",
        "Project 1: Azure Web App & Serverless Function App",
        [
            "Problem Statement: Provision a basic Azure Web App and a Function App with an HTTP-triggered endpoint to understand core Azure App Service and Functions fundamentals.",
            "Approach: Created Linux-based Azure Web App deployed via GitHub CI/CD, created Function App (Windows, JS runtime) with HttpTriggerFunc.",
            "Function Logic: Function reads query/body parameters and returns personalized response.",
            "Live Outcome: 'demo-webapp-12345' served 'Hello from Azure CI/CD' live, and 'nehul-funcapp3' returned 'Hello Nehul! Azure Function with HTTP Trigger is working perfectly.'"
        ]
    )

    # ----------------------------------------------------
    # Slide 7: Project 2: CV Vault Backend Architecture (22 June)
    # ----------------------------------------------------
    create_bullet_slide(
        "ASSESSMENT 2 — 22 JUNE",
        "Project 2: CV Vault Full-Stack Architecture",
        [
            "Problem Statement: Build a secure Express.js API with signup/login (JWT), CV upload/download via Blob Storage, MongoDB-backed persistence, centralized secrets, and full observability.",
            "Express API: Endpoint routing for /auth/signup, /auth/login, /cv/upload, /cv/download.",
            "Data Persistence: MongoDB Atlas for user & candidate metadata storage.",
            "Blob Storage: `@azure/storage-blob` SDK for storing CV file streams in Azure container.",
            "Security & Monitoring: Azure Key Vault + Managed Identity for zero-hardcoded secrets, Application Insights for live telemetry tracking."
        ]
    )

    # ----------------------------------------------------
    # Slide 8: Project 2: API Testing & Validation (Postman Table)
    # ----------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_header(slide8, "API VALIDATION", "Project 2: Postman End-to-End API Testing & Results")

    box8 = slide8.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(5.2))
    tf8 = box8.text_frame
    tf8.word_wrap = True

    api_tests = [
        ("POST /api/auth/signup", "201 Created", "New candidate user created in MongoDB Atlas"),
        ("POST /api/auth/login", "200 OK", "JWT Bearer access token successfully issued"),
        ("POST /api/auth/login (wrong pwd)", "401 Unauthorized", "'Invalid credentials' correctly returned"),
        ("POST /api/cv/upload", "200 OK", "File stream stored in Blob Storage, JWT-secured"),
        ("GET /api/cv/download", "200 OK", "File stream retrieved directly from Blob Storage")
    ]
    
    for ep, st, res in api_tests:
        p_ep = tf8.add_paragraph()
        p_ep.text = f"•  {ep}  --->  [{st}]"
        p_ep.font.size = Pt(17)
        p_ep.font.bold = True
        p_ep.font.color.rgb = CYAN if "200" in st or "201" in st else VIOLET

        p_res = tf8.add_paragraph()
        p_res.text = f"   Result: {res}"
        p_res.font.size = Pt(15)
        p_res.font.color.rgb = WHITE
        p_res.space_after = Pt(12)

    p_tele = tf8.add_paragraph()
    p_tele.text = "📊 Telemetry Result: Application Insights logged 319 telemetry events (dependencies, requests, traces & exceptions) during testing."
    p_tele.font.size = Pt(15)
    p_tele.font.bold = True
    p_tele.font.color.rgb = EMERALD

    # ----------------------------------------------------
    # Slide 9: Project 3: Containerization & Deployment (26 June)
    # ----------------------------------------------------
    create_bullet_slide(
        "ASSESSMENT 3 — 26 JUNE",
        "Project 3: Docker Containerization & Azure Container Apps Deployment",
        [
            "Problem Statement: Package an Express.js app into a Docker image, validate locally, then deploy to Azure Container Apps via Azure Container Registry (ACR).",
            "Steps Followed: Wrote Dockerfile (node:20-alpine, EXPOSE 3000), built and tested image locally ('Hello Azure!').",
            "ACR & CLI: Created Azure Container Registry, tagged image `express-app:latest`, logged in via Azure CLI.",
            "Container App Deployment: Deployed using `az containerapp up` with ingress enabled on port 5000.",
            "Live Outcome: Publicly reachable HTTPS URL live at `express-app.ashystone-41b510ab.centralindia.azurecontainerapps.io` returning 'Hello Azure!'."
        ]
    )

    # ----------------------------------------------------
    # Slide 10: Project 4: Identity, OAuth2 & DevOps Integration (1 July)
    # ----------------------------------------------------
    create_bullet_slide(
        "ASSESSMENT 4 — 1 JULY",
        "Project 4: Azure AD App Registration, OAuth2 & DevOps Integration",
        [
            "Azure AD App Registration: Registered Service Principal 'devops-sp' in Microsoft Entra ID with client secret 'devops-connection-secret'.",
            "OAuth2 Token Generation: Requested access token via Client Credentials Flow against /oauth2/v2.0/token endpoint -> received valid Bearer Token (200 OK in Postman).",
            "Subscription IAM Access: Assigned Contributor role to 'devops-sp' under Subscription Access Control (IAM).",
            "Azure DevOps Service Connection: Configured Azure Resource Manager service connection 'devops-sc' in Azure DevOps for CI/CD pipeline automation."
        ]
    )

    # ----------------------------------------------------
    # Slide 11: Security & Access Governance
    # ----------------------------------------------------
    create_bullet_slide(
        "SECURITY GOVERNANCE",
        "Security & Access Governance Across All Assessments",
        [
            "Key Vault Access Policies: Role assignments split into Owner, Key Vault Secrets Officer, and Secrets User—enforcing least privilege via Managed Identity.",
            "Subscription-Level RBAC: Owner and Contributor roles reviewed via IAM; dedicated service principal used for DevOps automation instead of personal passwords.",
            "No Hardcoded Secrets in Code: Mongo URI, JWT secrets, and Azure Blob storage connection strings loaded from Key Vault at runtime.",
            "JWT-Based API Security: Upload and download endpoints protected with Bearer token validation, tested for both valid and invalid credentials."
        ]
    )

    # ----------------------------------------------------
    # Slide 12: Outcomes Achieved (Measured Metrics Grid)
    # ----------------------------------------------------
    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide12)
    add_header(slide12, "MEASURED RESULTS", "Outcomes Achieved Across 45-Day Training")

    box12 = slide12.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(5.2))
    tf12 = box12.text_frame
    tf12.word_wrap = True

    metrics = [
        ("4 Assessments", "Completed end-to-end (Web App, CV Vault, Container Apps, Service Connection)"),
        ("10+ Azure Services", "Integrated (App Service, Functions, Blob, Key Vault, Entra ID, ACR, Container Apps, DevOps, App Insights)"),
        ("2 Deployment Targets", "Azure Web App & Serverless Azure Container Apps"),
        ("319 Telemetry Events", "Captured & verified live via Azure Application Insights"),
        ("100% Secured APIs", "Protected with JWT Bearer Auth + Azure Key Vault Managed Identity secrets"),
        ("1 OAuth2 Flow", "Service-to-service client credentials token authentication validated")
    ]
    for m_title, m_desc in metrics:
        p_m = tf12.add_paragraph()
        p_m.text = f"✔ {m_title}: {m_desc}"
        p_m.font.size = Pt(16)
        p_m.font.color.rgb = WHITE
        p_m.space_after = Pt(14)

    # ----------------------------------------------------
    # Slide 13: Learning Outcomes & Personal Reflection
    # ----------------------------------------------------
    slide13 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide13)
    add_header(slide13, "REFLECTIONS", "Learning Outcomes & Personal Experience")

    box13_l = slide13.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.8), Inches(5.2))
    tf13_l = box13_l.text_frame
    tf13_l.word_wrap = True

    p13_h = tf13_l.paragraphs[0]
    p13_h.text = "Key Skills Gained:"
    p13_h.font.size = Pt(18)
    p13_h.font.bold = True
    p13_h.font.color.rgb = CYAN
    p13_h.space_after = Pt(10)

    skills = [
        "Provisioning Azure App Service, Functions & Container Apps",
        "Designing secure backend APIs with JWT & Key Vault Managed Identity",
        "Containerizing Node.js applications with Docker & pushing to ACR",
        "Working with Microsoft Entra ID app registrations & OAuth2 flows",
        "Setting up Azure DevOps service connections for pipeline automation",
        "Using Application Insights for telemetry & troubleshooting"
    ]
    for s in skills:
        p_s = tf13_l.add_paragraph()
        p_s.text = "• " + s
        p_s.font.size = Pt(14)
        p_s.font.color.rgb = WHITE
        p_s.space_after = Pt(8)

    box13_r = slide13.shapes.add_textbox(Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2))
    tf13_r = box13_r.text_frame
    tf13_r.word_wrap = True

    p13_rh = tf13_r.paragraphs[0]
    p13_rh.text = "Personal Reflection:"
    p13_rh.font.size = Pt(18)
    p13_rh.font.bold = True
    p13_rh.font.color.rgb = VIOLET
    p13_rh.space_after = Pt(10)

    p13_rf = tf13_r.add_paragraph()
    p13_rf.text = "This 45-day training moved me from writing basic Express apps to confidently designing and deploying production-style, secure cloud solutions on Azure.\n\nDebugging real issues—CLI path errors, Docker port conflicts, IAM permissions—built practical problem-solving skills that go far beyond following a checklist.\n\nI am now comfortable reasoning about end-to-end architecture: compute, storage, identity, and observability working together seamlessly."
    p13_rf.font.size = Pt(14)
    p13_rf.font.color.rgb = WHITE

    # ----------------------------------------------------
    # Slide 14: GitHub Repository Code Verification
    # ----------------------------------------------------
    slide14 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide14)
    add_header(slide14, "CODE PROOF", "GitHub Repository & Code Verification")

    box14 = slide14.shapes.add_textbox(Inches(1.5), Inches(2.2), Inches(10.33), Inches(4.0))
    tf14 = box14.text_frame
    tf14.word_wrap = True

    p14_1 = tf14.paragraphs[0]
    p14_1.text = "GitHub Repository: cv-vault"
    p14_1.font.size = Pt(28)
    p14_1.font.bold = True
    p14_1.font.color.rgb = CYAN
    p14_1.alignment = PP_ALIGN.CENTER

    p14_2 = tf14.add_paragraph()
    p14_2.text = "Project code uploaded, version-controlled with Git commits, Dockerfile, and README documentation."
    p14_2.font.size = Pt(18)
    p14_2.font.color.rgb = WHITE
    p14_2.alignment = PP_ALIGN.CENTER
    p14_2.space_before = Pt(14)

    p14_3 = tf14.add_paragraph()
    p14_3.text = "https://github.com/RahulSharma/cv-vault"
    p14_3.font.size = Pt(20)
    p14_3.font.bold = True
    p14_3.font.color.rgb = EMERALD
    p14_3.alignment = PP_ALIGN.CENTER
    p14_3.space_before = Pt(16)

    p14_4 = tf14.add_paragraph()
    p14_4.text = "Thank You! | Open for Questions & Answers"
    p14_4.font.size = Pt(26)
    p14_4.font.bold = True
    p14_4.font.color.rgb = WHITE
    p14_4.alignment = PP_ALIGN.CENTER
    p14_4.space_before = Pt(30)

    output_path = os.path.join(os.getcwd(), "CV_Vault_Industrial_Training_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
