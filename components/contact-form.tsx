"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";

const EMAIL_ADDRESS = "tejakrishnatata@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type ContactFormProps = {
  /** Apps Script Web App /exec URL. Presence is enforced by the caller. */
  endpoint: string;
};

export function ContactForm({ endpoint }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: hidden from humans, tempting to bots. Pretend success, send nothing.
    const honeypot = (data.get("company") ?? "").toString().trim();
    if (honeypot !== "") {
      setStatus("success");
      return;
    }

    const name = (data.get("name") ?? "").toString().trim();
    const email = (data.get("email") ?? "").toString().trim();
    const message = (data.get("message") ?? "").toString().trim();

    const errors: FieldErrors = {};
    if (name === "") errors.name = "Please enter your name.";
    if (email === "") {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = "That email address doesn't look right.";
    }
    if (message === "") errors.message = "Please write a short message.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Move focus to the first invalid field so keyboard and screen reader
      // users land on what needs fixing — aria-describedby is already wired,
      // so focusing announces the label together with its error message.
      const firstInvalid = (["name", "email", "message"] as const).find(
        (key) => errors[key] !== undefined,
      );
      if (firstInvalid) {
        document.getElementById(`contact-${firstInvalid}`)?.focus();
      }
      return;
    }

    setStatus("sending");
    try {
      // Plain urlencoded POST: a CORS-safelisted content type, so the browser
      // sends it as a simple request with no preflight — what Apps Script needs.
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name, email, message }).toString(),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-line bg-background p-8 sm:p-10"
      >
        <CheckCircle2 size={28} className="text-accent" aria-hidden="true" />
        <h3 className="mt-4 font-display text-xl font-semibold tracking-display">
          Message sent.
        </h3>
        <p className="mt-2 text-muted">
          I&rsquo;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link mt-6 text-sm font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  const isSending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSending}
      className="rounded-xl border border-line bg-background p-6 sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={fieldErrors.name !== undefined}
            aria-describedby={
              fieldErrors.name !== undefined ? "contact-name-error" : undefined
            }
            className="field-input"
          />
          {fieldErrors.name !== undefined && (
            <p id="contact-name-error" className="field-error">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="field-label">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={fieldErrors.email !== undefined}
            aria-describedby={
              fieldErrors.email !== undefined
                ? "contact-email-error"
                : undefined
            }
            className="field-input"
          />
          {fieldErrors.email !== undefined && (
            <p id="contact-email-error" className="field-error">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="field-label">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            aria-invalid={fieldErrors.message !== undefined}
            aria-describedby={
              fieldErrors.message !== undefined
                ? "contact-message-error"
                : undefined
            }
            className="field-input resize-y"
          />
          {fieldErrors.message !== undefined && (
            <p id="contact-message-error" className="field-error">
              {fieldErrors.message}
            </p>
          )}
        </div>

        {/* Honeypot — visually hidden and untabbable; real users never fill it */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {status === "error" && (
          <div
            role="alert"
            className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300"
          >
            Something went wrong sending your message. Please try again, or{" "}
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="underline underline-offset-2"
            >
              email me directly
            </a>
            .
          </div>
        )}

        <button
          type="submit"
          disabled={isSending}
          className="btn btn-primary w-full disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          <Send size={16} aria-hidden="true" />
          {isSending ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
