import builtins
import types
import pytest
import requests
from unittest import mock

# Import the module under test
import Backend.services.domain_collector as dc

# ------------------------------------------------------------------
# Helper to patch ChatGroq initialization
# ------------------------------------------------------------------
@pytest.fixture
def patch_chatgroq(monkeypatch):
    """Patch ChatGroq to capture the model name used."""
    captured = {}
    original = dc.ChatGroq

    class DummyChatGroq:
        def __init__(self, model, temperature=0):
            captured['model'] = model
            captured['temperature'] = temperature
            self._model = model

        def invoke(self, prompt):
            # Return a dummy response object with content attribute
            class DummyResponse:
                def __init__(self, content):
                    self.content = content
            return DummyResponse(content="dummy analysis")

    monkeypatch.setattr(dc, "ChatGroq", DummyChatGroq)
    yield captured
    # restore original
    monkeypatch.setattr(dc, "ChatGroq", original)

# ------------------------------------------------------------------
# Test that the LLM is initialized with the correct Groq model
# ------------------------------------------------------------------
def test_llm_initialization_model(patch_chatgroq):
    # Re-import to trigger initialization
    import importlib
    importlib.reload(dc)
    assert patch_chatgroq['model'] == "llama3-8b-8192"
    assert patch_chatgroq['temperature'] == 0

# ------------------------------------------------------------------
# Test get_phishing_urls normal flow
# ------------------------------------------------------------------
def test_get_phishing_urls_success(monkeypatch):
    sample_text = "http://example.com\nhttps://phish.com\n\n"
    mock_resp = mock.Mock()
    mock_resp.status_code = 200
    mock_resp.text = sample_text

    monkeypatch.setattr(requests, "get", lambda *args, **kwargs: mock_resp)

    urls = dc.get_phishing_urls(limit=5)
    assert urls == ["http://example.com", "https://phish.com"]

# ------------------------------------------------------------------
# Test get_phishing_urls handles non-200 status
# ------------------------------------------------------------------
def test_get_phishing_urls_non200(monkeypatch, capsys):
    mock_resp = mock.Mock()
    mock_resp.status_code = 404
    monkeypatch.setattr(requests, "get", lambda *args, **kwargs: mock_resp)

    urls = dc.get_phishing_urls()
    captured = capsys.readouterr()
    assert "Failed to fetch data" in captured.out
    assert urls == []

# ------------------------------------------------------------------
# Test get_phishing_urls handles exception
# ------------------------------------------------------------------
def test_get_phishing_urls_exception(monkeypatch, capsys):
    monkeypatch.setattr(requests, "get", lambda *args, **kwargs: (_ for _ in ()).throw(Exception("network error")))
    urls = dc.get_phishing_urls()
    captured = capsys.readouterr()
    assert "Error fetching data:" in captured.out
    assert urls == []

# ------------------------------------------------------------------
# Test analyze_urls returns content from LLM
# ------------------------------------------------------------------
def test_analyze_urls_returns_content(monkeypatch):
    # Patch the llm instance to return a known content
    class DummyLLM:
        def invoke(self, prompt):
            class DummyResp:
                content = "analysis result"
            return DummyResp()
    monkeypatch.setattr(dc, "llm", DummyLLM())

    urls = ["http://bad.com", "https://evil.org"]
    result = dc.analyze_urls(urls)
    assert result == "analysis result"

# ------------------------------------------------------------------
# Test analyze_urls includes URLs in prompt
# ------------------------------------------------------------------
def test_analyze_urls_prompt_includes_urls(monkeypatch):
    captured_prompt = {}
    class DummyLLM:
        def invoke(self, prompt):
            captured_prompt['prompt'] = prompt
            class DummyResp:
                content = "analysis"
            return DummyResp()
    monkeypatch.setattr(dc, "llm", DummyLLM())

    urls = ["http://bad.com"]
    dc.analyze_urls(urls)
    assert "http://bad.com" in captured_prompt['prompt']
    assert "URLs:" in captured_prompt['prompt']

# ------------------------------------------------------------------
# Test limit parameter in get_phishing_urls
# ------------------------------------------------------------------
def test_get_phishing_urls_limit(monkeypatch):
    sample_text = "\n".join([f"http://site{i}.com" for i in range(10)]) + "\n"
    mock_resp = mock.Mock()
    mock_resp.status_code = 200
    mock_resp.text = sample_text
    monkeypatch.setattr(requests, "get", lambda *args, **kwargs: mock_resp)

    urls = dc.get_phishing_urls(limit=3)
    assert len(urls) == 3
    assert urls == ["http://site0.com", "http://site1.com", "http://site2.com"]