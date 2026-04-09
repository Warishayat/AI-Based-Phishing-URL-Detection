import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from models.url_schema import URLCheckResponse

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    groq_api_key=GROQ_API_KEY
)

parser = PydanticOutputParser(pydantic_object=URLCheckResponse)

prompt = PromptTemplate(
    template="""
    You are a cybersecurity expert.

    Determine if the following URL is a phishing URL.

    URL: {url}

    {format_instructions}
    """,
    input_variables=["url"],
    partial_variables={
        "format_instructions": parser.get_format_instructions()
    }
)

def ai_url_check(url: str):
    chain = prompt | llm | parser
    result = chain.invoke({"url": url})
    return result.model_dump()

def analyze_url(url: str):
    result = ai_url_check(url)

    return {
        "url": url,
        "is_phishing": result["is_phishing"],
        "reason": result["reason"]
    }


if __name__ == "__main__":
    test_urls = [
        "https://google.com",
        "http://secure-paypal-login.com",
        "https://facebook.com",
        "http://bank-verification-alert.net"
    ]

    for url in test_urls:
        print("\nChecking URL:", url)
        try:
            result = analyze_url(url)
            print("Result:", result)
        except Exception as e:
            print("Error:", str(e))