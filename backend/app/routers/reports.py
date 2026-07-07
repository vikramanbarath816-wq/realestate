from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from ..models.schemas import PortfolioRiskRequest

router = APIRouter(tags=["reports"])


@router.post("/report/pdf")
async def report_pdf(req: PortfolioRiskRequest):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 60, "Dubai Real Estate Portfolio Report")

    c.setFont("Helvetica", 11)
    y = height - 100
    c.drawString(50, y, f"Investment amount: AED {req.investment_amount:,.2f}")
    y -= 20
    c.drawString(50, y, f"Horizon: {req.horizon_years} years")
    y -= 30

    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, "Allocation")
    y -= 20
    c.setFont("Helvetica", 11)
    for community, weight in req.portfolio.items():
        c.drawString(60, y, f"{community}: {weight * 100:.1f}%")
        y -= 18

    c.showPage()
    c.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf",
                              headers={"Content-Disposition": "attachment; filename=portfolio_report.pdf"})
