from pydantic import BaseModel, Field

class URLCheckResponse(BaseModel):
    is_phishing: bool = Field(description="True if phishing, False otherwise")
    reason: str = Field(description="Short explanation")