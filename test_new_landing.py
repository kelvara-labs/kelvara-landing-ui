from pathlib import Path
ROOT = Path(__file__).parent
HTML = (ROOT / "index.html").read_text()
CAL = "https://calendly.com/andrzej-santocki/30min"

def test_on_watch_landing_contract():
    assert (ROOT / "CNAME").read_text().strip() == "kelvara.xyz"
    for text in ("Kelvara is", "on watch.", "a new admin takes the keys", "Powered by", "prefers-reduced-motion:reduce", "color-scheme:dark", "timelock 0", "og-image.png"):
        assert text in HTML, text
    for removed in ("Devnet", "devnet", "Run the demo", 'href="#demo"', 'href="#contact"', "Proposal 41", "hello@kelvara", "fonts.googleapis", "og-image.svg", "feed offline"):
        assert removed not in HTML, removed
    assert HTML.count(f'href="{CAL}"') == 2
    assert HTML.count('href="https://app.kelvara.xyz/"') == 3
    assert 'href="/docs/"' in HTML and 'href="https://status.kelvara.xyz/"' in HTML
    assert 'src="/assets/solana-logo.svg"' in HTML
    for link in ('href="https://x.com/kelvara_xyz"', 'href="https://www.linkedin.com/company/kelvara-defi-security"', 'href="/privacy/"'):
        assert link in HTML, link
    analytics = (ROOT / "assets/analytics.js").read_text()  # landing analytics must stay cookieless
    assert 'src="/assets/analytics.js"' in HTML and 'persistence: "memory"' in analytics and "eu.i.posthog.com" in analytics
    assert "disable_session_recording: true" in analytics and "mask_all_text: true" in analytics
    assert 'href="/terms/"' in HTML and 'id="legal"' in HTML
    assert 'href="/docs/contact/"' in HTML and "help@kelvara.xyz" in (ROOT / "docs/contact/index.html").read_text()
    terms = (ROOT / "terms/index.html").read_text()
    assert "Terms of Use" in terms and "seed phrase" in terms and "Polish law" in terms and 'href="/privacy/"' in terms
    privacy = (ROOT / "privacy/index.html").read_text()
    assert "PostHog" in privacy and 'href="/terms/"' in privacy
    assert "contact@kelvara.xyz" in privacy and "seed phrase" in privacy and "fonts.googleapis" not in privacy
    for asset in ("assets/kelvara-icon.png", "assets/solana-logo.svg", "og-image.png", "assets/fonts/hanken-grotesk-latin-300-normal.woff2"):
        assert (ROOT / asset).is_file(), asset
