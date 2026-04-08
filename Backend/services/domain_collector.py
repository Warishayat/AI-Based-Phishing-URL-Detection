import requests
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0
)

# 📡 Fetch phishing URLs (WORKING SOURCE)
def get_phishing_urls(limit=20):
    url = "https://openphish.com/feed.txt"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            print("❌ Failed to fetch data")
            return []

        urls = response.text.strip().split("\n")

        # remove empty lines
        urls = [u for u in urls if u]

        return urls[:limit]

    except Exception as e:
        print("❌ Error fetching data:", e)
        return []


# 🧠 Analyze URLs
def analyze_urls(urls):
    prompt = f"""
You are a cybersecurity expert.

Below are real phishing URLs.

Select 15 URLs and explain why each is phishing.

Focus on:
- suspicious domain names
- use of http instead of https
- fake login keywords (login, verify, update)
- brand impersonation

Return format:

1. URL: ...
   Reason: ...

URLs:
{urls}
"""
    response = llm.invoke(prompt)
    return response.content


# 🚀 MAIN
if __name__ == "__main__":
    print("🚨 Fetching real phishing URLs...\n")

    urls = get_phishing_urls()

    if not urls:
        print("❌ No URLs found")
        exit()

    print(f"✅ Got {len(urls)} URLs\n")

    print("🤖 Analyzing...\n")

    result = analyze_urls(urls)

    print("🔥 Results:\n")
    print(result)