Pollinations.ai Daily Model Tester 🚀

An automated testing suite for evaluating different AI image generation models provided by Pollinations.ai.

📌 Overview

This repository contains a Python script that systematically tests various text-to-image models (like Flux, Google Imagen 4, and FLUX.2 Klein).
It utilizes GitHub Actions to run automatically every day, ensuring the models are generating outputs correctly.

⚙️ How it Works

1.A GitHub Actions workflow runs daily (cron job).

2.The Python script securely fetches the POLLINATIONS_API_KEY from GitHub Secrets.

3.It sends a complex test prompt to multiple models.

4.The generated images are saved as artifacts, and a daily log is updated automatically.

🛡️ Security

The API keys are never hardcoded. The project uses Environment Variables and GitHub Repository Secrets to protect user Pollen from unauthorized usage.

🤖 Tested Models

* Flux Schnell (flux)
* Z-Image Turbo (zimage)
* Google Imagen 4 Alpha (imagen-4)
* FLUX.2 Klein 4B & 9B (klein, klein-large)
* GPT Image 1 Mini (gptimage)
