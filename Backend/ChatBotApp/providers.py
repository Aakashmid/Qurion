from django.conf import settings
from openai import AsyncOpenAI

PROVIDERS = {
    "groq": {
        "base_url": "https://api.groq.com/openai/v1",
        "key_env": "GROQ_API_KEY",
        "model": "openai/gpt-oss-20b",
        # "model": "llama-3.3-70b-versatile",
    },
    "gemini": {
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        "key_env": "GEMINI_API_KEY",
        "model": "gemini-3.1-flash-lite-preview",
    },
}

# Order matters — first is primary, rest are fallbacks tried in sequence
PROVIDER_ORDER = ["groq", "gemini"]


def get_client(provider: str):
    cfg = PROVIDERS[provider]
    key = getattr(settings, cfg["key_env"])
    if not key:
        raise RuntimeError(f"Missing {cfg['key_env']} in environment")
    client = AsyncOpenAI(base_url=cfg["base_url"], api_key=key)
    return client, cfg["model"]


"""
from openai import OpenAI
import os
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

response = client.responses.create(
    input="Explain the importance of fast language models",
    model="openai/gpt-oss-20b",
)
print(response.output_text)

"""
