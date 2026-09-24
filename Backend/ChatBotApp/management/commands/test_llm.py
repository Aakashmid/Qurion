import asyncio

from django.core.management.base import BaseCommand

from ChatBotApp.providers import PROVIDER_ORDER, get_client


class Command(BaseCommand):
    help = "Test each configured LLM provider before starting the server."

    def add_arguments(self, parser):
        parser.add_argument(
            "--provider",
            type=str,
            default=None,
            help="Test a single provider only (e.g. groq, openrouter). Default: test all.",
        )

    def handle(self, *args, **options):
        providers_to_test = (
            [options["provider"]] if options["provider"] else PROVIDER_ORDER
        )
        asyncio.run(self._run(providers_to_test))

    async def _run(self, providers_to_test):
        for provider_name in providers_to_test:
            self.stdout.write(f"\n--- Testing: {provider_name} ---")
            try:
                client, model = get_client(provider_name)
                self.stdout.write(f"Model: {model}")

                response = await client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": "Reply with exactly: OK"}],
                    max_tokens=10,
                )

                content = response.choices[0].message.content
                self.stdout.write(self.style.SUCCESS(f"✓ Response: {content!r}"))

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"✗ FAILED: {type(e).__name__}: {e}")
                )
