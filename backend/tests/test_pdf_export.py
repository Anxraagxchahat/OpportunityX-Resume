from fastapi.testclient import TestClient
from app.main import app

def test_export_pdf_endpoint():
    """
    Validates canonical Chromium-native PDF export endpoint:
    - 200 OK status code
    - application/pdf Content-Type
    - Binary content returned
    """
    client = TestClient(app)
    sample_html = """<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: 210mm 297mm; margin: 0; }
          body { font-family: sans-serif; margin: 0; padding: 20mm; }
        </style>
      </head>
      <body>
        <h1>Jane Doe</h1>
        <h2>Staff Systems Engineer</h2>
        <p>Expert in distributed systems and document parsing architectures.</p>
        <div>Skills: Python, FastAPI, React, Docker, Kubernetes</div>
      </body>
    </html>"""

    response = client.post(
        "/api/v1/resumes/export-pdf",
        json={
            "html": sample_html,
            "filename": "Jane_Doe_Resume.pdf"
        }
    )

    assert response.status_code == 200
    assert response.headers.get("content-type") == "application/pdf"
    assert "attachment; filename=\"Jane_Doe_Resume.pdf\"" in response.headers.get("content-disposition", "")
    assert len(response.content) > 1000
    assert response.content[:4] == b"%PDF"
