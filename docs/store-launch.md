# Suppressor Studio — app-store submission readiness

**Status: Preparation only. No Microsoft, Google, or Apple store submission or acceptance is confirmed.**
Public website: https://suppressor-studio.vercel.app

## Product and scope
- Publisher display name: **Not confirmed**. Confirm a legal publisher/account owner before registration.
- Public product name: Suppressor Studio.
- Free web beta: concept-sketch workspace, introductory material and sound-science reference, read-only community catalog, JSON concept backups and non-dimensional concept summaries.
- STL/3MF exports in the current product are **only for the unrelated generic 20 mm calibration cube**, not suppressor manufacturing parts.
- Subscription billing and live paid checkout: **not confirmed active**. Do not advertise Pro as purchasable.
- Content and classification: Subject to each store's independent review. Do **not** describe this as a verified firearm-manufacturing tool, an authorized manufacturing guide, or a safety approval.

## Publication blockers
1. **Publisher account/verification:** Confirm who owns Microsoft Partner Center, Google Play Console and Apple Developer Program accounts. Identity checks and acceptance of each provider's developer terms require the publisher.
2. **Privacy policy and data mapping:** Publish an accurate policy URL describing actual authentication data, cloud studies, analytics, third parties, retention, data security, and support contacts. Verify facts against deployed implementation, not guesses.
3. **Account deletion:** Implement in-app and web-based deletion/request paths that actually delete account and linked user data, with lawful retention explained. Apple and Google require deletion routes for apps that create accounts.
4. **Password recovery and email ownership:** Account recovery/verification are not confirmed working; address prior to wide release.
5. **Store-policy review:** Suppressor concept sketches, caliber labels and community references create a weapon-related content review risk. No listing, screenshot, or metadata should conceal functionality. Obtain a qualified policy/legal assessment where warranted. Review current rules for each target country.
6. **Native packaging and signing:** The PWA manifest and icons are web assets, not a signed MSIX, Android AAB, or iOS IPA. No signing certificate, verified Android Digital Asset Links, or Apple provisioning profile has been provided.
7. **Review devices and QA:** Validate onboarding, save and sync across devices, offline behavior, sign out, account deletion, browser/webview layout, network errors, and accessibility. Do not submit until tested.
8. **Store listing:** Capture original screenshots from real supported devices; provide support URL, privacy URL, accurate content/age ratings, permissions/data-safety answers, release notes, and app-review demo account or mode.
9. **Payment compliance:** Review each store's digital subscriptions and external purchase policies before enabling or promoting $9.99/month Pro.
10. **PWA offline entry:** A store-quality service worker/offline launch path and installability assessment are still needed; having a manifest does not mean distribution is complete.

## Target publishing path

| Platform | Build | Developer account | Status |
| --- | --- | --- | --- |
| Microsoft Store | Package the public PWA with PWABuilder/approved packaging; submit in Partner Center | Individual/company onboarding currently free in new Microsoft flow | **Not submitted** |
| Google Play | Build a signed Android App Bundle using an appropriate native app or Trusted Web Activity. Verify domain ownership with Digital Asset Links | Play Console $25 one-time; new personal accounts normally 12 testers/14 days closed testing | **Not submitted** |
| Apple App Store | Build a genuinely useful iOS app with suitable native integration, test on iOS, sign and submit via App Store Connect | Apple Developer Program $99/year | **Not submitted** |

For a Google TWA, do not place a placeholder `.well-known/assetlinks.json` in production. Generate it from the actual package name and Play signing certificate SHA-256 fingerprint. For an iOS app, do not supply made-up provisioning profiles or placeholder bundle IDs.

### Potential initial listing copy (review before use)
**Title:** Suppressor Studio

**Short description:** Explore educational acoustics, materials and suppressor-related terminology in an interactive concept workspace.

**Long description:** Suppressor Studio is an educational reference and concept-sketch workspace. Browse general materials-science articles, sound and hearing-protection topics, commercial design terminology, and read-only community research profiles. Save and revisit your study settings and export non-dimensional summaries and backups. A separate generic calibration cube demonstrates standard STL and 3MF file formats. This application does not certify designs, provide manufacturing approval, or supply printable firearm suppressor components.

**Content disclosure:** Firearm suppressor terminology and conceptual diagrams are presented for educational discussion. The publisher should accurately disclose this content to each store.

## Official documentation
- Microsoft Store enrollment: https://learn.microsoft.com/en-us/windows/apps/publish/partner-center/open-a-developer-account
- Microsoft Store policies: https://learn.microsoft.com/en-us/windows/apps/publish/store-policies
- Google Play policies: https://support.google.com/googleplay/android-developer/answer/9878810
- Google account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Google testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Android Trusted Web Activity: https://developer.android.com/develop/ui/views/layout/webapps/guide-trusted-web-activities-version2
- Apple App Review: https://developer.apple.com/app-store/review/guidelines/
- Apple account deletion: https://developer.apple.com/support/offering-account-deletion-in-your-app/
