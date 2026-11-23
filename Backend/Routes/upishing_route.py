from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from Database.database import get_db
from Database.tables import Domain
from fastapi.exceptions import HTTPException
from models.url_schema import URLRequest, URLResponse
from services.pishing_url import analyze_url
from models.user_Schema import get_current_user
from services.email import send_email

domain_router = APIRouter(prefix="/pishing-url", tags=["Pishing Url Tester"])


@domain_router.post("/check", response_model=URLResponse)
def check_domain(
    request: URLRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    background_tasks: BackgroundTasks = Depends(),
):
    try:
        existing = db.query(Domain).filter(Domain.url == request.url).first()
        if existing:
            is_phishing_existing = "phishing" in (existing.reason or "").lower()
            return {
                "url": existing.url,
                "is_phishing": is_phishing_existing,
                "reason": existing.reason,
            }

        result = analyze_url(request.url)
        new_domain = Domain(
            url=result["url"],
            reason=result["reason"],
        )
        db.add(new_domain)
        db.commit()
        db.refresh(new_domain)

        if result.get("is_phishing") and not existing:
            background_tasks.add_task(
                send_email,
                to_email=current_user.email,
                subject="⚠️ Phishing Alert",
                body=f"""
                The URL you checked is identified as PHISHING.

                URL: {result['url']}

                Reason:
                {result['reason']}

                Please avoid visiting this site.
                """,
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))