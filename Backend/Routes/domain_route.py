from fastapi import APIRouter, Depends, HTTPException
from services.pishing_url import analyze_url
from services.domain_collector import get_phishing_urls

pishing_router = APIRouter(prefix="/domains", tags=["Famous pishing Domain on internet"])

@pishing_router.get("/live")
def get_live_phishing():
    urls = get_phishing_urls()
    if not urls:
        raise HTTPException(status_code=500, detail="Failed to fetch phishing URLs")
    try:
        result = analyze_url(urls)
    except Exception:
        raise HTTPException(status_code=500, detail="AI analysis failed")

    return {
        "total_urls": len(urls),
        "analysis": result
    }