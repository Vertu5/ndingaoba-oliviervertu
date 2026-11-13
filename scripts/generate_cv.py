#!/usr/bin/env python3
"""
Generate bilingual 2-page A4 PDF resumes (EN & FR) for Ir. Olivier NDINGA OBA
using WeasyPrint and QRCode, writing directly to public/CV_Olivier_NDINGA_OBA_EN.pdf
and public/CV_Olivier_NDINGA_OBA_FR.pdf.
"""
import io
from pathlib import Path
import qrcode
import qrcode.image.svg
from weasyprint import HTML

ROOT_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT_DIR / "public"

LINKEDIN = "https://www.linkedin.com/in/olivier-ndinga-oba-1510101b7/"
GITHUB = "https://github.com/Vertu5"
WEBSITE = "https://ndingaoba-oliviervertu.vercel.app/"

LI_SVG = '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.85 1.637-1.71 3.37-1.71 3.601 0 4.267 2.37 4.267 4.892v6.31zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
GH_SVG = '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="#111" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
WEB_SVG = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#3D85D1" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.2" ry="10"/><path d="M2 12h20M4 6.5h16M4 17.5h16"/></svg>'

_qr = qrcode.make(WEBSITE, image_factory=qrcode.image.svg.SvgPathImage, border=0, box_size=10)
_buf = io.BytesIO()
_qr.save(_buf)
QR_SVG = _buf.getvalue().decode().split("?>", 1)[-1]

CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 8.5pt; color: #3A3F47; line-height: 1.45; }
.page { width: 210mm; height: 296mm; position: relative; padding: 10mm 11mm 8mm; page-break-after: always; overflow: hidden; }
.page:last-child { page-break-after: auto; }

