from pydantic import BaseModel, Field

class URLCheckResponse(BaseModel):
    is_phishing: bool = Field(description="True if phishing, False otherwise")
    reason: str = Field(description="Short explanation")

class URLRequest(BaseModel):
    url: str

class URLResponse(BaseModel):
    url: str
    is_phishing: bool
    reason: str