/* header */
.qr { position: absolute; top: 12mm; left: 14mm; width: 17mm; text-align: center; }
.qr a { display: block; text-decoration: none; }
.qr svg { width: 17mm; height: 17mm; display: block; }
.qr span { display: block; font-size: 6.2pt; color: #5A6069; margin-top: 1mm; letter-spacing: .3px; }
.corner { position: absolute; top: 9mm; left: 11mm; width: 26mm; height: 22mm;
          border-top: 1.6px solid #9AA3AE; border-left: 1.6px solid #9AA3AE; }
.corner::after { content: ""; position: absolute; top: -1.6px; left: 30mm; width: 16mm; border-top: 1.6px solid #9AA3AE; }
.name { text-align: right; font-size: 25pt; letter-spacing: 2px; color: #555B63; font-weight: 300; margin-top: 2mm; }
.name b { font-weight: 800; color: #111; letter-spacing: 3px; }
.name-rule { width: 36mm; border-top: 1.6px solid #9AA3AE; margin: 2mm 0 0 auto; }
.title { text-align: center; font-size: 15pt; letter-spacing: 2px; color: #222; margin: 2mm 0 2mm; }
.links { display: flex; justify-content: center; gap: 16mm; font-size: 9.6pt; margin-bottom: 3mm; }
.links a { color: #1F2933; text-decoration: none; border-bottom: 1px solid #B9C3CE; }
.links .lk { white-space: nowrap; }
.links svg { vertical-align: -2px; margin-right: 5px; }
.band { background: #3D85D1; color: #fff; display: flex; justify-content: space-around; padding: 3.2mm 4mm; font-size: 9pt; margin: 0 -11mm; }

/* sections */
h2 { display: flex; align-items: center; gap: 4mm; font-size: 10.5pt; font-weight: 800; color: #111;
      text-transform: uppercase; letter-spacing: .4px; margin: 4.6mm 0 2.2mm; }
h2::after { content: ""; flex: 1; border-top: 1px solid #A5ACB5; }
.profile p { text-align: justify; color: #5A6069; margin: 0; font-size: 8.7pt; }

.cols { display: flex; gap: 7mm; position: absolute; top: 95mm; bottom: 0; left: 11mm; right: 0; }
.left { flex: 1 1 0; }
.side { width: 69mm; background: #DCE9F7; padding: 0.5mm 6.5mm 4mm 5.5mm; }
.side h2 { font-size: 9.6pt; margin: 2.6mm 0 1.2mm; }
.side h2::after { border-color: #8FA6BF; }

.exp { margin-bottom: 3.4mm; }
.exp-head { display: flex; justify-content: space-between; align-items: baseline; }
.exp-title { font-weight: 700; color: #111; font-size: 9.2pt; }
.date { color: #3D85D1; font-weight: 700; font-size: 8pt; white-space: nowrap; margin-left: 3mm; }
.org { color: #6B7280; font-size: 8.2pt; margin-bottom: 1.2mm; }
.exp ul { margin: 0; padding-left: 11px; }
.exp li { margin-bottom: 1.1mm; text-align: justify; }
.exp li b { color: #111; }

/* skills used: single accent, no borders */
.skills { margin-top: 1.1mm; line-height: 1.85; }
.sk-label { font-weight: 800; color: #3D85D1; font-size: 7.2pt; text-transform: uppercase; letter-spacing: .6px; margin-right: 5px; }
.tag { display: inline-block; background: #E8F1FB; color: #1E5C9B; border-radius: 9px; padding: 0 7px;
        font-size: 7.4pt; font-weight: 600; margin: 0 3px 0 0; line-height: 1.6; }

.comp ul { margin: 0; padding-left: 11px; }
.comp li { margin-bottom: 1.2mm; }
.comp b { color: #111; }

.side .edu-date { color: #5A6B7E; font-size: 7.5pt; margin-top: 1.3mm; }
.side .edu-title { font-weight: 700; color: #111; font-size: 8.3pt; line-height: 1.28; margin-top: .3mm; }
.side .edu-sub { font-size: 7.6pt; color: #3A4552; line-height: 1.25; }
.side .cat { font-weight: 800; color: #1E5C9B; font-size: 7.1pt; text-transform: uppercase; letter-spacing: .4px; margin-top: .9mm; }
.side .val { font-size: 7.7pt; color: #2C3540; line-height: 1.28; }
.side .plain { font-size: 7.7pt; color: #2C3540; line-height: 1.38; }
.side .plain div { display: flex; justify-content: space-between; }
.side .plain em { font-style: normal; color: #5A6B7E; }

/* page 2 */
.p2-band { background: #DCE9F7; text-align: center; font-size: 15pt; font-weight: 800; color: #111;
            padding: 3mm 0; margin: -10mm -11mm 4mm; letter-spacing: 2px; }
.timeline { position: relative; }
.tl-item { display: flex; position: relative; padding-bottom: 1.9mm; }
.tl-item::before { content: ""; position: absolute; left: 41.3mm; top: 2mm; bottom: -1.5mm; width: 2px; background: #3D85D1; }
.tl-item:last-child::before { display: none; }
.tl-label { width: 38mm; text-align: right; font-weight: 700; color: #3D85D1; font-size: 7.8pt;
             text-transform: uppercase; padding-top: .6mm; letter-spacing: .3px; }
.tl-dot { width: 3.6mm; height: 3.6mm; border-radius: 50%; background: #fff; border: 2px solid #3D85D1;
           margin: .7mm 4.5mm 0 1.6mm; flex: none; position: relative; z-index: 2; }
.tl-body { flex: 1; }
.tl-title { font-weight: 800; color: #111; font-size: 9.2pt; }
.client { font-weight: 600; color: #3D85D1; font-size: 7.4pt; font-style: italic; margin-left: 2px; }
.tl-body p { margin: .7mm 0 0; text-align: justify; }

.certs { display: flex; gap: 8mm; }
.ccol { flex: 1 1 0; }
.ccol .cg + .cg { margin-top: 2.4mm; }
.cg { width: 100%; }
.cg-title { font-weight: 800; color: #3D85D1; font-size: 7.6pt; text-transform: uppercase; letter-spacing: .4px;
             border-bottom: 1px solid #DCE9F7; padding-bottom: .6mm; margin-bottom: 1mm; }
.cert { display: flex; justify-content: space-between; gap: 3mm; font-size: 8pt; margin-bottom: .5mm; }
.cert span { color: #222; }
.cert em { font-style: normal; color: #8A929C; white-space: nowrap; }
"""


def tags(items, label="Skills used"):
    return (
        f'<div class="skills"><span class="sk-label">{label}</span>'
        + "".join(f'<span class="tag">{i}</span>' for i in items)
        + "</div>"
    )


def project(label, title, desc, skills, client=False, client_label="client project", skills_label="Skills used"):
    c = f' <span class="client">{client_label}</span>' if client else ""
    return f"""
    <div class="tl-item">
      <div class="tl-label">{label}</div>
      <div class="tl-dot"></div>
      <div class="tl-body">
        <div class="tl-title">{title}{c}</div>
        <p>{desc}</p>
        {tags(skills, label=skills_label)}
      </div>
    </div>"""


def cert_group(group_title, items):
    return (
        f'<div class="cg"><div class="cg-title">{group_title}</div>'
        + "".join(f'<div class="cert"><span>{n}</span><em>{o}</em></div>' for n, o in items)
        + "</div>"
    )


def build_en_html() -> str:
    projects = "".join([
        project(
            "GenAI &amp; Data",
            "GenAI &amp; Databricks iGaming Lakehouse (live)",
            "End-to-end Medallion platform on Databricks (Unity Catalog, CI/CD, 4.65M spins). MLflow @champion churn "
            "model (AUC 0.75), Isolation Forest fraud detection, and a 4-shield AST-guarded Text-to-SQL copilot.",
            ["Databricks", "Medallion", "MLflow", "Text-to-SQL", "LLM evaluation", "Python", "SQL"],
        ),
        project(
            "GenAI in Production",
            "AI-Powered Portfolio Website (live)",
            "Website in production with a context-aware AI assistant answering questions about my profile and "
            "projects (prompt and context engineering, modular single-source-of-truth architecture).",
            ["LLM chatbot", "Prompt &amp; context engineering", "Next.js", "TypeScript", "Vercel"],
        ),
        project(
            "Anomaly Detection",
            "SNCB Train Anomaly Detection",
            "Scalable Python framework for automated anomaly detection in large-scale train datasets.",
            ["Python", "R", "Anomaly detection", "Agile / Scrum"],
            client=True,
        ),
        project(
            "AI for Networks",
            "LLMs for Network Troubleshooting (Zindi)",
            "LLMs categorize network problems from telecom logs and produce a report on faults and attacks.",
            ["LLMs", "Prompt engineering", "Log analysis", "Python"],
        ),
        project(
            "AI for Security",
            "eBPF Intrusion Detection",
            "BiLSTM and a lighter eBPF-level model that detect and drop intrusions at the entry point.",
            ["eBPF", "BiLSTM", "Python", "Linux"],
        ),
        project(
            "Deep Learning",
            "LSTM from Scratch (C++)",
            "Energy consumption forecasting for Voisin d'&Eacute;nergie, built without any ML library.",
            ["C++", "LSTM", "Time series"],
            client=True,
        ),
        project(
            "Databases",
            "Medical Database",
            "UML and SQL Server (3NF) database with roles and permissions, containerized with Docker.",
            ["UML", "SQL Server", "3NF", "Docker"],
        ),
        project(
            "Machine Learning",
            "Urban Air Pollution (Zindi)",
            "Supervised learning algorithms and feature selection methods on a spatio-temporal regression task.",
            ["R", "Python", "Feature selection", "Regression"],
        ),
        project(
            "Master Thesis",
            "Swarm Robotics &amp; Topological Data Analysis (IRIDIA)",
            "Showed that density fields, not velocity fields alone, characterize swarm behaviors. Built Wasserstein-based "
            "metrics to transfer behaviors from neural controllers to finite-state machines.",
            ["TDA", "Gudhi", "Statistics", "C++", "Python", "ARGoS"],
        ),
        project(
            "Optimization",
            "Genetic Agriculture &amp; Kidney Transplant Optimization",
            "Multi-objective genetic algorithms for spatial agricultural allocation (NSGA-II + PROMETHEE II) and kidney transplant matching.",
            ["Python", "NSGA-II", "PROMETHEE II", "Combinatorial optimization"],
        ),
    ])

    certs_data = [
        ("AI &amp; Data Science", [
            ("Google AI Professional", "Google"),
            ("Reinforcement Learning Specialization", "University of Alberta"),
            ("Generative AI with LLMs (in progress)", "DeepLearning.AI"),
            ("Tableau, Networks &amp; Time Series Visualization", "UC Davis"),
        ]),
        ("Data Engineering &amp; Databases", [
            ("Introduction to Data Engineering", "IBM"),
            ("Introduction to Relational Databases", "IBM"),
            ("Microsoft SQL Server", "Microsoft"),
            ("Introduction to Containers (Docker, Kubernetes)", "IBM"),
            ("Databricks (in progress)", "Databricks"),
            ("Microsoft Azure (in progress)", "Microsoft"),
        ]),
        ("Systems &amp; IT", [
            ("Google IT Support Professional Certificate", "Google"),
            ("Linux Server Administration", "Coursera"),
            ("Windows Server 2025 Admin, Hands-On Labs", "Coursera"),
            ("Introduction to Git and GitHub", "Google"),
        ]),
        ("Management &amp; Projects", [
            ("Foundations of Project Management", "Google"),
        ]),
    ]
    certs = (
        '<div class="ccol">' + cert_group(*certs_data[0]) + cert_group(*certs_data[2]) + "</div>"
        '<div class="ccol">' + cert_group(*certs_data[1]) + cert_group(*certs_data[3]) + "</div>"
    )

    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>Olivier NDINGA OBA - Data &amp; AI</title>
<style>{CSS}</style></head>
<body>

<!-- PAGE 1 -->
<div class="page">
  <div class="corner"></div>
  <div class="qr"><a href="{WEBSITE}">{QR_SVG}</a><span>Scan: portfolio</span></div>
  <div class="name">Ir. Olivier <b>NDINGA OBA</b></div>
  <div class="name-rule"></div>
  <div class="title">Data &amp; AI</div>
  <div class="links">
    <span class="lk">{LI_SVG}<a href="{LINKEDIN}">LinkedIn</a></span>
    <span class="lk">{GH_SVG}<a href="{GITHUB}">GitHub</a></span>
    <span class="lk">{WEB_SVG}<a href="{WEBSITE}">Portfolio</a></span>
  </div>
  <div class="band"><span>Brussels, Belgium</span><span>obavertu@gmail.com</span><span>+32 497 21 21 37</span></div>

  <div class="profile">
    <h2>Profile</h2>
    <p>Civil Engineer in Computer Science (ULB) currently pursuing a Specialized Master in Industrial and Technological
    Management at Solvay Brussels School (ULB), combining engineering depth with business strategy. On the AI side, I take
    LLM solutions (RAG, guarded Text-to-SQL) and ML models from prototype to production; on the data side, I integrate
    Databricks to build reliable foundations. Since 2022, I have delivered client projects end to end (informal team lead
    of 3 at SNCB) and turned technical results into clear decisions. Trained in leadership at RMA, I aim to drive Data
    and AI projects end to end.</p>
  </div>

  <div class="cols">
    <div class="left">
      <h2>Experience &amp; Client Projects</h2>

      <div class="exp">
        <div class="exp-head"><span class="exp-title">Predictive Maintenance Project</span><span class="date">2023 - 2024</span></div>
        <div class="org">SNCB (National Railway Company of Belgium) &middot; client project, team of 3</div>
        <ul>
          <li><b>Goal:</b> anticipate train failures to optimize maintenance and reduce costs.</li>
          <li><b>Initiative:</b> took the lead informally. Set up meetings, proposed the approach, organised how tasks were shared, and ran review-and-improve loops with the team. After we compared our models, proposed the one we kept as final.</li>
          <li><b>Delivery:</b> data pipeline (ingestion, ETL, governance), ML and deep learning models in R and Python, and a dashboard for maintenance teams. Presented the results to SNCB together.</li>
        </ul>
        {tags(["Python", "R", "ETL", "Deep learning", "Dashboard", "Agile / Scrum", "Team lead"])}
      </div>

      <div class="exp">
        <div class="exp-head"><span class="exp-title">Energy Consumption Forecasting</span><span class="date">2022 - 2023</span></div>
        <div class="org">Voisin d'&Eacute;nergie &middot; client project, team of 3</div>
        <ul>
          <li><b>Goal:</b> predict household electricity consumption. Proposed LSTM networks, suited to time-dependent data.</li>
          <li><b>Delivery:</b> built the LSTM from scratch in C++ and presented the results to the company.</li>
        </ul>
        {tags(["C++", "LSTM", "Time series", "Client presentation"])}
      </div>

      <div class="exp">
        <div class="exp-head"><span class="exp-title">Equipment Manager &amp; Military Training</span><span class="date">2018 - 2022</span></div>
        <div class="org">Royal Military Academy (&Eacute;cole Royale Militaire)</div>
        <ul>
          <li><b>Equipment management (2020 - 2022):</b> responsible for student equipment.</li>
          <li><b>Leadership training:</b> trained to lead teams of 3 to 7 people and a platoon of about 30, in an international context.</li>
        </ul>
        {tags(["Leadership", "Team management", "Responsibility"])}
      </div>

      <h2>Competitions</h2>
      <div class="comp"><ul>
        <li><b>Future of IT Leaders: Data &amp; AI Challenge 2025</b> (Nov 2025): Finalist, top 50 of 693 participants.</li>
        <li><b>Huawei France Tech Arena</b> (Nov 2025): Finalist. Traffic allocation algorithm for dynamic UAV 6G networks.</li>
        <li><b>Zindi, Huawei &amp; partners:</b> LLMs on telecom logs to categorize network problems and report faults and attacks.</li>
        <li><b>2026 (ongoing):</b> Future of IT Leaders: Data &amp; AI Challenge 2026, AI Recruitment Challenge Belgium 2026.</li>
      </ul></div>
    </div>

    <div class="side">
      <h2>Education</h2>
      <div class="edu-date">2026 - present | ULB</div>
      <div class="edu-title">Specialized Master in Industrial and Technological Management</div>
      <div class="edu-sub">Solvay Brussels School</div>
      <div class="edu-date">2022 - 2025 | Universit&eacute; libre de Bruxelles</div>
      <div class="edu-title">Civil Engineer, MSc Computer Science &amp; Engineering</div>
      <div class="edu-sub">Graduated with Distinction</div>
      <div class="edu-date">2018 - 2022 | Royal Military Academy</div>
      <div class="edu-title">BSc Engineering Sciences</div>

      <h2>Core Competencies</h2>
      <div class="cat">GenAI &amp; LLMs</div><div class="val">LLMs, RAG, prompt engineering, Text-to-SQL, LLM evaluation</div>
      <div class="cat">AI-Assisted Dev</div><div class="val">Claude Code, GitHub Copilot, auditing and debugging AI-generated code</div>
      <div class="cat">ML &amp; Deep Learning</div><div class="val">PyTorch, TensorFlow, Keras, LSTM, anomaly detection, predictive modeling</div>
      <div class="cat">Data Engineering</div><div class="val">Databricks, Snowflake, Medallion, ETL, governance, SQL Server</div>
      <div class="cat">Programming &amp; Tools</div><div class="val">Python, R, C/C++, SQL, Git, Docker, Linux, Power BI, Excel</div>
      <div class="cat">End-to-End Delivery</div><div class="val">Agile / Scrum, project ownership, presenting results, translating tech into business terms</div>

      <h2>Languages</h2>
      <div class="plain">
        <div><span>French</span><em>Native</em></div>
        <div><span>English</span><em>C1, professional</em></div>
        <div><span>Dutch</span><em>Basic</em></div>
      </div>

      <h2>Personality</h2>
      <div class="plain">Leadership, initiative, continuous learning, adaptability, autonomy, critical thinking, ethics &amp; professionalism.</div>
      <div class="plain" style="margin-top:1.5mm"><b>Interests:</b> CrossFit &amp; sport, travel.</div>
    </div>
  </div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="p2-band">PROJECTS</div>
  <div class="timeline">{projects}</div>
  <h2>Certifications</h2>
  <div class="certs">{certs}</div>
</div>

</body></html>"""


def build_fr_html() -> str:
    sk = "Comp&eacute;tences"
    cl = "projet client"
    projects = "".join([
        project(
            "GenAI &amp; Data",
            "Lakehouse Databricks &amp; IA iGaming (en production)",
            "Plateforme M&eacute;daillon sur Databricks (Unity Catalog, CI/CD, 4,65M spins). Mod&egrave;le de churn MLflow @champion "
            "(AUC 0,75), Isolation Forest anti-fraude et copilote Text-to-SQL gouvern&eacute; par AST.",
            ["Databricks", "M&eacute;daillon", "MLflow", "Text-to-SQL", "&Eacute;valuation LLM", "Python", "SQL"],
            skills_label=sk,
        ),
        project(
            "GenAI en Prod",
            "Site Portfolio Propuls&eacute; par l'IA (en production)",
            "Site en production avec un assistant IA contextuel r&eacute;pondant aux questions sur mon profil "
            "et mes projets (prompt &amp; context engineering, architecture modulaire centralis&eacute;e).",
            ["Chatbot LLM", "Prompt &amp; context engineering", "Next.js", "TypeScript", "Vercel"],
            skills_label=sk,
        ),
        project(
            "Anomalies",
            "D&eacute;tection d'Anomalies Ferroviaires SNCB",
            "Framework Python extensible pour la d&eacute;tection automatis&eacute;e d'anomalies ferroviaires.",
            ["Python", "R", "D&eacute;tection d'anomalies", "Agile / Scrum"],
            client=True,
            client_label=cl,
            skills_label=sk,
        ),
        project(
            "IA &amp; R&eacute;seaux",
            "LLMs pour le Diagnostic R&eacute;seau (Zindi)",
            "Cat&eacute;gorisation par LLMs de pannes r&eacute;seau sur logs t&eacute;l&eacute;coms et rapport sur les attaques.",
            ["LLMs", "Prompt engineering", "Analyse de logs", "Python"],
            skills_label=sk,
        ),
        project(
            "IA &amp; S&eacute;curit&eacute;",
            "D&eacute;tection d'Intrusions par eBPF",
            "Mod&egrave;le BiLSTM et filtre noyau eBPF d&eacute;tectant et bloquant les intrusions au point d'entr&eacute;e.",
            ["eBPF", "BiLSTM", "Python", "Linux"],
            skills_label=sk,
        ),
        project(
            "Deep Learning",
            "LSTM from Scratch (C++)",
            "Pr&eacute;vision de consommation &eacute;lectrique pour Voisin d'&Eacute;nergie, cod&eacute;e sans librairie ML.",
            ["C++", "LSTM", "S&eacute;ries temporelles"],
            client=True,
            client_label=cl,
            skills_label=sk,
        ),
        project(
            "Bases de Donn&eacute;es",
            "Base de Donn&eacute;es M&eacute;dicale",
            "Base de donn&eacute;es UML et SQL Server (3NF) avec r&ocirc;les et permissions, sous Docker.",
            ["UML", "SQL Server", "3NF", "Docker"],
            skills_label=sk,
        ),
        project(
            "Machine Learning",
            "Pollution de l'Air Urbaine (Zindi)",
            "Apprentissage supervis&eacute; et s&eacute;lection de variables appliqu&eacute;s &agrave; une t&acirc;che de r&eacute;gression.",
            ["R", "Python", "S&eacute;lection de variables", "R&eacute;gression"],
            skills_label=sk,
        ),
        project(
            "M&eacute;moire Master",
            "Robotique en Essaim &amp; Analyse Topologique (IRIDIA)",
            "D&eacute;montr&eacute; que les champs de densit&eacute; caract&eacute;risent les essaims. M&eacute;triques de Wasserstein "
            "pour transf&eacute;rer des comportements de r&eacute;seaux neuronaux vers des automates finis.",
            ["TDA", "Gudhi", "Statistiques", "C++", "Python", "ARGoS"],
            skills_label=sk,
        ),
        project(
            "Optimisation",
            "Optimisation G&eacute;n&eacute;tique Agricole &amp; Greffes R&eacute;nales",
            "Algorithmes g&eacute;n&eacute;tiques pour l'allocation agricole (NSGA-II + PROMETHEE II) et greffes r&eacute;nales.",
            ["Python", "NSGA-II", "PROMETHEE II", "Optimisation combinatoire"],
            skills_label=sk,
        ),
    ])

    certs_data = [
        ("IA &amp; Data Science", [
            ("Google AI Professional", "Google"),
            ("Reinforcement Learning Specialization", "University of Alberta"),
            ("Generative AI with LLMs (en cours)", "DeepLearning.AI"),
            ("Tableau, Networks &amp; Time Series Visualization", "UC Davis"),
        ]),
        ("Data Engineering &amp; Bases de Donn&eacute;es", [
            ("Introduction to Data Engineering", "IBM"),
            ("Introduction to Relational Databases", "IBM"),
            ("Microsoft SQL Server", "Microsoft"),
            ("Introduction to Containers (Docker, Kubernetes)", "IBM"),
            ("Databricks (en cours)", "Databricks"),
            ("Microsoft Azure (en cours)", "Microsoft"),
        ]),
        ("Syst&egrave;mes &amp; IT", [
            ("Google IT Support Professional Certificate", "Google"),
            ("Linux Server Administration", "Coursera"),
            ("Windows Server 2025 Admin, Hands-On Labs", "Coursera"),
            ("Introduction to Git and GitHub", "Google"),
        ]),
        ("Management &amp; Projets", [
            ("Foundations of Project Management", "Google"),
        ]),
    ]
    certs = (
        '<div class="ccol">' + cert_group(*certs_data[0]) + cert_group(*certs_data[2]) + "</div>"
        '<div class="ccol">' + cert_group(*certs_data[1]) + cert_group(*certs_data[3]) + "</div>"
    )

    return f"""<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Olivier NDINGA OBA - Data &amp; IA</title>
<style>{CSS}</style></head>
<body>

<!-- PAGE 1 -->
<div class="page">
  <div class="corner"></div>
  <div class="qr"><a href="{WEBSITE}">{QR_SVG}</a><span>Scan : portfolio</span></div>
  <div class="name">Ir. Olivier <b>NDINGA OBA</b></div>
  <div class="name-rule"></div>
  <div class="title">Data &amp; IA</div>
  <div class="links">
    <span class="lk">{LI_SVG}<a href="{LINKEDIN}">LinkedIn</a></span>
    <span class="lk">{GH_SVG}<a href="{GITHUB}">GitHub</a></span>
    <span class="lk">{WEB_SVG}<a href="{WEBSITE}">Portfolio</a></span>
  </div>
  <div class="band"><span>Bruxelles, Belgique</span><span>obavertu@gmail.com</span><span>+32 497 21 21 37</span></div>

  <div class="profile">
    <h2>Profil</h2>
    <p>Ing&eacute;nieur Civil en Informatique (ULB) poursuivant un Master de sp&eacute;cialisation en gestion industrielle et
    technologique &agrave; la Solvay Brussels School (ULB), j'allie expertise technique et vision management. C&ocirc;t&eacute; IA, je m&egrave;ne des
    solutions LLM (RAG, Text-to-SQL gouvern&eacute;) et ML du prototype &agrave; la production. C&ocirc;t&eacute; Data, j'int&egrave;gre Databricks pour b&acirc;tir
    des fondations fiables. Depuis 2022, j'ai livr&eacute; des projets clients (lead informel d'une &eacute;quipe de 3 &agrave; la SNCB) et traduit des
    r&eacute;sultats complexes en d&eacute;cisions claires. Form&eacute; au leadership &agrave; l'ERM, j'ambitionne de piloter des projets Data et IA de bout en bout.</p>
  </div>

  <div class="cols">
    <div class="left">
      <h2>Exp&eacute;riences &amp; Projets Clients</h2>

      <div class="exp">
        <div class="exp-head"><span class="exp-title">Projet de Maintenance Pr&eacute;dictive</span><span class="date">2023 - 2024</span></div>
        <div class="org">SNCB (Soci&eacute;t&eacute; Nationale des Chemins de fer Belges) &middot; projet client, &eacute;quipe de 3</div>
        <ul>
          <li><b>Objectif :</b> anticiper les pannes de trains pour optimiser la maintenance et r&eacute;duire les co&ucirc;ts.</li>
          <li><b>Initiative :</b> prise de lead informelle. Organisation des r&eacute;unions, proposition de l'approche, r&eacute;partition des t&acirc;ches et boucles de revue avec l'&eacute;quipe. Apr&egrave;s comparaison de nos mod&egrave;les, proposition du mod&egrave;le final retenu.</li>
          <li><b>Livraison :</b> pipeline de donn&eacute;es (ingestion, ETL, gouvernance), mod&egrave;les ML et deep learning en R et Python, et dashboard pour les &eacute;quipes de maintenance. Pr&eacute;sentation des r&eacute;sultats &agrave; la SNCB.</li>
        </ul>
        {tags(["Python", "R", "ETL", "Deep learning", "Dashboard", "Agile / Scrum", "Team lead"], label=sk)}
      </div>

      <div class="exp">
        <div class="exp-head"><span class="exp-title">Pr&eacute;vision de Consommation &Eacute;lectrique</span><span class="date">2022 - 2023</span></div>
        <div class="org">Voisin d'&Eacute;nergie &middot; projet client, &eacute;quipe de 3</div>
        <ul>
          <li><b>Objectif :</b> pr&eacute;dire la consommation &eacute;lectrique des m&eacute;nages via des r&eacute;seaux LSTM adapt&eacute;s aux s&eacute;ries temporelles.</li>
          <li><b>Livraison :</b> impl&eacute;mentation du LSTM from scratch en C++ et pr&eacute;sentation des r&eacute;sultats &agrave; l'entreprise.</li>
        </ul>
        {tags(["C++", "LSTM", "S&eacute;ries temporelles", "Pr&eacute;sentation client"], label=sk)}
      </div>

      <div class="exp">
        <div class="exp-head"><span class="exp-title">Responsable Mat&eacute;riel &amp; Formation Militaire</span><span class="date">2018 - 2022</span></div>
        <div class="org">&Eacute;cole Royale Militaire (ERM)</div>
        <ul>
          <li><b>Gestion du mat&eacute;riel (2020 - 2022) :</b> responsable de l'&eacute;quipement des &eacute;tudiants.</li>
          <li><b>Formation au leadership :</b> form&eacute; &agrave; diriger des &eacute;quipes de 3 &agrave; 7 personnes et un peloton d'environ 30 personnes en contexte international.</li>
        </ul>
        {tags(["Leadership", "Management d'&eacute;quipe", "Responsabilit&eacute;"], label=sk)}
      </div>

      <h2>Comp&eacute;titions</h2>
      <div class="comp"><ul>
        <li><b>Future of IT Leaders: Data &amp; AI Challenge 2025</b> (Nov 2025) : Finaliste, top 50 sur 693 participants.</li>
        <li><b>Huawei France Tech Arena</b> (Nov 2025) : Finaliste. Algorithme d'allocation de trafic pour r&eacute;seaux de drones (UAV) 6G.</li>
        <li><b>Zindi, Huawei &amp; partenaires :</b> LLMs sur logs t&eacute;l&eacute;coms pour cat&eacute;goriser les pannes r&eacute;seau et rapporter les attaques.</li>
        <li><b>2026 (en cours) :</b> Future of IT Leaders: Data &amp; AI Challenge 2026, AI Recruitment Challenge Belgium 2026.</li>
      </ul></div>
    </div>

    <div class="side">
      <h2>Formation</h2>
      <div class="edu-date">2026 - en cours | ULB</div>
      <div class="edu-title">Master de sp&eacute;cialisation en gestion industrielle et technologique</div>
      <div class="edu-sub">Solvay Brussels School</div>
      <div class="edu-date">2022 - 2025 | Universit&eacute; libre de Bruxelles</div>
      <div class="edu-title">Ing&eacute;nieur Civil en Informatique (MSc)</div>
      <div class="edu-sub">Dipl&ocirc;m&eacute; avec Distinction</div>
      <div class="edu-date">2018 - 2022 | &Eacute;cole Royale Militaire</div>
      <div class="edu-title">Bachelier en Sciences de l'Ing&eacute;nieur</div>

      <h2>Comp&eacute;tences Cl&eacute;s</h2>
      <div class="cat">GenAI &amp; LLMs</div><div class="val">LLMs, RAG, prompt engineering, Text-to-SQL, &eacute;valuation de LLMs</div>
      <div class="cat">D&eacute;v. Assist&eacute; par IA</div><div class="val">Claude Code, GitHub Copilot, audit et d&eacute;bogage de code g&eacute;n&eacute;r&eacute; par IA</div>
      <div class="cat">ML &amp; Deep Learning</div><div class="val">PyTorch, TensorFlow, Keras, LSTM, d&eacute;tection d'anomalies, mod&eacute;lisation pr&eacute;dictive</div>
      <div class="cat">Data Engineering</div><div class="val">Databricks, Snowflake, M&eacute;daillon, ETL, gouvernance, SQL Server</div>
      <div class="cat">Programmation &amp; Outils</div><div class="val">Python, R, C/C++, SQL, Git, Docker, Linux, Power BI, Excel</div>
      <div class="cat">Livraison End-to-End</div><div class="val">Agile / Scrum, pilotage de projet, pr&eacute;sentation client, traduction tech &rarr; m&eacute;tier</div>

      <h2>Langues</h2>
      <div class="plain">
        <div><span>Fran&ccedil;ais</span><em>Langue maternelle</em></div>
        <div><span>Anglais</span><em>C1, professionnel</em></div>
        <div><span>N&eacute;erlandais</span><em>Notions</em></div>
      </div>

      <h2>Personnalit&eacute;</h2>
      <div class="plain">Leadership, initiative, apprentissage continu, adaptabilit&eacute;, autonomie, esprit critique, &eacute;thique &amp; professionnalisme.</div>
      <div class="plain" style="margin-top:1.5mm"><b>Int&eacute;r&ecirc;ts :</b> CrossFit &amp; sport, voyages.</div>
    </div>
  </div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="p2-band">PROJETS</div>
  <div class="timeline">{projects}</div>
  <h2>Certifications</h2>
  <div class="certs">{certs}</div>
</div>

</body></html>"""


def main():
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    en_pdf = PUBLIC_DIR / "CV_Olivier_NDINGA_OBA_EN.pdf"
    fr_pdf = PUBLIC_DIR / "CV_Olivier_NDINGA_OBA_FR.pdf"

    HTML(string=build_en_html(), base_url=str(ROOT_DIR)).write_pdf(str(en_pdf))
    print(f"Generated: {en_pdf} ({en_pdf.stat().st_size} bytes)")

    HTML(string=build_fr_html(), base_url=str(ROOT_DIR)).write_pdf(str(fr_pdf))
    print(f"Generated: {fr_pdf} ({fr_pdf.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
